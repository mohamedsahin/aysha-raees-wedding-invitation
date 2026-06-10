"use client";

import { useEffect } from "react";

// ---------------------------------------------------------------------------
// Lightweight first-party analytics. A single Tracker component (mounted once
// in the layout) bootstraps a session id, fires a pageview, watches every
// section via IntersectionObserver, and listens for 3D / click interactions.
// Any component can also call `track()` directly.
// ---------------------------------------------------------------------------

const SID_KEY = "wedding_sid";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SID_KEY);
  if (!sid) {
    sid =
      (crypto.randomUUID?.() ??
        Date.now().toString(36) + Math.random().toString(36).slice(2)) + "";
    localStorage.setItem(SID_KEY, sid);
  }
  return sid;
}

let bootstrapped = false;

export function track(
  type: string,
  label?: string,
  meta?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId();

  const payload: Record<string, unknown> = { sessionId, type, label, meta };
  // Send session bootstrap info alongside the very first event of the visit.
  if (!bootstrapped) {
    bootstrapped = true;
    payload.language = document.documentElement.getAttribute("data-lang") ?? "en";
    payload.referrer = document.referrer || "(direct)";
    payload.screen = `${window.screen.width}x${window.screen.height}`;
    try {
      payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* ignore */
    }
  }

  const body = JSON.stringify(payload);
  // sendBeacon survives page unload; fall back to fetch when unavailable.
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export function Tracker() {
  useEffect(() => {
    const start = Date.now();

    // 1. Pageview (also creates the session row server-side).
    track("pageview", window.location.pathname);

    // 2. Section reach — fire once per section when it first becomes visible.
    const seen = new Set<string>();
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-screen-label]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const label = e.target.getAttribute("data-screen-label");
          if (e.isIntersecting && label && !seen.has(label)) {
            seen.add(label);
            track("section_view", label);
          }
        }
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => io.observe(s));

    // 3. 3D model interaction — first drag/touch on the rose stage.
    let model3dDone = false;
    const onModelInteract = () => {
      if (model3dDone) return;
      model3dDone = true;
      track("model_interact", "rose-3d");
    };
    const stage = () => document.querySelector(".rose-stage");
    const attachStage = () => {
      const el = stage();
      if (el) {
        el.addEventListener("pointerdown", onModelInteract, { once: true });
        el.addEventListener("touchstart", onModelInteract, { once: true });
        return true;
      }
      return false;
    };
    // The rose stage lazy-mounts; retry a few times until it exists.
    let tries = 0;
    const stageTimer = window.setInterval(() => {
      if (attachStage() || ++tries > 20) window.clearInterval(stageTimer);
    }, 500);

    // 4. Delegated clicks for anything tagged with data-track.
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement)?.closest?.("[data-track]");
      if (el) track("click", el.getAttribute("data-track") || "unknown");
    };
    document.addEventListener("click", onClick, true);

    // 5. Engaged time on the page, reported on exit.
    const onLeave = () => {
      track("leave", window.location.pathname, {
        seconds: Math.round((Date.now() - start) / 1000),
        maxScroll: Math.round(
          ((window.scrollY + window.innerHeight) /
            document.documentElement.scrollHeight) *
            100
        ),
      });
    };
    window.addEventListener("pagehide", onLeave);

    return () => {
      io.disconnect();
      window.clearInterval(stageTimer);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  return null;
}
