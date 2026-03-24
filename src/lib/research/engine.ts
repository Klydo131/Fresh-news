import type {
  ResearchQuery,
  ResearchReport,
  SourceArticle,
  AnalyzedArticle,
  ResearchPhase,
} from "@/types";
import { callLLM } from "@/lib/llm/providers";
import { gatherSources } from "@/lib/search";
import { validateEnum } from "@/lib/security/sanitize";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  SYNTHESIS_SYSTEM_PROMPT,
  buildSynthesisPrompt,
} from "./prompts";

type PhaseCallback = (phase: ResearchPhase, partial?: Partial<ResearchReport>) => void;

const VALID_SENTIMENTS = ["positive", "negative", "neutral", "mixed"] as const;

function safeJsonParse(text: string): Record<string, unknown> | null {
  // Try to extract JSON from the response (LLMs sometimes wrap in markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Validate and coerce an array of strings from untrusted JSON */
function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.slice(0, 1000)); // cap individual string length
}

async function analyzeArticle(
  article: SourceArticle,
  query: ResearchQuery
): Promise<AnalyzedArticle> {
  const response = await callLLM({
    provider: query.llmProvider,
    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
    userPrompt: buildAnalysisPrompt(article.title, article.snippet, article.source),
    temperature: 0.2,
  });

  const parsed = safeJsonParse(response.content);

  if (!parsed) {
    return {
      id: `analysis-${article.id}`,
      article,
      analysis: {
        summary: "Analysis could not be parsed.",
        keyFacts: [],
        potentialBiases: ["Unable to analyze"],
        biasScore: 5,
        sentiment: "neutral",
        credibilityNotes: "Analysis failed - manual review recommended.",
      },
    };
  }

  // Runtime schema validation — never trust LLM output shapes
  const biasScoreRaw = Number(parsed.biasScore);
  const biasScore = Number.isFinite(biasScoreRaw)
    ? Math.min(10, Math.max(0, Math.round(biasScoreRaw)))
    : 5;

  return {
    id: `analysis-${article.id}`,
    article,
    analysis: {
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 2000) : "No summary available.",
      keyFacts: safeStringArray(parsed.keyFacts),
      potentialBiases: safeStringArray(parsed.potentialBiases),
      biasScore,
      sentiment: validateEnum(parsed.sentiment, VALID_SENTIMENTS, "neutral"),
      credibilityNotes: typeof parsed.credibilityNotes === "string"
        ? parsed.credibilityNotes.slice(0, 2000)
        : "",
    },
  };
}

export async function runResearch(
  query: ResearchQuery,
  onPhase?: PhaseCallback
): Promise<ResearchReport> {
  const report: ResearchReport = {
    id: `research-${Date.now()}`,
    query,
    timestamp: new Date().toISOString(),
    sources: [],
    articles: [],
    synthesis: {
      overview: "",
      consensusPoints: [],
      conflictingPoints: [],
      informationGaps: [],
      recommendation: "",
    },
    phase: "searching",
  };

  // Phase 1: Search
  onPhase?.("searching", report);
  const sources = await gatherSources(query);
  report.sources = sources;

  if (sources.length === 0) {
    report.phase = "complete";
    report.synthesis.overview = "No sources found for this topic. Try a different query.";
    onPhase?.("complete", report);
    return report;
  }

  // Phase 2: Gather (limit articles to analyze based on depth)
  onPhase?.("gathering", report);
  const maxArticles = query.depth === "quick" ? 3 : query.depth === "deep" ? 10 : 5;
  const toAnalyze = sources.slice(0, maxArticles);

  // Phase 3: Analyze each article with the chosen LLM
  onPhase?.("analyzing", report);
  const batchSize = 3;
  const analyzed: AnalyzedArticle[] = [];

  for (let i = 0; i < toAnalyze.length; i += batchSize) {
    const batch = toAnalyze.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((article) => analyzeArticle(article, query))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        analyzed.push(result.value);
      }
    }
  }

  report.articles = analyzed;

  // Phase 4: Synthesize all analyses into a unified report
  onPhase?.("synthesizing", report);

  const synthesisInput = analyzed.map((a) => ({
    source: a.article.source,
    summary: a.analysis.summary,
    biasScore: a.analysis.biasScore,
    keyFacts: a.analysis.keyFacts,
  }));

  const synthesisResponse = await callLLM({
    provider: query.llmProvider,
    systemPrompt: SYNTHESIS_SYSTEM_PROMPT,
    userPrompt: buildSynthesisPrompt(query.topic, synthesisInput),
    temperature: 0.3,
  });

  const synthParsed = safeJsonParse(synthesisResponse.content);

  if (synthParsed) {
    report.synthesis = {
      overview: typeof synthParsed.overview === "string"
        ? synthParsed.overview.slice(0, 3000)
        : "",
      consensusPoints: safeStringArray(synthParsed.consensusPoints),
      conflictingPoints: safeStringArray(synthParsed.conflictingPoints),
      informationGaps: safeStringArray(synthParsed.informationGaps),
      recommendation: typeof synthParsed.recommendation === "string"
        ? synthParsed.recommendation.slice(0, 2000)
        : "",
    };
  }

  // Done
  report.phase = "complete";
  onPhase?.("complete", report);
  return report;
}
