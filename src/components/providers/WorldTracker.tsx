"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps <html data-world> in sync with whichever section is under the navbar,
 * so fixed chrome (nav, cursor) always reads against the colour behind it.
 */
export default function WorldTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-world]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 48px",
        end: "bottom 48px",
        onToggle: (self) => {
          if (self.isActive) root.dataset.world = el.dataset.world;
        },
      })
    );
    const first = document.querySelector<HTMLElement>("[data-world]");
    if (first) root.dataset.world = first.dataset.world;
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);
  return null;
}
