"use client";

import { useResearchStore } from "@/lib/store/research-store";
import { useState } from "react";

export function SearchBar() {
  const { currentTopic, setTopic, startResearch, phase, searchDepth, setDepth } =
    useResearchStore();
  const [inputValue, setInputValue] = useState("");

  const isLoading = phase !== "idle" && phase !== "complete" && phase !== "error";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    setTopic(inputValue);
    startResearch();
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setTopic(e.target.value);
          }}
          placeholder="Enter a news topic to research..."
          className="flex-1 px-4 py-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-white placeholder-gray-500 focus:outline-none focus:border-fresh-500 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-6 py-3 rounded-lg bg-fresh-600 text-white font-medium hover:bg-fresh-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Researching..." : "Research"}
        </button>
      </form>

      {/* Depth selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--neutral)]">Depth:</span>
        {(["quick", "standard", "deep"] as const).map((depth) => (
          <button
            key={depth}
            onClick={() => setDepth(depth)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              searchDepth === depth
                ? "border-fresh-500 text-fresh-400 bg-fresh-500/10"
                : "border-[var(--border)] text-gray-500 hover:text-gray-400"
            }`}
          >
            {depth === "quick" ? "Quick (3 sources)" : depth === "standard" ? "Standard (5 sources)" : "Deep (10 sources)"}
          </button>
        ))}
      </div>
    </div>
  );
}
