"use client";

/**
 * Decorative flowing velvet backdrop for the wine-red sections. Render it as the
 * first child of a `position: relative; isolation: isolate` section, with the
 * section's real content given a higher z-index.
 */
export function GemVelvet() {
  return <div className="velvet" aria-hidden="true" />;
}
