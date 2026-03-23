// === LLM Provider Types ===

export type LLMProvider = "claude" | "openai" | "gemini" | "groq";

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  label: string;
  description: string;
}

export const LLM_OPTIONS: Record<LLMProvider, LLMConfig> = {
  claude: {
    provider: "claude",
    model: "claude-sonnet-4-20250514",
    label: "Claude (Anthropic)",
    description: "Strong reasoning, nuanced analysis",
  },
  openai: {
    provider: "openai",
    model: "gpt-4o",
    label: "GPT-4o (OpenAI)",
    description: "Versatile, fast, widely used",
  },
  gemini: {
    provider: "gemini",
    model: "gemini-1.5-pro",
    label: "Gemini Pro (Google)",
    description: "Large context, multimodal capable",
  },
  groq: {
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    label: "Llama 3.1 70B (Groq)",
    description: "Ultra-fast inference, open-source model",
  },
};

// === Search & Source Types ===

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedAt?: string;
}

export type SearchProvider = "tavily" | "serper" | "newsapi" | "rss";

// === Research Pipeline Types ===

export type ResearchPhase =
  | "idle"
  | "searching"
  | "gathering"
  | "analyzing"
  | "synthesizing"
  | "complete"
  | "error";

export interface ResearchQuery {
  topic: string;
  llmProvider: LLMProvider;
  depth: "quick" | "standard" | "deep";
}

export interface SourceArticle {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedAt?: string;
  searchProvider: SearchProvider;
}

export interface AnalyzedArticle {
  id: string;
  article: SourceArticle;
  analysis: {
    summary: string;
    keyFacts: string[];
    potentialBiases: string[];
    biasScore: number; // 0-10, 0 = no detected bias
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    credibilityNotes: string;
  };
}

export interface ResearchReport {
  id: string;
  query: ResearchQuery;
  timestamp: string;
  sources: SourceArticle[];
  articles: AnalyzedArticle[];
  synthesis: {
    overview: string;
    consensusPoints: string[];
    conflictingPoints: string[];
    informationGaps: string[];
    recommendation: string;
  };
  phase: ResearchPhase;
}

// === User Verdict Types ===

export type UserVerdict = "accept" | "reject" | "unsure";

export interface ArticleVerdict {
  articleId: string;
  verdict: UserVerdict;
  reason?: string;
  timestamp: string;
}

export interface ResearchSession {
  report: ResearchReport;
  verdicts: ArticleVerdict[];
}
