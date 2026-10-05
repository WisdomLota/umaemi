"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ArrowRight from "@/components/ui/ArrowRight";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import { gsap, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

type SubHeaderProps = {
  label: string;
  back: string;
  /** Handle "back" in place (e.g. previous form step) instead of navigating. */
  onBack?: () => void;
};

/** Header for inner pages: the burnt strip, a way back, and where you are. */
export default function SubHeader({ label, back, onBack }: SubHeaderProps) {
  const progress = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(progress.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      gsap.from(arrow.current, { xPercent: 120, opacity: 0, duration: 1.1, ease: EASE.out, delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  const backClass = "group flex items-center justify-center w-12 h-12 -ml-3 overflow-hidden";
  const backArrow = (
    <ArrowRight className="w-7 h-5 rotate-180 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1.5" />
  );

  return (
    <header className="absolute inset-x-0 top-0 z-40 text-dark" style={{ color: "var(--world-fg)" }}>
      <div className="h-2.5 bg-burnt relative overflow-hidden">
        <div ref={progress} className="absolute inset-0 bg-dark origin-left scale-x-0" />
      </div>
      <nav className="flex items-center justify-between px-6 md:px-16 pt-8 md:pt-10" aria-label="Page">
        <Magnetic strength={0.4} reach={20}>
          {onBack ? (
            <button type="button" onClick={onBack} aria-label="Back" className={backClass}>
              <div ref={arrow}>{backArrow}</div>
            </button>
          ) : (
            <Link href={back} aria-label="Back" className={backClass}>
              <div ref={arrow}>{backArrow}</div>
            </Link>
          )}
        </Magnetic>
        <Scramble text={label} className="font-mono text-xs md:text-sm" />
      </nav>
    </header>
  );
}
