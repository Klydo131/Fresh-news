"use client";

import { useResearchStore } from "@/lib/store/research-store";

export function SynthesisPanel() {
  const { report } = useResearchStore();

  if (!report || !report.synthesis.overview) return null;

  const { synthesis } = report;

  return (
    <div className="glass rounded-lg p-6 fade-in space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-fresh-500" />
        Research Synthesis
      </h2>

      {/* Overview */}
      <p className="text-sm text-gray-300 leading-relaxed">
        {synthesis.overview}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Consensus */}
        {synthesis.consensusPoints.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-400">
              Points of Consensus
            </h3>
            <ul className="space-y-1">
              {synthesis.consensusPoints.map((point, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-300 flex items-start gap-1.5"
                >
                  <span className="text-green-500 mt-0.5 shrink-0">+</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conflicts */}
        {synthesis.conflictingPoints.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-yellow-400">
              Conflicting Reports
            </h3>
            <ul className="space-y-1">
              {synthesis.conflictingPoints.map((point, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-300 flex items-start gap-1.5"
                >
                  <span className="text-yellow-500 mt-0.5 shrink-0">~</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Information Gaps */}
      {synthesis.informationGaps.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-blue-400">
            Information Gaps
          </h3>
          <ul className="space-y-1">
            {synthesis.informationGaps.map((gap, i) => (
              <li
                key={i}
                className="text-xs text-gray-300 flex items-start gap-1.5"
              >
                <span className="text-blue-500 mt-0.5 shrink-0">?</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {synthesis.recommendation && (
        <div className="p-3 rounded-lg bg-fresh-500/5 border border-fresh-500/10">
          <h3 className="text-sm font-medium text-fresh-400 mb-1">
            Reader Advisory
          </h3>
          <p className="text-xs text-gray-300">{synthesis.recommendation}</p>
        </div>
      )}
    </div>
  );
}
