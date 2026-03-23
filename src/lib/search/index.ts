import type { SourceArticle, ResearchQuery } from "@/types";
import { webSearch } from "./web-search";
import { newsSearch } from "./news-search";

/**
 * Combined search - merges web search + news APIs.
 * Generates multiple search queries for comprehensive coverage.
 */

function generateSearchVariants(topic: string): string[] {
  const base = topic.trim();
  return [
    base,
    `${base} latest news`,
    `${base} analysis`,
  ];
}

export async function gatherSources(
  query: ResearchQuery
): Promise<SourceArticle[]> {
  const variants = generateSearchVariants(query.topic);
  const maxVariants = query.depth === "quick" ? 1 : query.depth === "deep" ? 3 : 2;
  const searchQueries = variants.slice(0, maxVariants);

  const allResults = await Promise.allSettled(
    searchQueries.flatMap((q) => [webSearch(q), newsSearch(q)])
  );

  const articles: SourceArticle[] = [];
  const seenUrls = new Set<string>();
  let idCounter = 0;

  for (const result of allResults) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      articles.push({
        id: `src-${idCounter++}`,
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        source: item.source,
        publishedAt: item.publishedAt,
        searchProvider: "tavily", // simplified - would track actual provider
      });
    }
  }

  return articles;
}
