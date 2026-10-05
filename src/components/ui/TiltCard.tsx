"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/media";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  /** Show a soft light that follows the cursor across the surface. */
  glare?: boolean;
  /** Classes for the outer perspective wrapper (e.g. h-full in a grid). */
  outerClassName?: string;
};

/**
 * A surface with weight: it leans toward the cursor in 3D and settles back
 * with a spring. Children with data-depth="n" float n px above the surface.
 */
export default function TiltCard({ children, className = "", max = 10, glare = true, outerClassName = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia(FINE_POINTER).matches || matchMedia(REDUCED_MOTION).matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    layers.forEach((l) => gsap.set(l, { z: Number(l.dataset.depth) }));

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * max * 2);
      ry((px - 0.5) * max * 2);
      if (shine.current) {
        shine.current.style.opacity = "1";
        shine.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(255,245,236,0.14), transparent 55%)`;
      }
    };
    const leave = () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.2, ease: "elastic.out(1, 0.45)", overwrite: true });
      if (shine.current) shine.current.style.opacity = "0";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  return (
    <div className={`[perspective:1000px] ${outerClassName}`}>
      <div ref={ref} className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}>
        {children}
        {glare && (
          <div
            ref={shine}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [border-radius:inherit]"
          />
        )}
      </div>
    </div>
  );
}
