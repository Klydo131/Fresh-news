"use client";

import { create } from "zustand";
import type {
  LLMProvider,
  ResearchPhase,
  ResearchReport,
  ArticleVerdict,
  UserVerdict,
} from "@/types";

interface ResearchState {
  // Settings
  selectedProvider: LLMProvider;
  searchDepth: "quick" | "standard" | "deep";

  // Research state
  currentTopic: string;
  phase: ResearchPhase;
  report: ResearchReport | null;
  error: string | null;

  // User verdicts
  verdicts: Record<string, ArticleVerdict>;

  // Actions
  setProvider: (provider: LLMProvider) => void;
  setDepth: (depth: "quick" | "standard" | "deep") => void;
  setTopic: (topic: string) => void;
  startResearch: () => Promise<void>;
  setVerdict: (articleId: string, verdict: UserVerdict, reason?: string) => void;
  reset: () => void;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  selectedProvider: "claude",
  searchDepth: "standard",
  currentTopic: "",
  phase: "idle",
  report: null,
  error: null,
  verdicts: {},

  setProvider: (provider) => set({ selectedProvider: provider }),
  setDepth: (depth) => set({ searchDepth: depth }),
  setTopic: (topic) => set({ currentTopic: topic }),

  startResearch: async () => {
    const { currentTopic, selectedProvider, searchDepth } = get();
    if (!currentTopic.trim()) return;

    set({ phase: "searching", error: null, report: null, verdicts: {} });

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentTopic,
          llmProvider: selectedProvider,
          depth: searchDepth,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Research failed");
      }

      const report: ResearchReport = await res.json();
      set({ report, phase: "complete" });
    } catch (err) {
      set({
        phase: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  setVerdict: (articleId, verdict, reason) => {
    set((state) => ({
      verdicts: {
        ...state.verdicts,
        [articleId]: {
          articleId,
          verdict,
          reason,
          timestamp: new Date().toISOString(),
        },
      },
    }));
  },

  reset: () =>
    set({
      phase: "idle",
      report: null,
      error: null,
      verdicts: {},
      currentTopic: "",
    }),
}));
