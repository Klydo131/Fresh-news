import type {
  ResearchQuery,
  ResearchReport,
  SourceArticle,
  AnalyzedArticle,
  ResearchPhase,
} from "@/types";
import { callLLM } from "@/lib/llm/providers";
import { gatherSources } from "@/lib/search";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  SYNTHESIS_SYSTEM_PROMPT,
  buildSynthesisPrompt,
} from "./prompts";

type PhaseCallback = (phase: ResearchPhase, partial?: Partial<ResearchReport>) => void;

function safeJsonParse<T>(text: string): T | null {
  // Try to extract JSON from the response (LLMs sometimes wrap in markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
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

  const parsed = safeJsonParse<{
    summary: string;
    keyFacts: string[];
    potentialBiases: string[];
    biasScore: number;
    sentiment: string;
    credibilityNotes: string;
  }>(response.content);

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

  return {
    id: `analysis-${article.id}`,
    article,
    analysis: {
      summary: parsed.summary,
      keyFacts: parsed.keyFacts || [],
      potentialBiases: parsed.potentialBiases || [],
      biasScore: Math.min(10, Math.max(0, parsed.biasScore || 0)),
      sentiment: (parsed.sentiment as AnalyzedArticle["analysis"]["sentiment"]) || "neutral",
      credibilityNotes: parsed.credibilityNotes || "",
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
  const batchSize = 3; // Analyze in batches to avoid rate limits
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

  const synthParsed = safeJsonParse<{
    overview: string;
    consensusPoints: string[];
    conflictingPoints: string[];
    informationGaps: string[];
    recommendation: string;
  }>(synthesisResponse.content);

  if (synthParsed) {
    report.synthesis = {
      overview: synthParsed.overview,
      consensusPoints: synthParsed.consensusPoints || [],
      conflictingPoints: synthParsed.conflictingPoints || [],
      informationGaps: synthParsed.informationGaps || [],
      recommendation: synthParsed.recommendation || "",
    };
  }

  // Done
  report.phase = "complete";
  onPhase?.("complete", report);
  return report;
}
