"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type CSSProperties,
} from "react";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a <div>. */
  as?: ElementType;
  /** Stagger step (maps to the CSS [data-d] transition-delay). */
  d?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wraps content so it fades + rises into view once scrolled near the viewport.
 * Honours prefers-reduced-motion by showing immediately.
 */
export function Reveal({ children, as, d, className = "", style }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`.trim()}
      data-d={d}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** Renders a "\n"-separated translation string as lines split by <br>. */
export function Multi({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}
