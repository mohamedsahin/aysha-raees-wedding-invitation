import { sql } from "@/lib/db";

export const SECTION_ORDER = [
  "Hero",
  "Verse",
  "Countdown",
  "Rose",
  "Families",
  "Events",
  "Bond",
  "Footer",
];

export type Filters = {
  days: number | null; // null = all time
  language: string | null; // null = all
  only3d: boolean; // only visitors who interacted with the 3D model
};

export const DEFAULT_FILTERS: Filters = { days: 30, language: null, only3d: false };

export function parseFilters(params: URLSearchParams): Filters {
  const range = params.get("range");
  const days = range === "all" ? null : Number(range) || 30;
  const language = params.get("lang");
  return {
    days,
    language: language && language !== "all" ? language : null,
    only3d: params.get("only3d") === "1",
  };
}

export type Stats = {
  totals: {
    visitors: number;
    pageviews: number;
    events: number;
    interacted3d: number;
    avgSections: number;
    avgSeconds: number;
  };
  byDay: { day: string; visitors: number }[];
  funnel: { section: string; visitors: number }[];
  clicks: { label: string; count: number }[];
  languages: { language: string; count: number }[];
  countries: { country: string; count: number }[];
  recent: {
    id: string;
    first_seen: string;
    last_seen: string;
    language: string | null;
    country: string | null;
    referrer: string | null;
    screen: string | null;
    pageviews: number;
    sections_seen: number;
    max_section: string | null;
    interacted_3d: boolean;
  }[];
  options: { languages: string[] };
};

// Build a WHERE fragment over analytics_sessions from the active filters, plus
// the positional params it references ($1, $2, …).
function sessionFilter(f: Filters) {
  const conds: string[] = [];
  const params: (string | number)[] = [];
  if (f.days != null) {
    params.push(f.days);
    conds.push(`first_seen >= now() - make_interval(days => $${params.length}::int)`);
  }
  if (f.language) {
    params.push(f.language);
    conds.push(`language = $${params.length}`);
  }
  if (f.only3d) {
    conds.push(`interacted_3d = true`);
  }
  const clause = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  return { clause, params };
}

export async function getStats(f: Filters): Promise<Stats> {
  const { clause, params } = sessionFilter(f);
  // Event-based queries are scoped to the same filtered set of visitors.
  const inSessions = `session_id IN (SELECT id FROM analytics_sessions ${clause})`;

  const [
    totalsRows,
    byDayRows,
    funnelRows,
    clickRows,
    langRows,
    countryRows,
    avgTimeRows,
    eventsRows,
    recentRows,
    optionRows,
  ] = await Promise.all([
    sql.query(
      `SELECT COUNT(*)::int AS visitors,
              COALESCE(SUM(pageviews), 0)::int AS pageviews,
              COUNT(*) FILTER (WHERE interacted_3d)::int AS interacted3d,
              COALESCE(ROUND(AVG(sections_seen), 1), 0)::float AS avgsections
       FROM analytics_sessions ${clause}`,
      params
    ),
    sql.query(
      `SELECT to_char(date_trunc('day', first_seen), 'YYYY-MM-DD') AS day,
              COUNT(*)::int AS visitors
       FROM analytics_sessions ${clause}
       GROUP BY 1 ORDER BY 1`,
      params
    ),
    sql.query(
      `SELECT label AS section, COUNT(DISTINCT session_id)::int AS visitors
       FROM analytics_events
       WHERE type = 'section_view' AND label IS NOT NULL AND ${inSessions}
       GROUP BY label`,
      params
    ),
    sql.query(
      `SELECT label, COUNT(*)::int AS count
       FROM analytics_events
       WHERE type = 'click' AND label IS NOT NULL AND ${inSessions}
       GROUP BY label ORDER BY count DESC`,
      params
    ),
    sql.query(
      `SELECT COALESCE(language, 'unknown') AS language, COUNT(*)::int AS count
       FROM analytics_sessions ${clause} GROUP BY 1 ORDER BY count DESC`,
      params
    ),
    sql.query(
      `SELECT COALESCE(country, 'unknown') AS country, COUNT(*)::int AS count
       FROM analytics_sessions ${clause} GROUP BY 1 ORDER BY count DESC LIMIT 10`,
      params
    ),
    sql.query(
      `SELECT COALESCE(ROUND(AVG((meta->>'seconds')::numeric)), 0)::int AS avgseconds
       FROM analytics_events
       WHERE type = 'leave' AND meta ? 'seconds' AND ${inSessions}`,
      params
    ),
    sql.query(
      `SELECT COUNT(*)::int AS c FROM analytics_events WHERE ${inSessions}`,
      params
    ),
    sql.query(
      `SELECT id, to_char(first_seen, 'YYYY-MM-DD HH24:MI') AS first_seen,
              to_char(last_seen, 'YYYY-MM-DD HH24:MI') AS last_seen,
              language, country, referrer, screen, pageviews,
              sections_seen, max_section, interacted_3d
       FROM analytics_sessions ${clause}
       ORDER BY last_seen DESC LIMIT 50`,
      params
    ),
    // Filter-dropdown options are computed across all data, unfiltered.
    sql.query(
      `SELECT DISTINCT language FROM analytics_sessions WHERE language IS NOT NULL ORDER BY language`,
      []
    ),
  ]);

  const t = totalsRows[0] ?? {};
  const funnelMap = new Map<string, number>(
    (funnelRows as { section: string; visitors: number }[]).map((r) => [
      r.section,
      r.visitors,
    ])
  );

  return {
    totals: {
      visitors: t.visitors ?? 0,
      pageviews: t.pageviews ?? 0,
      events: eventsRows[0]?.c ?? 0,
      interacted3d: t.interacted3d ?? 0,
      avgSections: t.avgsections ?? 0,
      avgSeconds: avgTimeRows[0]?.avgseconds ?? 0,
    },
    byDay: byDayRows as { day: string; visitors: number }[],
    funnel: SECTION_ORDER.map((section) => ({
      section,
      visitors: funnelMap.get(section) ?? 0,
    })),
    clicks: clickRows as { label: string; count: number }[],
    languages: langRows as { language: string; count: number }[],
    countries: countryRows as { country: string; count: number }[],
    recent: recentRows as Stats["recent"],
    options: {
      languages: (optionRows as { language: string }[]).map((r) => r.language),
    },
  };
}
