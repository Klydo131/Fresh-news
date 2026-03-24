"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    number: 1,
    title: "Choose Your AI",
    description:
      "Pick the LLM that will analyze the news for you. Each model has different strengths.",
    details: [
      "Claude (Anthropic) — Strong nuanced reasoning, great at detecting subtle bias",
      "GPT-4o (OpenAI) — Versatile and fast, widely benchmarked",
      "Gemini Pro (Google) — Large context window, good at multi-source synthesis",
      "Llama 3.1 70B (Groq) — Ultra-fast inference, open-source model",
    ],
    tip: "You can switch models between searches to compare how different AIs analyze the same topic.",
  },
  {
    number: 2,
    title: "Enter a Topic",
    description:
      "Type any news topic you want to research. Be specific for better results.",
    details: [
      '"AI regulation" — broad, gets many perspectives',
      '"US tariffs on Chinese EVs 2026" — specific, gets focused analysis',
      '"climate summit outcomes" — event-driven, gets latest coverage',
      '"tech layoffs impact on housing" — cross-domain, finds hidden connections',
    ],
    tip: "Use the depth control: Quick (3 sources) for a fast scan, Standard (5) for balanced research, Deep (10) for thorough analysis.",
  },
  {
    number: 3,
    title: "Watch the Research Pipeline",
    description:
      "The system works through 4 phases automatically. You can watch it progress in real-time.",
    details: [
      "Searching — queries Tavily, Serper, NewsAPI, and RSS feeds simultaneously",
      "Gathering — collects and deduplicates articles across all sources",
      "Analyzing — your chosen AI reads each article, detects bias, extracts facts",
      "Synthesizing — AI cross-references all sources to find consensus and conflicts",
    ],
    tip: "The pipeline runs multiple search providers in parallel for speed and source diversity.",
  },
  {
    number: 4,
    title: "Read the Synthesis",
    description:
      "The top panel shows the AI's cross-source synthesis — the big picture view.",
    details: [
      "Consensus Points — what multiple sources agree on (highest confidence)",
      "Conflicting Reports — where sources disagree (needs your judgment)",
      "Information Gaps — questions that remain unanswered (areas for further research)",
      "Reader Advisory — what to keep in mind when forming your own opinion",
    ],
    tip: "The synthesis is only as good as the sources found. Check if important perspectives are missing.",
  },
  {
    number: 5,
    title: "Review Each Article",
    description:
      "Below the synthesis, each analyzed source is shown as a card with detailed breakdown.",
    details: [
      "Bias Score (0-10) — visual bar showing detected bias level",
      "Sentiment tag — positive, negative, neutral, or mixed",
      "AI Summary — 2-3 sentence objective summary of the article",
      "Expand for details — key facts, specific biases detected, credibility notes",
    ],
    tip: 'Click "Show detailed analysis" on any card to see exactly what biases were detected and why.',
  },
  {
    number: 6,
    title: "Give Your Verdict",
    description:
      "This is the key feature — YOU make the final call on every piece of news.",
    details: [
      "Accept — you find this article credible and useful",
      "Reject — you find it unreliable, biased, or misleading (optionally say why)",
      "Unsure — you need more information before deciding",
    ],
    tip: "Your verdicts are tracked in the summary bar. This is how Fresh News stays unbiased — the AI analyzes, but you decide what to trust.",
  },
];

export default function TutorialPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] glass sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-fresh-500 flex items-center justify-center text-black font-bold text-sm">
              FN
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Fresh News
              </h1>
              <p className="text-xs text-[var(--neutral)]">How to Use</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-fresh-500 hover:text-fresh-400 transition-colors"
          >
            Back to Research
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">How Fresh News Works</h2>
          <p className="text-[var(--neutral)] max-w-xl mx-auto">
            A step-by-step guide to using the AI Research Machine.
            <br />
            <span className="text-white">6 steps. 2 minutes to learn.</span>
          </p>
        </div>

        {/* Quick start box */}
        <div className="glass rounded-lg p-5 border-fresh-500/20 glow-green">
          <h3 className="text-sm font-semibold text-fresh-400 mb-2">
            Quick Start
          </h3>
          <p className="text-sm text-gray-300">
            Don&apos;t have API keys yet?{" "}
            <Link href="/?demo=true" className="text-fresh-400 underline">
              Try the demo mode
            </Link>{" "}
            — it runs a pre-built research on &quot;AI regulation&quot; with
            realistic results so you can see exactly how everything works.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="glass rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() =>
                  setExpandedStep(expandedStep === index ? null : index)
                }
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    expandedStep === index
                      ? "bg-fresh-500 text-black"
                      : "bg-[var(--card)] text-[var(--neutral)] border border-[var(--border)]"
                  }`}
                >
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-[var(--neutral)] truncate">
                    {step.description}
                  </p>
                </div>
                <span
                  className={`text-[var(--neutral)] transition-transform ${
                    expandedStep === index ? "rotate-180" : ""
                  }`}
                >
                  v
                </span>
              </button>

              {expandedStep === index && (
                <div className="px-4 pb-4 ml-14 space-y-3 fade-in">
                  <p className="text-sm text-gray-300">{step.description}</p>

                  <ul className="space-y-1.5">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-fresh-500 mt-0.5 shrink-0">
                          -
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 rounded-md bg-fresh-500/5 border border-fresh-500/10">
                    <p className="text-xs text-fresh-300">
                      <span className="font-medium">Tip:</span> {step.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Setup section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Setup Guide</h3>

          <div className="glass rounded-lg p-5 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                1. Install & Run
              </h4>
              <pre className="text-xs bg-black/50 rounded-md p-3 overflow-x-auto text-gray-300">
{`git clone https://github.com/Klydo131/Fresh-news.git
cd Fresh-news
npm install
cp .env.example .env
npm run dev`}
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                2. Add API Keys
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                Edit the <code className="text-fresh-400">.env</code> file.
                You need at least <strong>one LLM</strong> and{" "}
                <strong>one search provider</strong>:
              </p>
              <pre className="text-xs bg-black/50 rounded-md p-3 overflow-x-auto text-gray-300">
{`# Pick at least one AI provider:
ANTHROPIC_API_KEY=sk-ant-...     # claude.ai
OPENAI_API_KEY=sk-...            # platform.openai.com
GOOGLE_GENERATIVE_AI_API_KEY=... # aistudio.google.com
GROQ_API_KEY=gsk_...             # console.groq.com

# Pick at least one search source:
TAVILY_API_KEY=tvly-...          # tavily.com (recommended)
SERPER_API_KEY=...               # serper.dev
NEWS_API_KEY=...                 # newsapi.org`}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                RSS feeds (Reuters, AP, BBC, NPR, Al Jazeera) work without any key.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                3. Where to Get Free API Keys
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 shrink-0">-</span>
                  <span>
                    <strong>Groq</strong> — free tier, ultra-fast, great for
                    trying out the app
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 shrink-0">-</span>
                  <span>
                    <strong>Tavily</strong> — 1,000 free searches/month
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fresh-500 shrink-0">-</span>
                  <span>
                    <strong>NewsAPI</strong> — free developer tier for
                    non-commercial use
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="glass rounded-lg p-5 space-y-3">
          <h3 className="text-lg font-bold">Why Fresh News?</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-medium text-fresh-400">
                No editorial layer
              </h4>
              <p className="text-gray-400">
                The AI doesn&apos;t decide what&apos;s important — it analyzes
                what it finds and shows you everything.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-fresh-400">
                Bias detection, not injection
              </h4>
              <p className="text-gray-400">
                The LLM is instructed to detect bias patterns in sources, not
                form its own opinions.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-fresh-400">
                You choose the AI
              </h4>
              <p className="text-gray-400">
                Different models have different tendencies. Pick yours, or
                compare multiple for the same topic.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-fresh-400">
                Your verdict is final
              </h4>
              <p className="text-gray-400">
                Accept, reject, or mark unsure on every article. The AI
                advises, you decide.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 py-6">
          <Link
            href="/?demo=true"
            className="inline-block px-6 py-3 rounded-lg bg-fresh-600 text-white font-medium hover:bg-fresh-500 transition-colors"
          >
            Try the Demo
          </Link>
          <p className="text-xs text-[var(--neutral)]">
            No API keys needed — see real results instantly
          </p>
        </div>
      </main>
    </div>
  );
}
