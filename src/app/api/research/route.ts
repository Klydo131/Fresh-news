import { NextRequest, NextResponse } from "next/server";
import type { ResearchQuery } from "@/types";
import { runResearch } from "@/lib/research/engine";
import { sanitizeTopic, validateEnum } from "@/lib/security/sanitize";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(req);
    const rateCheck = checkRateLimit(`research:${ip}`, RATE_LIMITS.research);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
            ),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Parse and validate input
    const body = await req.json();

    const topic = sanitizeTopic(String(body.topic || ""));
    if (topic.length === 0) {
      return NextResponse.json(
        { error: "Topic is required." },
        { status: 400 }
      );
    }

    const llmProvider = validateEnum(
      body.llmProvider,
      ["claude", "openai", "gemini", "groq"] as const,
      "claude"
    );

    const depth = validateEnum(
      body.depth,
      ["quick", "standard", "deep"] as const,
      "standard"
    );

    const query: ResearchQuery = { topic, llmProvider, depth };

    const report = await runResearch(query);

    return NextResponse.json(report, {
      headers: {
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (err) {
    // Log full error server-side for debugging
    console.error("Research API error:", err);

    // Return generic error to client — never leak internals
    return NextResponse.json(
      { error: "Research could not be completed. Please try again." },
      { status: 500 }
    );
  }
}
