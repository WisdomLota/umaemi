"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

type ScrambleProps = {
  text: string;
  as?: "div" | "p" | "span" | "h2" | "h3";
  className?: string;
  /** Re-scramble on hover as well as on first view. */
  hover?: boolean;
  delay?: number;
};

const CHARS = "▖▗▘▙▚▛▜▝▞▟01<>/_";

/** Mono labels decode themselves into place, like a terminal settling. */
export default function Scramble({ text, as: Tag = "span", className = "", hover = false, delay = 0 }: ScrambleProps) {
  // One element type stands in for every allowed tag; they share the same API here.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const run = () =>
      gsap.to(el, {
        duration: 0.9,
        scrambleText: { text, chars: CHARS, speed: 0.6, revealDelay: 0.15 },
        ease: "none",
      });
    const intro = gsap.to(el, {
      delay,
      duration: 1.1,
      scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: 0.3 },
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
    const enter = () => run();
    if (hover) el.addEventListener("pointerenter", enter);
    return () => {
      intro.scrollTrigger?.kill();
      intro.kill();
      if (hover) el.removeEventListener("pointerenter", enter);
    };
  }, [text, hover, delay]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
