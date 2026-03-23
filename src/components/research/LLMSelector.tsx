"use client";

import { useResearchStore } from "@/lib/store/research-store";
import type { LLMProvider } from "@/types";
import { LLM_OPTIONS } from "@/types";

const providerIcons: Record<LLMProvider, string> = {
  claude: "A",
  openai: "O",
  gemini: "G",
  groq: "Q",
};

const providerColors: Record<LLMProvider, string> = {
  claude: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  openai: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  gemini: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  groq: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function LLMSelector() {
  const { selectedProvider, setProvider } = useResearchStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--neutral)]">
        Choose your AI analyst
      </label>
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(LLM_OPTIONS) as [LLMProvider, (typeof LLM_OPTIONS)[LLMProvider]][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => setProvider(key)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedProvider === key
                  ? `${providerColors[key]} border-current glow-green`
                  : "border-[var(--border)] hover:border-[var(--neutral)] text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                    selectedProvider === key
                      ? providerColors[key]
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {providerIcons[key]}
                </span>
                <div>
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className="text-xs text-gray-500">
                    {config.description}
                  </div>
                </div>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
