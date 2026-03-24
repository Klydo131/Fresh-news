"use client";

import { useResearchStore } from "@/lib/store/research-store";
import type { ResearchPhase } from "@/types";

const phaseLabels: Record<ResearchPhase, string> = {
  idle: "Ready",
  searching: "Searching the web & news feeds...",
  gathering: "Gathering articles...",
  analyzing: "AI is analyzing each source for bias & facts...",
  synthesizing: "Synthesizing a balanced overview...",
  complete: "Research complete",
  error: "Error occurred",
};

const phaseSteps: ResearchPhase[] = [
  "searching",
  "gathering",
  "analyzing",
  "synthesizing",
  "complete",
];

export function PhaseIndicator() {
  const { phase } = useResearchStore();

  if (phase === "idle") return null;

  const currentIndex = phaseSteps.indexOf(phase);

  return (
    <div className="glass rounded-lg p-4 fade-in">
      <div className="flex items-center gap-3 mb-3">
        {phase !== "complete" && phase !== "error" && (
          <div className="w-2 h-2 rounded-full bg-fresh-500 pulse-dot" />
        )}
        {phase === "complete" && (
          <div className="w-2 h-2 rounded-full bg-fresh-500" />
        )}
        {phase === "error" && (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
        <span className="text-sm font-medium">{phaseLabels[phase]}</span>
      </div>

      {/* Progress steps */}
      <div className="flex gap-1">
        {phaseSteps.map((step, i) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentIndex
                ? phase === "error"
                  ? "bg-red-500"
                  : "bg-fresh-500"
                : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
