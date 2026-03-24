"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-fresh-500 flex items-center justify-center text-black font-bold text-sm">
            FN
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Fresh News</h1>
            <p className="text-xs text-[var(--neutral)]">
              AI Research Machine
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/tutorial"
            className="text-xs text-[var(--neutral)] hover:text-fresh-400 transition-colors"
          >
            How It Works
          </Link>
          <a
            href="https://github.com/Klydo131/Fresh-news"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--neutral)] hover:text-fresh-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
