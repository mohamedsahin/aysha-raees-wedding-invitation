# Aysha & Raees — Wedding Invitation

A bilingual (English / മലയാളം) wedding invitation site built with **Next.js 14 (App Router) + TypeScript**.

- Animated hero with a self-drawing gold arch
- Language toggle (top-right) that swaps every string and the fonts, and remembers the choice
- Qur'anic verse (Ar-Rum 30:21) in Arabic + translation
- Live countdown to the Nikah (6 Aug 2026)
- Family lineages, event details, and venue directions
- Fonts self-hosted via `next/font` (Cormorant Garamond, Pinyon Script, Noto Serif Malayalam, Amiri)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a GitHub/GitLab/Bitbucket repository.
2. Go to https://vercel.com/new and import the repository.
3. Framework preset: **Next.js** (auto-detected). No env vars or extra config needed.
4. Click **Deploy**.

Or, with the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## Where to edit things

| What | File |
| --- | --- |
| All text, both languages | `lib/content.ts` |
| Venue map links | `lib/content.ts` → `MAP_LINKS` |
| Countdown target date/time | `lib/content.ts` → `TARGET_ISO` |
| Colors, type, spacing, animation | `app/globals.css` (`:root` variables at the top) |
| Page structure / section order | `app/page.tsx` |
| Individual sections | `components/*.tsx` |

### Notes

- The Nikah time is currently shown as **"Daytime"** — set the exact time in
  `lib/content.ts` (`nikah_time`) once confirmed.
- Map buttons do a Google Maps search for each venue. To pin exact locations,
  replace the URLs in `MAP_LINKS` with the venue's share link.

## Project structure

```
app/
  layout.tsx     # fonts, metadata, providers, fixed chrome
  page.tsx       # assembles the sections
  globals.css    # all styles + the design tokens
components/
  LanguageProvider.tsx  # language state + persistence (context)
  LanguageToggle.tsx
  Reveal.tsx            # scroll-reveal wrapper + multiline helper
  Hero.tsx Verse.tsx Countdown.tsx Families.tsx Events.tsx Footer.tsx
lib/
  content.ts     # bilingual dictionary + static Arabic + config
```
