"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

type PixelRevealProps = {
  children: ReactNode;
  cols?: number;
  rows?: number;
  /** Colour of the covering pixels — match the surface behind. */
  color?: string;
  className?: string;
  start?: string;
};

/** Content is uncovered block by block, like a screen resolving an image. */
export default function PixelReveal({
  children,
  cols = 8,
  rows = 10,
  color = "var(--color-night)",
  className = "",
  start = "top 80%",
}: PixelRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cells = el.querySelectorAll("[data-pixel]");
    if (prefersReducedMotion()) {
      gsap.set(cells, { autoAlpha: 0 });
      return;
    }
    const tween = gsap.to(cells, {
      autoAlpha: 0,
      duration: 0.01,
      stagger: { each: 0.012, from: "random", grid: [rows, cols] },
      scrollTrigger: { trigger: el, start, once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [cols, rows, start]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {Array.from({ length: cols * rows }, (_, i) => (
          <span key={i} data-pixel style={{ background: color }} className="-m-px" />
        ))}
      </div>
    </div>
  );
}
