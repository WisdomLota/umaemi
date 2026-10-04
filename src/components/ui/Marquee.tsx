"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

type MarqueeProps = {
  children: ReactNode;
  /** Base speed in % of one copy per second. Negative runs right. */
  speed?: number;
  className?: string;
};

/**
 * An endless band that drifts on its own and surges with scroll velocity —
 * scrolling up throws it into reverse.
 */
export default function Marquee({ children, speed = 4, className = "" }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let boost = 0;
    let dir = 1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        boost = Math.min(Math.abs(self.getVelocity()) / 220, 12);
        dir = self.direction;
      },
    });
    const tick = (_: number, dt: number) => {
      if (!st.isActive) return;
      x -= ((speed * (1 + boost) * dir * dt) / 1000) * 1;
      boost *= 0.94;
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;
      el.style.transform = `translate3d(${x}%,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [speed]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div ref={track} className="inline-flex will-change-transform">
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
