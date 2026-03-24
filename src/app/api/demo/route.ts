import { NextResponse } from "next/server";
import { DEMO_REPORT } from "@/lib/demo/mock-data";

/**
 * Demo endpoint — returns pre-built research results
 * so users can experience the full UI without API keys.
 */
export async function POST() {
  // Simulate a brief delay so users see the phase animation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({
    ...DEMO_REPORT,
    timestamp: new Date().toISOString(),
  });
}
