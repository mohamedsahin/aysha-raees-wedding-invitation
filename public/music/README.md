# Background music

The site loads `wedding-bgm.mp3` from this folder automatically (see
`components/MusicPlayer.tsx`). It loops quietly and a floating control in the
bottom-right corner lets guests pause or resume.

## Current track

`wedding-bgm.mp3` — Pachelbel's *Canon in D*. The composition is public domain
and the recording is sourced from the Internet Archive, so there are no
copyright concerns.

## Replacing it

To swap in a different song, just overwrite `wedding-bgm.mp3` with your own
file (keep the same name), or change `SRC` in `components/MusicPlayer.tsx`.

- Use something soft and instrumental (piano / strings work well).
- Keep the file reasonably small (ideally under ~4–5 MB) so the page stays fast.
- Make sure you have the rights to use it. Good royalty-free sources:
  - https://pixabay.com/music/ (free, no attribution required)
  - https://uppbeat.io/
  - YouTube Audio Library

To use a different filename or location, update `SRC` in
`components/MusicPlayer.tsx`.
