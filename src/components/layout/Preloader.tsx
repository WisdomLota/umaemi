"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { introStore } from "@/lib/store";
import { bus } from "@/components/three/diamond-bus";
import { prefersReducedMotion } from "@/lib/media";
import CornerDot from "@/components/ui/CornerDot";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function untilReady(timeout: number) {
  const start = performance.now();
  await Promise.race([document.fonts.ready, wait(timeout)]);
  // Give the 3D stage a moment to compile its first frame (if it runs at all).
  while (!bus.ready && performance.now() - start < timeout) await wait(50);
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const el = root.current;
    if (!el) return;
    el.classList.remove("preloader-failsafe");

    const finish = () => {
      bus.assembly = 1;
      bus.handoff = 1;
      introStore.set("done");
      setGone(true);
    };

    if (prefersReducedMotion()) {
      const t = gsap.to(el, { autoAlpha: 0, duration: 0.5, delay: 0.3, onComplete: finish });
      return () => {
        t.kill();
      };
    }

    let cancelled = false;
    const progress = { p: 0 };
    const render = () => {
      bus.assembly = progress.p;
      if (counter.current) counter.current.textContent = String(Math.round(progress.p * 100)).padStart(3, "0");
    };

    const ctx = gsap.context(() => {
      gsap.from("[data-pre-in]", { yPercent: 110, duration: 1.1, ease: EASE.out, stagger: 0.08, delay: 0.1 });
      gsap.from("[data-pre-corner]", { scale: 0, rotate: -90, duration: 0.9, ease: EASE.out, stagger: 0.06 });
    }, el);

    (async () => {
      await gsap.to(progress, { p: 0.82, duration: 1.7, ease: "power2.inOut", onUpdate: render });
      await untilReady(3500);
      if (cancelled) return;
      await gsap.to(progress, { p: 1, duration: 0.55, ease: "power3.out", onUpdate: render });
      if (cancelled) return;

      const exit = gsap.timeline({ onComplete: finish });
      exit
        .to("[data-pre-in]", { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.05 }, 0.15)
        .to("[data-pre-corner]", { scale: 0, rotate: 90, duration: 0.5, ease: "power3.in", stagger: 0.04 }, 0.1)
        .to(bus, { handoff: 1, duration: 1.5, ease: EASE.inOut }, 0.45)
        .fromTo(
          el,
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" },
          { clipPath: "inset(0% 0% 100% 0% round 0px 0px 160px 0px)", duration: 1.3, ease: EASE.inOut },
          0.55
        )
        .call(() => introStore.set("done"), [], 1.05);
    })();

    return () => {
      cancelled = true;
      ctx.revert();
      gsap.killTweensOf(progress);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader-failsafe fixed inset-0 z-50 bg-night text-cream overflow-hidden"
      aria-hidden
    >
      {/* the four brand corners frame the stage */}
      <div className="absolute inset-5 md:inset-8 pointer-events-none">
        {[
          "top-0 left-0 rotate-0",
          "top-0 right-0 rotate-90",
          "bottom-0 right-0 rotate-180",
          "bottom-0 left-0 -rotate-90",
        ].map((pos) => (
          <span key={pos} className={`absolute ${pos}`}>
            <CornerDot data-pre-corner className="w-5 h-5 md:w-7 md:h-7 text-burnt" />
          </span>
        ))}
      </div>

      <div className="absolute left-8 md:left-16 top-10 md:top-14 overflow-hidden">
        <div data-pre-in>
          <Image src="/icons/logo.svg" alt="Umaemi logo" width={40} height={40} priority />
        </div>
      </div>

      <div className="absolute left-8 md:left-16 bottom-10 md:bottom-14 overflow-hidden">
        <div data-pre-in className="w-40 md:w-56 opacity-40">
          <Image src="/icons/wordmark.svg" alt="Umaemi" width={810} height={140} priority />
        </div>
      </div>

      <div className="absolute right-8 md:right-16 bottom-6 md:bottom-8 overflow-hidden leading-none">
        <span
          data-pre-in
          ref={counter}
          className="block font-mono font-light tabular-nums text-[22vw] md:text-[12vw] leading-[0.85] tracking-tighter text-cream/90"
        >
          000
        </span>
      </div>
    </div>
  );
}
