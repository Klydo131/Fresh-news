"use client";

import { useResearchStore } from "@/lib/store/research-store";

export function VerdictSummary() {
  const { report, verdicts } = useResearchStore();

  if (!report || report.articles.length === 0) return null;

  const totalArticles = report.articles.length;
  const verdictValues = Object.values(verdicts);
  const accepted = verdictValues.filter((v) => v.verdict === "accept").length;
  const rejected = verdictValues.filter((v) => v.verdict === "reject").length;
  const unsure = verdictValues.filter((v) => v.verdict === "unsure").length;
  const pending = totalArticles - verdictValues.length;

  if (verdictValues.length === 0) return null;

  return (
    <div className="glass rounded-lg p-4 fade-in">
      <h3 className="text-sm font-medium mb-3">Your Verdicts</h3>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-400">{accepted} accepted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-400">{rejected} rejected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-400">{unsure} unsure</span>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-700" />
            <span className="text-gray-500">{pending} pending</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex gap-0.5 mt-3 h-1.5 rounded-full overflow-hidden">
        {accepted > 0 && (
          <div
            className="bg-green-500 rounded-full"
            style={{ width: `${(accepted / totalArticles) * 100}%` }}
          />
        )}
        {rejected > 0 && (
          <div
            className="bg-red-500 rounded-full"
            style={{ width: `${(rejected / totalArticles) * 100}%` }}
          />
        )}
        {unsure > 0 && (
          <div
            className="bg-gray-500 rounded-full"
            style={{ width: `${(unsure / totalArticles) * 100}%` }}
          />
        )}
        {pending > 0 && (
          <div
            className="bg-gray-800 rounded-full"
            style={{ width: `${(pending / totalArticles) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}
