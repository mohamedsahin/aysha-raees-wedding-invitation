"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  LabelList,
} from "recharts";
import type { Stats, Filters } from "@/lib/stats";
import { LogoutButton } from "./LogoutButton";

// Wedding palette ----------------------------------------------------------
const EMERALD = "#0e3a2c";
const EMERALD_2 = "#0a2c21";
const GOLD = "#b88a3a";
const GOLD_LIGHT = "#e7cd86";
const WINE = "#541923";
const INK_SOFT = "#6a5f49";
const LINE = "rgba(184,138,58,0.22)";
const PIE_COLORS = [EMERALD, GOLD, WINE, "#7a9b76", GOLD_LIGHT, "#8c6b4f"];

const TOOLTIP_STYLE = {
  background: "#fffaf0",
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  fontSize: 13,
  color: EMERALD,
  fontFamily: "var(--serif), Georgia, serif",
  boxShadow: "0 14px 40px -22px rgba(42,36,24,0.45)",
};

const RANGES: { key: string; label: string }[] = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "all", label: "All time" },
];

function fmtDay(d: string) {
  // 2026-06-10 -> Jun 10
  const [, m, day] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${Number(day)}`;
}

function StatCard({ k, value, sub }: { k: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="adm-card">
      <div className="k">{k}</div>
      <div className="v">
        {value}
        {sub ? <small> {sub}</small> : null}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="adm-panel">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function Dashboard({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [filters, setFilters] = useState<Filters>({ days: 30, language: null, only3d: false });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (f: Filters) => {
    setLoading(true);
    const qs = new URLSearchParams({
      range: f.days == null ? "all" : String(f.days),
      lang: f.language ?? "all",
      only3d: f.only3d ? "1" : "0",
    });
    try {
      const res = await fetch(`/api/admin/stats?${qs}`, { cache: "no-store" });
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch whenever filters change (skip the very first render — SSR data).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    load(filters);
  }, [filters, load, mounted]);

  const { totals } = stats;
  const pct3d = totals.visitors ? Math.round((totals.interacted3d / totals.visitors) * 100) : 0;

  return (
    <div className={`adm${loading ? " is-loading" : ""}`}>
      <div className="adm-top">
        <div>
          <div className="eyebrow">Raees &amp; Aysha</div>
          <h1>Wedding Analytics</h1>
          <div className="sub">Visitor insights &amp; engagement</div>
        </div>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => load(filters)} disabled={loading}>
            ↻ {loading ? "Loading…" : "Refresh"}
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* ---- Filters ---- */}
      <div className="adm-filters">
        <div className="seg">
          {RANGES.map((r) => {
            const active = (filters.days == null ? "all" : String(filters.days)) === r.key;
            return (
              <button
                key={r.key}
                className={`seg-btn${active ? " active" : ""}`}
                onClick={() => setFilters((f) => ({ ...f, days: r.key === "all" ? null : Number(r.key) }))}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {stats.options.languages.length > 0 && (
          <select
            className="adm-select"
            value={filters.language ?? "all"}
            onChange={(e) => setFilters((f) => ({ ...f, language: e.target.value === "all" ? null : e.target.value }))}
          >
            <option value="all">All languages</option>
            {stats.options.languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}

        <button
          className={`adm-toggle${filters.only3d ? " active" : ""}`}
          onClick={() => setFilters((f) => ({ ...f, only3d: !f.only3d }))}
        >
          <span className="dot" /> Interacted with 3D only
        </button>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="adm-cards">
        <StatCard k="Unique visitors" value={totals.visitors} />
        <StatCard k="Pageviews" value={totals.pageviews} />
        <StatCard k="Interacted with 3D" value={totals.interacted3d} sub={`/${totals.visitors} (${pct3d}%)`} />
        <StatCard k="Avg sections seen" value={totals.avgSections} sub="/8" />
        <StatCard k="Avg time on page" value={totals.avgSeconds} sub="s" />
        <StatCard k="Total events" value={totals.events} />
      </div>

      {/* ---- Visitors over time ---- */}
      <Panel title="Visitors over time">
        {stats.byDay.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.byDay} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={EMERALD} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={EMERALD} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false} />
              <XAxis dataKey="day" tickFormatter={fmtDay} tick={{ fill: INK_SOFT, fontSize: 12 }} stroke={LINE} minTickGap={24} />
              <YAxis allowDecimals={false} tick={{ fill: INK_SOFT, fontSize: 12 }} stroke={LINE} width={36} />
              <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={(v) => fmtDay(String(v))} cursor={{ stroke: GOLD, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="visitors" stroke={EMERALD} strokeWidth={2.5} fill="url(#vGrad)" dot={{ r: 3, fill: GOLD, stroke: EMERALD }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty">No visits recorded in this range.</div>
        )}
      </Panel>

      <div className="adm-grid">
        {/* ---- Section funnel ---- */}
        <Panel title="Section reach — how far visitors scrolled">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.funnel} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={LINE} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: INK_SOFT, fontSize: 12 }} stroke={LINE} />
              <YAxis type="category" dataKey="section" tick={{ fill: EMERALD, fontSize: 12 }} stroke={LINE} width={70} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(184,138,58,0.08)" }} />
              <Bar dataKey="visitors" radius={[0, 6, 6, 0]} barSize={18}>
                {stats.funnel.map((_, i) => (
                  <Cell key={i} fill={`rgba(14,58,44,${0.95 - i * 0.07})`} />
                ))}
                <LabelList dataKey="visitors" position="right" fill={INK_SOFT} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* ---- Interactions & clicks ---- */}
        <Panel title="Interactions &amp; clicks">
          {stats.clicks.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.clicks} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={LINE} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: INK_SOFT, fontSize: 12 }} stroke={LINE} />
                <YAxis type="category" dataKey="label" tick={{ fill: EMERALD, fontSize: 12 }} stroke={LINE} width={110} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(184,138,58,0.08)" }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18} fill={GOLD}>
                  <LabelList dataKey="count" position="right" fill={INK_SOFT} fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty">No interactions recorded yet.</div>
          )}
        </Panel>

        {/* ---- Language donut ---- */}
        <Panel title="Language">
          {stats.languages.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.languages}
                  dataKey="count"
                  nameKey="language"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                  stroke="#fffaf0"
                  strokeWidth={2}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={(e: any) => `${e.language ?? ""} (${e.count ?? 0})`}
                  labelLine={false}
                >
                  {stats.languages.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty">No data yet.</div>
          )}
        </Panel>

        {/* ---- 3D engagement radial + country ---- */}
        <Panel title="3D engagement &amp; top countries">
          <div className="adm-split">
            <ResponsiveContainer width="50%" height={200}>
              <RadialBarChart
                innerRadius="62%"
                outerRadius="100%"
                data={[{ name: "3D", value: pct3d, fill: GOLD }]}
                startAngle={90}
                endAngle={90 - (pct3d / 100) * 360}
              >
                <RadialBar background={{ fill: "#ece0c7" }} dataKey="value" cornerRadius={20} />
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="600" fill={EMERALD}>
                  {pct3d}%
                </text>
                <text x="50%" y="64%" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={INK_SOFT}>
                  rotated the rose
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="adm-countrylist">
              {stats.countries.length ? (
                stats.countries.map((c) => {
                  const max = Math.max(1, ...stats.countries.map((x) => x.count));
                  return (
                    <div className="bar-row" key={c.country}>
                      <div className="bl">
                        <span>{c.country}</span>
                        <span className="n">{c.count}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(c.count / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty">No country data.</div>
              )}
            </div>
          </div>
        </Panel>
      </div>

      {/* ---- Recent visitors ---- */}
      <Panel title="Recent visitors (latest 50)">
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Last seen</th>
                <th>First seen</th>
                <th>Lang</th>
                <th>Country</th>
                <th>Reached</th>
                <th>Sections</th>
                <th>Views</th>
                <th>3D</th>
                <th>Referrer</th>
                <th>Screen</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 && (
                <tr>
                  <td colSpan={10} className="empty">
                    No visitors in this range.
                  </td>
                </tr>
              )}
              {stats.recent.map((s) => (
                <tr key={s.id}>
                  <td>{s.last_seen}</td>
                  <td>{s.first_seen}</td>
                  <td>{s.language ?? "—"}</td>
                  <td>{s.country ?? "—"}</td>
                  <td>{s.max_section ?? "—"}</td>
                  <td>{s.sections_seen}</td>
                  <td>{s.pageviews}</td>
                  <td>
                    <span className={`pill ${s.interacted_3d ? "yes" : "no"}`}>{s.interacted_3d ? "yes" : "no"}</span>
                  </td>
                  <td>{s.referrer ?? "—"}</td>
                  <td>{s.screen ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
