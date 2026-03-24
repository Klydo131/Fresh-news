"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { LLMSelector } from "@/components/research/LLMSelector";
import { SearchBar } from "@/components/research/SearchBar";
import { PhaseIndicator } from "@/components/research/PhaseIndicator";
import { ArticleCard } from "@/components/research/ArticleCard";
import { SynthesisPanel } from "@/components/research/SynthesisPanel";
import { VerdictSummary } from "@/components/research/VerdictSummary";
import { useResearchStore } from "@/lib/store/research-store";

function DemoBanner() {
  return (
    <div className="glass rounded-lg p-3 border-fresh-500/20 text-center fade-in">
      <p className="text-sm text-fresh-400">
        Demo Mode — showing pre-built research on &quot;AI regulation&quot;
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Add your API keys in <code>.env</code> to research any topic live
      </p>
    </div>
  );
}

function HomeContent() {
  const { phase, report, error, reset, isDemo, startDemo } = useResearchStore();
  const searchParams = useSearchParams();

  // Auto-start demo if ?demo=true is in the URL
  useEffect(() => {
    if (searchParams.get("demo") === "true" && phase === "idle") {
      startDemo();
    }
  }, [searchParams, phase, startDemo]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Hero / Intro */}
        {phase === "idle" && (
          <div className="text-center py-8 fade-in">
            <h2 className="text-2xl font-bold mb-2">
              Research any topic. Question everything.
            </h2>
            <p className="text-[var(--neutral)] max-w-lg mx-auto text-sm">
              Fresh News searches the web, gathers sources, and uses your chosen
              AI to analyze each article for bias, facts, and credibility.{" "}
              <span className="text-white">You make the final call.</span>
            </p>

            {/* Quick actions */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => startDemo()}
                className="px-5 py-2.5 rounded-lg bg-fresh-600 text-white text-sm font-medium hover:bg-fresh-500 transition-colors"
              >
                Try Demo
              </button>
              <Link
                href="/tutorial"
                className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <SearchBar />
          <LLMSelector />
        </div>

        {/* Demo banner */}
        {isDemo && phase === "complete" && <DemoBanner />}

        {/* Phase progress */}
        <PhaseIndicator />

        {/* Error state */}
        {phase === "error" && error && (
          <div className="glass rounded-lg p-4 border-red-500/30 fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-400">
                  Research failed
                </h3>
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </div>
              <button
                onClick={reset}
                className="text-xs px-3 py-1 rounded-md bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {report && phase === "complete" && (
          <div className="space-y-6 fade-in">
            {/* Stats bar */}
            <div className="flex items-center justify-between text-xs text-[var(--neutral)]">
              <span>
                Found {report.sources.length} sources, analyzed{" "}
                {report.articles.length} articles
              </span>
              <button
                onClick={reset}
                className="text-fresh-500 hover:text-fresh-400 transition-colors"
              >
                New research
              </button>
            </div>

            {/* Synthesis */}
            <SynthesisPanel />

            {/* Verdict summary */}
            <VerdictSummary />

            {/* Article cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--neutral)]">
                Analyzed Sources — review and give your verdict
              </h3>
              {report.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 py-8 border-t border-[var(--border)]">
          <p>
            Fresh News AI Research Machine — The AI analyzes, you decide.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link
              href="/tutorial"
              className="text-gray-500 hover:text-fresh-500 transition-colors"
            >
              Tutorial
            </Link>
            <span className="text-gray-700">|</span>
            <a
              href="https://github.com/Klydo131/Fresh-news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-fresh-500 transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
