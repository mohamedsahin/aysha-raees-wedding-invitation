// One-off script to create the analytics tables on Neon.
// Run with:  node scripts/init-db.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

// Load DATABASE_URL from .env.local (tiny parser — no extra deps).
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env
  .split("\n")
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.replace(/^DATABASE_URL=/, "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

if (!url) throw new Error("DATABASE_URL not found in .env.local");

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS analytics_sessions (
    id            TEXT PRIMARY KEY,
    first_seen    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen     TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent    TEXT,
    language      TEXT,
    referrer      TEXT,
    screen        TEXT,
    timezone      TEXT,
    country       TEXT,
    pageviews     INTEGER NOT NULL DEFAULT 0,
    max_section   TEXT,
    sections_seen INTEGER NOT NULL DEFAULT 0,
    interacted_3d BOOLEAN NOT NULL DEFAULT false
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS analytics_events (
    id         BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
    type       TEXT NOT NULL,
    label      TEXT,
    meta       JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id)`;
await sql`CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(type)`;
await sql`CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at)`;
await sql`CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON analytics_sessions(first_seen)`;

const [{ now }] = await sql`SELECT now()`;
console.log("✓ Tables ready. DB time:", now);
