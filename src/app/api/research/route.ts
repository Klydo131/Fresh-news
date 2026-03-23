import { NextRequest, NextResponse } from "next/server";
import type { ResearchQuery } from "@/types";
import { runResearch } from "@/lib/research/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const query: ResearchQuery = {
      topic: body.topic,
      llmProvider: body.llmProvider || "claude",
      depth: body.depth || "standard",
    };

    if (!query.topic || query.topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const report = await runResearch(query);
    return NextResponse.json(report);
  } catch (err) {
    console.error("Research API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Research failed unexpectedly",
      },
      { status: 500 }
    );
  }
}
