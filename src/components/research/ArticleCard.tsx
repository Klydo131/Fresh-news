"use client";

import { useState } from "react";
import { useResearchStore } from "@/lib/store/research-store";
import type { AnalyzedArticle, UserVerdict } from "@/types";

function BiasBar({ score }: { score: number }) {
  const color =
    score <= 3
      ? "bg-green-500"
      : score <= 6
        ? "bg-yellow-500"
        : "bg-red-500";
  const label =
    score <= 3 ? "Low bias" : score <= 6 ? "Moderate bias" : "High bias";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {label} ({score}/10)
      </span>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const styles: Record<string, string> = {
    positive: "bg-green-500/10 text-green-400",
    negative: "bg-red-500/10 text-red-400",
    neutral: "bg-gray-500/10 text-gray-400",
    mixed: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${styles[sentiment] || styles.neutral}`}
    >
      {sentiment}
    </span>
  );
}

export function ArticleCard({ article }: { article: AnalyzedArticle }) {
  const { verdicts, setVerdict } = useResearchStore();
  const [expanded, setExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const verdict = verdicts[article.id];
  const { analysis } = article;

  const handleVerdict = (v: UserVerdict) => {
    if (v === "reject" && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    setVerdict(article.id, v, v === "reject" ? rejectReason : undefined);
    setShowRejectInput(false);
  };

  return (
    <div
      className={`glass rounded-lg p-4 fade-in transition-all ${
        verdict?.verdict === "accept"
          ? "border-green-500/30"
          : verdict?.verdict === "reject"
            ? "border-red-500/30 opacity-60"
            : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <a
            href={article.article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white hover:text-fresh-400 transition-colors line-clamp-2"
          >
            {article.article.title}
          </a>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--neutral)]">
              {article.article.source}
            </span>
            <SentimentBadge sentiment={analysis.sentiment} />
          </div>
        </div>
      </div>

      {/* Bias indicator */}
      <BiasBar score={analysis.biasScore} />

      {/* AI Summary */}
      <p className="text-sm text-gray-300 mt-3 leading-relaxed">
        {analysis.summary}
      </p>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-fresh-500 hover:text-fresh-400 mt-2 transition-colors"
      >
        {expanded ? "Show less" : "Show detailed analysis"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 text-xs fade-in">
          {/* Key Facts */}
          {analysis.keyFacts.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-400 mb-1">Key Facts</h4>
              <ul className="space-y-1">
                {analysis.keyFacts.map((fact, i) => (
                  <li key={i} className="text-gray-300 flex items-start gap-1.5">
                    <span className="text-fresh-500 mt-0.5">-</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Biases detected */}
          {analysis.potentialBiases.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-400 mb-1">
                Potential Biases Detected
              </h4>
              <ul className="space-y-1">
                {analysis.potentialBiases.map((bias, i) => (
                  <li key={i} className="text-yellow-300/70 flex items-start gap-1.5">
                    <span className="text-yellow-500 mt-0.5">!</span>
                    {bias}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Credibility */}
          <div>
            <h4 className="font-medium text-gray-400 mb-1">
              Credibility Notes
            </h4>
            <p className="text-gray-400">{analysis.credibilityNotes}</p>
          </div>
        </div>
      )}

      {/* User Verdict Buttons */}
      {!verdict && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--neutral)] mr-auto">
            Your verdict:
          </span>
          <button
            onClick={() => handleVerdict("accept")}
            className="text-xs px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleVerdict("unsure")}
            className="text-xs px-3 py-1.5 rounded-md bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20 transition-colors"
          >
            Unsure
          </button>
          <button
            onClick={() => handleVerdict("reject")}
            className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            Reject
          </button>
        </div>
      )}

      {/* Reject reason input */}
      {showRejectInput && !verdict && (
        <div className="mt-2 flex gap-2 fade-in">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Why reject? (optional)"
            className="flex-1 text-xs px-3 py-1.5 rounded-md bg-[var(--card)] border border-[var(--border)] text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => handleVerdict("reject")}
            className="text-xs px-3 py-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Verdict display */}
      {verdict && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              verdict.verdict === "accept"
                ? "bg-green-500/10 text-green-400"
                : verdict.verdict === "reject"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-500/10 text-gray-400"
            }`}
          >
            {verdict.verdict === "accept"
              ? "Accepted"
              : verdict.verdict === "reject"
                ? "Rejected"
                : "Unsure"}
          </span>
          {verdict.reason && (
            <span className="text-xs text-gray-500">
              &mdash; {verdict.reason}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
