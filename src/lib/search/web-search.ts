import type { SearchResult } from "@/types";

/**
 * Web search providers - Tavily and Serper
 * These power the "deep research" side, searching the live web.
 */

export async function searchTavily(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      include_answer: false,
      max_results: 10,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.results || []).map(
    (r: { title: string; url: string; content: string; published_date?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
      source: new URL(r.url).hostname,
      publishedAt: r.published_date,
    })
  );
}

export async function searchSerper(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({ q: query, num: 10 }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.news || []).map(
    (r: { title: string; link: string; snippet: string; source: string; date?: string }) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
      source: r.source,
      publishedAt: r.date,
    })
  );
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
