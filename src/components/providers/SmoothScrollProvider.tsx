"use client";

import { useEffect, ReactNode, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { introStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/media";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect the visitor: no inertia scrolling when they've asked for less motion.
    const instance = prefersReducedMotion()
      ? null
      : new Lenis({
          duration: 1.3,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          smoothWheel: true,
          wheelMultiplier: 1,
        });

    let tick: ((time: number) => void) | null = null;
    if (instance) {
      // One clock for everything: Lenis advances on GSAP's ticker so scroll,
      // ScrollTrigger and tweens never drift out of phase.
      instance.on("scroll", ScrollTrigger.update);
      tick = (time) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      window.__lenis = instance;
      // Defer so the setState happens outside the effect body.
      queueMicrotask(() => setLenis(instance));
    }

    // Hold the page still while the preloader runs.
    const lock = (locked: boolean) => {
      if (instance) {
        if (locked) instance.stop();
        else instance.start();
      }
      document.documentElement.style.overflow = locked ? "hidden" : "";
    };
    lock(introStore.get() === "loading");
    const unsub = introStore.subscribe(() => {
      lock(introStore.get() === "loading");
      ScrollTrigger.refresh();
    });

    // Intercept in-page anchor clicks and glide there.
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      if (instance) instance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      else el.scrollIntoView();
      history.replaceState(null, "", href);
    }
    document.addEventListener("click", handleClick);

    return () => {
      unsub();
      document.removeEventListener("click", handleClick);
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      delete window.__lenis;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
