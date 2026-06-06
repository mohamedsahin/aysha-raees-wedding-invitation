import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Pinyon_Script,
  Chilanka,
  Manjari,
  Amiri,
} from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Petals } from "@/components/Petals";
import { Ripples } from "@/components/Ripples";
import { Intro } from "@/components/Intro";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Body Malayalam — elegant, highly readable (used for long family lists etc.).
const manjari = Manjari({
  subsets: ["latin", "malayalam"],
  weight: ["400", "700"],
  variable: "--font-mal",
  display: "swap",
});

// Display Malayalam — flowing & calligraphic, to echo the cursive English
// script on the big names and titles.
const chilanka = Chilanka({
  subsets: ["latin", "malayalam"],
  weight: "400",
  variable: "--font-mal-script",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raees & Aysha · Wedding",
  description:
    "Raees Mohamed Ali & Aysha Samiya — wedding invitation, August 2026.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${pinyon.variable} ${manjari.variable} ${chilanka.variable} ${amiri.variable}`}
    >
      <body>
        <LanguageProvider>
          <Intro />
          <Petals />
          <div className="page-frame" aria-hidden="true" />
          <LanguageToggle />
          <Ripples />
          <MusicPlayer />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
