import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ordered list of sections so we can compute the furthest one a visitor reached.
const SECTION_ORDER = [
  "Hero",
  "Verse",
  "Countdown",
  "Rose",
  "Families",
  "Events",
  "Bond",
  "Footer",
];

type Incoming = {
  sessionId?: string;
  type?: string;
  label?: string;
  meta?: Record<string, unknown>;
  // Session bootstrap fields (sent on first event of a session).
  language?: string;
  referrer?: string;
  screen?: string;
  timezone?: string;
};

export async function POST(req: NextRequest) {
  let body: Incoming;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const sessionId = (body.sessionId ?? "").slice(0, 64);
  const type = (body.type ?? "").slice(0, 48);
  if (!sessionId || !type) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const label = body.label ? String(body.label).slice(0, 120) : null;
  const ua = req.headers.get("user-agent")?.slice(0, 400) ?? null;
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    null;

  try {
    // Upsert the session. ON CONFLICT keeps the original first_seen and only
    // bumps last_seen / fills any columns that were still null.
    await sql`
      INSERT INTO analytics_sessions (id, user_agent, language, referrer, screen, timezone, country)
      VALUES (${sessionId}, ${ua}, ${body.language ?? null}, ${body.referrer ?? null},
              ${body.screen ?? null}, ${body.timezone ?? null}, ${country})
      ON CONFLICT (id) DO UPDATE SET
        last_seen = now(),
        language  = COALESCE(EXCLUDED.language, analytics_sessions.language),
        country   = COALESCE(EXCLUDED.country, analytics_sessions.country)
    `;

    // Record the raw event.
    await sql`
      INSERT INTO analytics_events (session_id, type, label, meta)
      VALUES (${sessionId}, ${type}, ${label}, ${body.meta ? JSON.stringify(body.meta) : null})
    `;

    // Maintain denormalized session rollups for fast dashboard reads.
    if (type === "pageview") {
      await sql`UPDATE analytics_sessions SET pageviews = pageviews + 1 WHERE id = ${sessionId}`;
    } else if (type === "section_view" && label) {
      const rank = SECTION_ORDER.indexOf(label);
      await sql`
        UPDATE analytics_sessions
        SET sections_seen = (
              SELECT COUNT(DISTINCT label) FROM analytics_events
              WHERE session_id = ${sessionId} AND type = 'section_view'
            ),
            max_section = CASE
              WHEN max_section IS NULL THEN ${label}
              WHEN ${rank} > COALESCE(array_position(${SECTION_ORDER}::text[], max_section), -1)
                THEN ${label}
              ELSE max_section
            END
        WHERE id = ${sessionId}
      `;
    } else if (type === "model_interact") {
      await sql`UPDATE analytics_sessions SET interacted_3d = true WHERE id = ${sessionId}`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("track error", err);
    return NextResponse.json({ ok: false, error: "db error" }, { status: 500 });
  }
}
