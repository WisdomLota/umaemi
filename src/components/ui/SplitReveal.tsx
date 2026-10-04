"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, SplitText, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { introStore } from "@/lib/store";

type SplitRevealProps = {
  as?: "div" | "p" | "span" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  /** "words" rise out of masked lines; "chars" for display type. */
  by?: "words" | "chars" | "lines";
  delay?: number;
  stagger?: number;
  /** Start immediately once the intro finishes instead of on scroll. */
  onIntro?: boolean;
  start?: string;
};

/** Text that rises out of its own line masks as it scrolls into view. */
export default function SplitReveal({
  as: Tag = "div",
  children,
  className = "",
  by = "words",
  delay = 0,
  stagger,
  onIntro = false,
  start = "top 85%",
}: SplitRevealProps) {
  // One element type stands in for every allowed tag; they share the same API here.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let tween: gsap.core.Tween | null = null;
    let unsub: (() => void) | undefined;

    const split = SplitText.create(el, {
      type: by === "chars" ? "lines,words,chars" : "lines,words",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        const targets = by === "chars" ? self.chars : by === "lines" ? self.lines : self.words;
        const vars: gsap.TweenVars = {
          yPercent: 115,
          rotate: by === "lines" ? 0 : 6,
          duration: 1.2,
          ease: EASE.out,
          stagger: stagger ?? (by === "chars" ? 0.02 : by === "words" ? 0.04 : 0.1),
          delay,
        };
        if (onIntro) {
          gsap.set(targets, { yPercent: 115, rotate: vars.rotate });
          const play = () => {
            tween = gsap.to(targets, { ...vars, yPercent: 0, rotate: 0 });
          };
          if (introStore.get() === "done") play();
          else
            unsub = introStore.subscribe(() => {
              if (introStore.get() === "done") play();
            });
          return tween ?? undefined;
        }
        tween = gsap.from(targets, { ...vars, scrollTrigger: { trigger: el, start, once: true } });
        return tween;
      },
    });

    return () => {
      unsub?.();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split.revert();
    };
  }, [by, delay, stagger, onIntro, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
