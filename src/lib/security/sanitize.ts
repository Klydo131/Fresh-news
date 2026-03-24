/**
 * Input sanitization and validation utilities.
 * Protects against prompt injection, XSS, and malformed input.
 */

const MAX_TOPIC_LENGTH = 200;
const MAX_SNIPPET_LENGTH = 2000;

/**
 * Sanitize user-provided search topic.
 * Strips control characters and enforces length limits.
 */
export function sanitizeTopic(input: string): string {
  return input
    .replace(/[\x00-\x1f\x7f]/g, "") // strip control characters
    .trim()
    .slice(0, MAX_TOPIC_LENGTH);
}

/**
 * Escape untrusted content before injecting into LLM prompts.
 * Wraps in XML-style delimiters so the LLM can distinguish data from instructions.
 * This is the primary defense against prompt injection from search results.
 */
export function escapeForPrompt(text: string): string {
  return text
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "") // strip dangerous control chars
    .slice(0, MAX_SNIPPET_LENGTH);
}

/**
 * Strip HTML tags from RSS/news content.
 * Uses a proper iterative approach rather than naive regex.
 */
export function stripHtml(html: string): string {
  // Remove CDATA wrappers
  let text = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  // Remove HTML tags iteratively to handle nested cases
  let prev = "";
  while (prev !== text) {
    prev = text;
    text = text.replace(/<[^>]*>/g, "");
  }
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return text.trim();
}

/**
 * Validate and sanitize a URL. Returns null if invalid or dangerous.
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Extract hostname safely from a URL. Returns "unknown" on failure.
 */
export function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}

/**
 * Validate that a value is one of the allowed enum values.
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
}
