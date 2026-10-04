"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import HeroDiamond from "@/components/three/HeroDiamond";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

export default function ClosingCTA() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      // From concept to clarity: each word sharpens out of a blur as you scroll.
      split = SplitText.create(headline.current!, { type: "words" });
      gsap.fromTo(
        split.words,
        { filter: "blur(14px)", opacity: 0.12, yPercent: 30 },
        {
          filter: "blur(0px)",
          opacity: 1,
          yPercent: 0,
          ease: "none",
          stagger: 0.15,
          scrollTrigger: { trigger: headline.current, start: "top 85%", end: "bottom 40%", scrub: true },
        }
      );
      // The steps climb one after another — growth, literally.
      gsap.from("[data-step]", {
        yPercent: 101,
        ease: "power2.out",
        stagger: 0.25,
        scrollTrigger: { trigger: "[data-steps]", start: "top 95%", end: "bottom 60%", scrub: true },
      });
      gsap.from("[data-cta-in]", {
        y: 30,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-cta-in]", start: "top 90%", once: true },
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      data-world="night"
      className="relative z-10 bg-night rounded-br-[140px] px-6 sm:px-10 md:px-16 pt-28 md:pt-40 pb-20 md:pb-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <h2
            ref={headline}
            className="font-sans text-[11vw] md:text-[5.4vw] text-cream font-medium leading-[0.98] tracking-[-0.035em] mb-12"
          >
            From concept to clarity, <br className="hidden md:block" />
            begin with a free consultation.
          </h2>
          <div data-cta-in>
            <Button href="#contact">Book Consultation Session</Button>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center md:items-end gap-10">
          <DiamondAnchor
            id="closing"
            className="h-[30vh] md:h-[38vh] max-h-96 aspect-469/439 md:mr-10"
            color="#E54100"
            glow={0.45}
            tilt={1.1}
            fallback={<HeroDiamond color="#E54100" />}
          />
          {/* the decor's three marks are thirds of its width — clip each to climb on its own */}
          <div data-steps className="relative w-full max-w-120 aspect-478/197 hidden md:block">
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${(2 - k) * 33.4}% 0 ${k * 33.3}%)` }}
              >
                <div data-step className="absolute inset-0">
                  <Image src="/icons/closing-decor.svg" alt="" width={478} height={197} className="w-full h-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
