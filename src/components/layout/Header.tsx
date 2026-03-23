"use client";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-fresh-500 flex items-center justify-center text-black font-bold text-sm">
            FN
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Fresh News</h1>
            <p className="text-xs text-[var(--neutral)]">
              AI Research Machine
            </p>
          </div>
        </div>
        <div className="text-xs text-[var(--neutral)]">
          Inspired by Karpathy&apos;s auto-search
        </div>
      </div>
    </header>
  );
}
