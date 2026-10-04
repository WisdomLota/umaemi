"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, SplitText, EASE } from "@/lib/gsap";
import { introStore } from "@/lib/store";
import { FINE_POINTER, prefersReducedMotion } from "@/lib/media";

type KineticHeadlineProps = {
  children: ReactNode;
  className?: string;
  /** Resting and peak font weight (Bricolage's wght axis runs 200–800). */
  weight?: [number, number];
  /** Resting and squeezed width (wdth axis runs 75–100). */
  width?: [number, number];
  /** Radius of influence around the cursor in px. */
  radius?: number;
};

/**
 * Display type that physically reacts to the cursor: letters near the pointer
 * gain weight and condense, then relax back. On touch screens a slow wave runs
 * through the line instead.
 */
const WEIGHT: [number, number] = [460, 800];
const WIDTH: [number, number] = [100, 78];

export default function KineticHeadline({
  children,
  className = "",
  weight = WEIGHT,
  width = WIDTH,
  radius = 260,
}: KineticHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let chars: HTMLElement[] = [];
    let centers: { x: number; y: number }[] = [];
    const state: { w: number; d: number }[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    const fine = matchMedia(FINE_POINTER).matches;
    let revealed = false;
    let tween: gsap.core.Tween | null = null;

    const measure = () => {
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const split = SplitText.create(el, {
      type: "lines,words,chars",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        chars = self.chars as HTMLElement[];
        chars.forEach((c, i) => (state[i] = { w: 0, d: 0 }));
        if (!revealed) gsap.set(chars, { yPercent: 120 });
        requestAnimationFrame(measure);
      },
    });

    const reveal = () => {
      revealed = true;
      tween = gsap.to(chars, {
        yPercent: 0,
        duration: 1.4,
        ease: EASE.out,
        stagger: { each: 0.025, from: "start" },
        onComplete: measure,
      });
    };
    if (introStore.get() === "done") reveal();
    const unsub = introStore.subscribe(() => introStore.get() === "done" && !revealed && reveal());

    const move = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const leave = () => {
      pointer.x = pointer.y = -1e4;
    };
    if (fine) {
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
    }
    window.addEventListener("resize", measure);
    // The hero is sticky, but positions still shift during the scroll-away.
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    const [w0, w1] = weight;
    const [d0, d1] = width;
    const tick = (time: number) => {
      if (!revealed || !chars.length) return;
      for (let i = 0; i < chars.length; i++) {
        const c = centers[i];
        if (!c) continue;
        let influence: number;
        if (fine) {
          const dist = Math.hypot(pointer.x - c.x, (pointer.y - c.y) * 1.4);
          influence = Math.max(0, 1 - dist / radius);
          influence = influence * influence * (3 - 2 * influence);
        } else {
          // A slow tide moving through the letters.
          influence = Math.pow(Math.max(0, Math.sin(time * 1.2 - i * 0.18)), 6);
        }
        const s = state[i];
        const nw = s.w + (influence - s.w) * 0.14;
        if (Math.abs(nw - s.w) > 0.001) {
          s.w = nw;
          chars[i].style.fontVariationSettings = `"wght" ${(w0 + (w1 - w0) * nw).toFixed(0)}, "wdth" ${(d0 + (d1 - d0) * nw).toFixed(1)}`;
        }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      unsub();
      gsap.ticker.remove(tick);
      tween?.kill();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      split.revert();
    };
  }, [weight, width, radius]);

  return (
    <h1 ref={ref} className={className} style={{ fontVariationSettings: `"wght" ${weight[0]}, "wdth" ${width[0]}` }}>
      {children}
    </h1>
  );
}
