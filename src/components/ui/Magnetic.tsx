"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/media";

type MagneticProps = {
  children: ReactNode;
  /** 0–1: how far the element travels toward the cursor. */
  strength?: number;
  /** Extra px around the element where the pull is felt. */
  reach?: number;
  className?: string;
};

/** Pulls its child toward the cursor, then springs back when released. */
export default function Magnetic({ children, strength = 0.35, reach = 40, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia(FINE_POINTER).matches || matchMedia(REDUCED_MOTION).matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    let engaged = false;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const inside =
        e.clientX > r.left - reach && e.clientX < r.right + reach && e.clientY > r.top - reach && e.clientY < r.bottom + reach;
      if (inside) {
        engaged = true;
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      } else if (engaged) {
        engaged = false;
        gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)", overwrite: true });
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [strength, reach]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
