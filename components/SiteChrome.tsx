"use client";

import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Petals } from "@/components/Petals";
import { Ripples } from "@/components/Ripples";
import { Intro } from "@/components/Intro";
import { Tracker } from "@/components/Analytics";

// The floating wedding-site chrome (intro, petals, language toggle, music
// player, ripples) plus visitor tracking. None of it should appear on the
// admin dashboard, so we gate the whole bundle on the current path.
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Intro />
      <Petals />
      <div className="page-frame" aria-hidden="true" />
      <LanguageToggle />
      <Ripples />
      <MusicPlayer />
      <Tracker />
    </>
  );
}
