import type { SearchResult } from "@/types";

/**
 * Structured news sources - NewsAPI and RSS feeds.
 * These power the "fresh headlines" side.
 */

export async function searchNewsAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: query,
    sortBy: "publishedAt",
    pageSize: "15",
    language: "en",
    apiKey,
  });

  const res = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.articles || []).map(
    (a: {
      title: string;
      url: string;
      description: string;
      source: { name: string };
      publishedAt: string;
    }) => ({
      title: a.title,
      url: a.url,
      snippet: a.description || "",
      source: a.source?.name || "Unknown",
      publishedAt: a.publishedAt,
    })
  );
}

// Built-in RSS feeds for major news sources (no API key needed)
const RSS_FEEDS: Record<string, string> = {
  "Reuters": "https://feeds.reuters.com/reuters/topNews",
  "AP News": "https://rsshub.app/apnews/topics/apf-topnews",
  "BBC": "https://feeds.bbci.co.uk/news/rss.xml",
  "NPR": "https://feeds.npr.org/1001/rss.xml",
  "Al Jazeera": "https://www.aljazeera.com/xml/rss/all.xml",
};

export async function searchRSS(query: string): Promise<SearchResult[]> {
  // Dynamic import for rss-parser (server-side only)
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // We'll use a simple fetch + XML parse approach to avoid heavy deps at build
  for (const [sourceName, feedUrl] of Object.entries(RSS_FEEDS)) {
    try {
      const res = await fetch(feedUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;

      const xml = await res.text();

      // Simple XML item extraction
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (const item of items.slice(0, 5)) {
        const title =
          item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          item.match(/<title>(.*?)<\/title>/)?.[1] ||
          "";
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
        const desc =
          item.match(
            /<description><!\[CDATA\[(.*?)\]\]><\/description>/
          )?.[1] ||
          item.match(/<description>(.*?)<\/description>/)?.[1] ||
          "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

        // Filter by relevance to query
        const text = `${title} ${desc}`.toLowerCase();
        if (text.includes(queryLower) || queryLower.split(" ").some((w) => text.includes(w))) {
          results.push({
            title: title.replace(/<[^>]*>/g, ""),
            url: link,
            snippet: desc.replace(/<[^>]*>/g, "").slice(0, 300),
            source: sourceName,
            publishedAt: pubDate,
          });
        }
      }
    } catch {
      // Skip failed feeds silently
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
