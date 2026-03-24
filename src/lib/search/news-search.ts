import type { SearchResult } from "@/types";
import { sanitizeUrl, stripHtml } from "@/lib/security/sanitize";

/**
 * Structured news sources - NewsAPI and RSS feeds.
 * These power the "fresh headlines" side.
 *
 * Security: All URLs are validated. HTML is stripped properly.
 * API keys are sent via headers where possible.
 * All fetch calls have explicit timeouts.
 */

const SEARCH_TIMEOUT_MS = 10_000;
const RSS_TIMEOUT_MS = 5_000;

export async function searchNewsAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  // NewsAPI requires the key as a query param or header — we use the header
  const params = new URLSearchParams({
    q: query,
    sortBy: "publishedAt",
    pageSize: "15",
    language: "en",
  });

  const res = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
    {
      headers: { "X-Api-Key": apiKey }, // Key in header, not URL
      signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const results: SearchResult[] = [];

  for (const a of data.articles || []) {
    const url = sanitizeUrl(a.url);
    if (!url) continue;

    results.push({
      title: String(a.title || "").slice(0, 500),
      url,
      snippet: String(a.description || "").slice(0, 2000),
      source: String(a.source?.name || "Unknown"),
      publishedAt: a.publishedAt,
    });
  }

  return results;
}

// Built-in RSS feeds for major news sources (no API key needed)
const RSS_FEEDS: Record<string, string> = {
  Reuters: "https://feeds.reuters.com/reuters/topNews",
  "AP News": "https://rsshub.app/apnews/topics/apf-topnews",
  BBC: "https://feeds.bbci.co.uk/news/rss.xml",
  NPR: "https://feeds.npr.org/1001/rss.xml",
  "Al Jazeera": "https://www.aljazeera.com/xml/rss/all.xml",
};

export async function searchRSS(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  for (const [sourceName, feedUrl] of Object.entries(RSS_FEEDS)) {
    try {
      const res = await fetch(feedUrl, {
        signal: AbortSignal.timeout(RSS_TIMEOUT_MS),
      });
      if (!res.ok) continue;

      const xml = await res.text();

      // Simple XML item extraction
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (const item of items.slice(0, 5)) {
        const titleRaw =
          item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          item.match(/<title>(.*?)<\/title>/)?.[1] ||
          "";
        const linkRaw = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
        const descRaw =
          item.match(
            /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/
          )?.[1] ||
          item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
          "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        // Validate URL
        const url = sanitizeUrl(linkRaw);
        if (!url) continue;

        // Strip HTML safely
        const title = stripHtml(titleRaw).slice(0, 500);
        const snippet = stripHtml(descRaw).slice(0, 300);

        // Filter by relevance to query
        const text = `${title} ${snippet}`.toLowerCase();
        if (
          text.includes(queryLower) ||
          queryLower.split(" ").some((w) => w.length > 2 && text.includes(w))
        ) {
          results.push({
            title,
            url,
            snippet,
            source: sourceName,
            publishedAt: pubDate,
          });
        }
      }
    } catch {
      // Skip failed feeds silently — logged server-side in production
    }
  }

  return results;
}

export async function newsSearch(query: string): Promise<SearchResult[]> {
  const [newsApiResults, rssResults] = await Promise.allSettled([
    searchNewsAPI(query),
    searchRSS(query),
  ]);

  const results: SearchResult[] = [];

  if (newsApiResults.status === "fulfilled") {
    results.push(...newsApiResults.value);
  }
  if (rssResults.status === "fulfilled") {
    results.push(...rssResults.value);
  }

  // Deduplicate
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
