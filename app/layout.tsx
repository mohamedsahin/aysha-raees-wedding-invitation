import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Pinyon_Script,
  Noto_Serif_Malayalam,
  Amiri,
} from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
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

const malayalam = Noto_Serif_Malayalam({
  subsets: ["latin", "malayalam"],
  weight: ["400", "500", "600"],
  variable: "--font-mal",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aysha & Raees · Wedding",
  description:
    "Aysha Samiya & Raees Mohamed Ali — wedding invitation, August 2026.",
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
      className={`${cormorant.variable} ${pinyon.variable} ${malayalam.variable} ${amiri.variable}`}
    >
      <body>
        <LanguageProvider>
          <div className="page-frame" aria-hidden="true" />
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
