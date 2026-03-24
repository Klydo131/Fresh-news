import type { SearchResult } from "@/types";
import { sanitizeUrl, safeHostname } from "@/lib/security/sanitize";

/**
 * Web search providers - Tavily and Serper.
 * These power the "deep research" side, searching the live web.
 *
 * Security: All URLs are validated. All fetch calls have timeouts.
 * API keys are sent via headers or POST body, never in URL params.
 */

const SEARCH_TIMEOUT_MS = 10_000;

export async function searchTavily(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey, // Tavily requires key in body (their API design)
      query,
      search_depth: "advanced",
      include_answer: false,
      max_results: 10,
    }),
    signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
  });

  if (!res.ok) return [];

  const data = await res.json();
  const results: SearchResult[] = [];

  for (const r of data.results || []) {
    const url = sanitizeUrl(r.url);
    if (!url) continue;

    results.push({
      title: String(r.title || "").slice(0, 500),
      url,
      snippet: String(r.content || "").slice(0, 2000),
      source: safeHostname(url),
      publishedAt: r.published_date,
    });
  }

  return results;
}

export async function searchSerper(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey, // Key in header, not URL
    },
    body: JSON.stringify({ q: query, num: 10 }),
    signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
  });

  if (!res.ok) return [];

  const data = await res.json();
  const results: SearchResult[] = [];

  for (const r of data.news || []) {
    const url = sanitizeUrl(r.link);
    if (!url) continue;

    results.push({
      title: String(r.title || "").slice(0, 500),
      url,
      snippet: String(r.snippet || "").slice(0, 2000),
      source: String(r.source || safeHostname(url)),
      publishedAt: r.date,
    });
  }

  return results;
}

export async function webSearch(query: string): Promise<SearchResult[]> {
  const [tavilyResults, serperResults] = await Promise.allSettled([
    searchTavily(query),
    searchSerper(query),
  ]);

  const results: SearchResult[] = [];

  if (tavilyResults.status === "fulfilled") {
    results.push(...tavilyResults.value);
  }
  if (serperResults.status === "fulfilled") {
    results.push(...serperResults.value);
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
