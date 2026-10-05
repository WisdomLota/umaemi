"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import SplitReveal from "@/components/ui/SplitReveal";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, prefersReducedMotion } from "@/lib/media";

export default function Partnership() {
  const root = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The cube field drifts up and slowly turns as you pass, like something
      // being assembled just out of reach.
      gsap.fromTo(
        "[data-cubes]",
        { yPercent: -12, scale: 1.25, rotate: -4 },
        { yPercent: 10, scale: 1.05, rotate: 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
      gsap.from("[data-partner-in]", {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 55%", once: true },
      });
    }, el);

    // …and leans away from the cursor, for depth.
    let cleanup = () => {};
    if (matchMedia(FINE_POINTER).matches && art.current) {
      const xTo = gsap.quickTo(art.current, "x", { duration: 1.4, ease: "power3" });
      const yTo = gsap.quickTo(art.current, "y", { duration: 1.4, ease: "power3" });
      const move = (e: PointerEvent) => {
        xTo((e.clientX / innerWidth - 0.5) * -40);
        yTo((e.clientY / innerHeight - 0.5) * -30);
      };
      window.addEventListener("pointermove", move, { passive: true });
      cleanup = () => window.removeEventListener("pointermove", move);
    }
    return () => {
      ctx.revert();
      cleanup();
    };
  }, []);

  return (
    <section ref={root} data-world="night" className="relative bg-night text-cream overflow-hidden">
      <div ref={art} aria-hidden className="absolute -inset-10 pointer-events-none">
        <div data-cubes className="absolute inset-0">
          <Image src="/images/partnership-bg.png" alt="" fill sizes="110vw" className="object-cover object-top" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-night/40 to-night pointer-events-none" />

      <div className="relative px-6 sm:px-10 md:px-16 pt-56 md:pt-80 pb-28 md:pb-40">
        <div className="max-w-4xl mx-auto">
          <SplitReveal as="h2" by="chars" className="font-sans font-medium text-4xl md:text-6xl tracking-[-0.03em] leading-[1.02] mb-8">
            More Than a Service, A Partnership
          </SplitReveal>
          <div className="flex flex-col gap-5 font-mono text-sm md:text-base leading-relaxed text-cream/85 max-w-3xl mb-12">
            <SplitReveal as="p" by="lines">
              At Umaemi, we believe the best solutions come from collaboration. Our network brings together
              businesses, entrepreneurs, and organizations looking to share ideas, solve challenges, and grow with
              confidence. When you join our community, you gain more than a service provider, you gain a partner
              invested in your success.
            </SplitReveal>
            <p data-partner-in>Join the community and grow with us.</p>
          </div>
          <div data-partner-in>
            <Button href="/join" className="md:max-w-none" wrapperClassName="md:max-w-xl">
              Join
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
