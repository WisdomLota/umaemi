"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import HeroDiamond from "@/components/three/HeroDiamond";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import KineticHeadline from "@/components/ui/KineticHeadline";
import CornerDot from "@/components/ui/CornerDot";
import { gsap, EASE } from "@/lib/gsap";
import { introStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/media";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // Supporting copy and chrome arrive after the headline starts rising.
      gsap.set("[data-hero-in]", { autoAlpha: 0, y: reduced ? 0 : 30 });
      gsap.set("[data-hero-rule]", { scaleX: reduced ? 1 : 0 });
      const enter = () =>
        gsap
          .timeline({ delay: 0.5 })
          .to("[data-hero-rule]", { scaleX: 1, duration: 1.6, ease: EASE.inOut, stagger: 0.1 }, 0)
          .to("[data-hero-in]", { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.out, stagger: 0.1 }, 0.3);
      if (introStore.get() === "done") enter();
      const unsub = introStore.subscribe(() => introStore.get() === "done" && enter());

      const next = document.getElementById("projects");
      if (!reduced && next) {
        // As the catalog slides over, the hero sinks back into the page.
        gsap.to(inner.current, {
          scale: 0.9,
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
        });
        gsap.to("[data-hero-shade]", {
          opacity: 0.55,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
        });
      }
      return unsub;
    }, el);

    // A warm light follows the cursor across the paper.
    const g = glow.current!;
    const xTo = gsap.quickTo(g, "x", { duration: 1.2, ease: "power3" });
    const yTo = gsap.quickTo(g, "y", { duration: 1.2, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      data-world="peach"
      className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-peach text-dark"
    >
      <div ref={inner} className="relative h-full origin-top will-change-transform">
        {/* atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            ref={glow}
            className="absolute left-0 top-0 -ml-[30vw] -mt-[30vw] w-[60vw] h-[60vw] rounded-full opacity-50"
            style={{ background: "radial-gradient(circle, rgba(229,65,0,0.32) 0%, rgba(229,65,0,0) 60%)", transform: "translate(70vw, 40vh)" }}
          />
          {/* technical guides: the layout's own scaffolding, drawn in */}
          <div data-hero-rule className="absolute left-0 right-0 top-[22%] dash-x text-dark/15 origin-left" />
          <div data-hero-rule className="absolute left-0 right-0 bottom-[17%] dash-x text-dark/15 origin-right" />
          <div data-hero-rule className="absolute top-0 bottom-0 left-6 md:left-16 dash-y text-dark/15 origin-top" />
          <div data-hero-rule className="absolute top-0 bottom-0 right-6 md:right-16 dash-y text-dark/15 origin-bottom" />
          <CornerDot data-hero-in className="absolute left-6 md:left-16 top-[22%] -translate-x-[3px] -translate-y-[3px] w-5 h-5 text-burnt" />
          <CornerDot data-hero-in className="absolute right-6 md:right-16 bottom-[17%] translate-x-[3px] translate-y-[3px] rotate-180 w-5 h-5 text-burnt" />
        </div>

        <div className="relative h-full px-6 md:px-16 pt-24 md:pt-32 pb-8 md:pb-12 flex flex-col">
          {/* diamond: top-right on mobile, held at the right edge on desktop */}
          <div className="flex justify-end md:absolute md:right-16 md:top-0 md:bottom-0 md:w-[38%] md:items-center md:justify-center">
            <DiamondAnchor
              id="hero"
              className="h-[22vh] md:h-[44vh] max-h-115 aspect-469/439 md:mt-8"
              color="#460E04"
              fallback={<HeroDiamond />}
            />
          </div>

          <div className="mt-auto md:my-auto relative z-10 md:max-w-[62%]">
            <KineticHeadline className="font-sans text-[clamp(3.1rem,13vw,4.6rem)] md:text-[clamp(4rem,7.6vw,9.5rem)] leading-[0.9] tracking-[-0.035em] text-dark">
              We handle the tech, so you can focus on <span className="text-burnt">growth.</span>
            </KineticHeadline>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-12 pt-8 md:pt-0">
            <p data-hero-in className="max-w-md font-mono text-sm md:text-base text-dark/80 leading-relaxed">
              Umaemi helps non-technical businesses and individuals turn ideas
              into seamless digital solutions. Book a consultation and let&apos;s
              scale your business with tech.
            </p>
            <div data-hero-in className="w-full md:w-auto shrink-0">
              <Button href="#contact">Book Consultation Session</Button>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div data-hero-in className="absolute bottom-8 right-6 md:right-16 hidden md:flex flex-col items-center gap-3 translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-dark/40 flex justify-center pt-2">
            <span className="w-1 h-2 rounded-full bg-burnt animate-bounce" />
          </div>
        </div>
      </div>
      <div data-hero-shade aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
    </section>
  );
}
