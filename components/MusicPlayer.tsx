"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";

/**
 * Soft background music for the invitation.
 *
 * Browsers block audio autoplay until the visitor interacts with the page, so
 * we attempt to play on mount and — if that's refused — start on the first
 * gesture (pointer / key / scroll / touch). A small floating control lets the
 * guest mute or resume at any time, and the choice is remembered.
 */

const SRC = "/music/music.mp3";
const VOLUME = 0.35;
const MUTED_KEY = "ar_music_muted";

export function MusicPlayer() {
  const { t } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  // Show the control by default (so there's always a manual way to start the
  // music — important on iOS, where audio won't preload until a gesture). Only
  // hide it if the file genuinely fails to load.
  const [available, setAvailable] = useState(true);
  // After a beat (once the intro has lifted), invite the guest to play music.
  const [invite, setInvite] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setInvite(true), 4200);
    return () => clearTimeout(id);
  }, []);

  // Start (or restart) the music audibly from the beginning.
  const playFromStart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = VOLUME;
    try {
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
    try {
      localStorage.setItem(MUTED_KEY, "0");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = "auto";
    audioRef.current = audio;

    const onError = () => setAvailable(false);
    audio.addEventListener("error", onError);

    const startedMuted = (() => {
      try {
        return localStorage.getItem(MUTED_KEY) === "1";
      } catch {
        return false;
      }
    })();

    // Broad set of first-interaction signals — whichever fires first makes the
    // (already-running, muted) track audible, so sound kicks in the instant the
    // visitor does anything (move the mouse, scroll, tap, key press...).
    const gestureEvents = [
      "pointerdown",
      "pointermove",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "touchend",
      "click",
    ];
    const removeGestureListeners = () => {
      gestureEvents.forEach((e) => window.removeEventListener(e, onGesture));
    };
    const addGestureListeners = () => {
      gestureEvents.forEach((e) =>
        window.addEventListener(e, onGesture, { once: true, passive: true }),
      );
    };

    // Force playback at load: browsers ALLOW autoplay when muted, so we start
    // the track muted and unmute on the first interaction.
    const forceAutoplay = () => {
      audio.muted = true;
      audio.volume = VOLUME;
      audio.play().catch(() => {
        // Even muted autoplay was refused — fall back to starting on gesture.
        addGestureListeners();
      });
    };

    const unmuteAndPlay = () => {
      audio.muted = false;
      audio.volume = VOLUME;
      // Muted autoplay has been advancing the track silently — rewind so the
      // first thing the guest actually hears is the gentle opening.
      try {
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browser still refused — keep listeners armed for the next gesture.
          setPlaying(false);
          addGestureListeners();
        });
    };

    const onGesture = () => {
      removeGestureListeners();
      unmuteAndPlay();
    };

    if (!startedMuted) {
      forceAutoplay();
      addGestureListeners();
    }

    return () => {
      removeGestureListeners();
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      try {
        localStorage.setItem(MUTED_KEY, "1");
      } catch {
        /* ignore */
      }
    } else {
      audio.muted = false;
      audio.volume = VOLUME;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      try {
        localStorage.setItem(MUTED_KEY, "0");
      } catch {
        /* ignore */
      }
    }
  };

  if (!available) return null;

  const showInvite = invite && !playing;

  return (
    <>
      {showInvite && (
        <button
          className="music-prompt"
          onClick={playFromStart}
          aria-label={t("music_prompt")}
        >
          <svg className="note" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 17V5l10-2v12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6.5" cy="17" r="2.6" fill="currentColor" />
            <circle cx="16.5" cy="15" r="2.6" fill="currentColor" />
          </svg>
          <span>{t("music_prompt")}</span>
        </button>
      )}

      <button
        className={`music-toggle${playing ? " is-playing" : ""}${
          showInvite ? " attn" : ""
        }`}
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
      >
      {playing ? (
        // Equalizer bars (animated while playing)
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <rect className="bar b1" x="4" y="9" width="3" height="6" rx="1.5" />
          <rect className="bar b2" x="10.5" y="6" width="3" height="12" rx="1.5" />
          <rect className="bar b3" x="17" y="10" width="3" height="4" rx="1.5" />
        </svg>
      ) : (
        // Muted speaker
        <svg
          className="ico"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          <path d="M17 9l4 4M21 9l-4 4" />
        </svg>
      )}
      </button>
    </>
  );
}
