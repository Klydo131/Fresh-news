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
  isDemo: boolean;

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
  startDemo: () => Promise<void>;
  setVerdict: (articleId: string, verdict: UserVerdict, reason?: string) => void;
  reset: () => void;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
  selectedProvider: "claude",
  searchDepth: "standard",
  isDemo: false,
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

    set({ phase: "searching", error: null, report: null, verdicts: {}, isDemo: false });

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

  startDemo: async () => {
    set({
      phase: "searching",
      error: null,
      report: null,
      verdicts: {},
      isDemo: true,
      currentTopic: "AI regulation",
    });

    // Simulate the research phases with delays so users see the pipeline
    const phases: ResearchPhase[] = ["searching", "gathering", "analyzing", "synthesizing"];
    for (const phase of phases) {
      set({ phase });
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const res = await fetch("/api/demo", { method: "POST" });
      if (!res.ok) throw new Error("Demo failed to load");

      const report: ResearchReport = await res.json();
      set({ report, phase: "complete" });
    } catch (err) {
      set({
        phase: "error",
        error: err instanceof Error ? err.message : "Demo failed to load",
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
      isDemo: false,
    }),
}));
