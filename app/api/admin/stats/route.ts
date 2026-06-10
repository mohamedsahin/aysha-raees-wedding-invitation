import { NextRequest, NextResponse } from "next/server";
import { getStats, parseFilters } from "@/lib/stats";

// Protected by middleware (/api/admin/* requires the admin cookie).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const filters = parseFilters(req.nextUrl.searchParams);
    const stats = await getStats(filters);
    return NextResponse.json(stats);
  } catch (err) {
    console.error("stats error", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
