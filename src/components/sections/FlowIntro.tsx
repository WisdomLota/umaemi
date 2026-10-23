"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import CornerDot from "@/components/ui/CornerDot";
import SplitReveal from "@/components/ui/SplitReveal";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import { DiamondPiece } from "@/components/three/HeroDiamond";
import { gsap, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import type { Flow } from "@/lib/flows";

// Which piece of the diamond accompanies each section, and on which side.
const LAYOUT = [
  { piece: 0, side: "right" },
  { piece: 1, side: "left" },
  { piece: 2, side: "right" },
  { piece: 1, side: "left" },
] as const;

const STEPPER_ROT = ["rotate-0", "rotate-90", "rotate-180", "-rotate-90"];

function Stepper({ vertical = false, lit = -1, dim = -1 }: { vertical?: boolean; lit?: number; dim?: number }) {
  return (
    <div aria-hidden className={`flex ${vertical ? "flex-col gap-10" : "gap-8 md:gap-12"}`}>
      {STEPPER_ROT.map((rot, i) => (
        <CornerDot
          key={rot}
          data-intro-dot
          className={`${rot} w-6 h-6 ${i === lit ? "text-burnt" : i === dim ? "text-dark/30" : "text-dark"}`}
        />
      ))}
    </div>
  );
}

export default function FlowIntro({ flow }: { flow: Flow }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-intro-rule]", { scaleX: 0, duration: 1.6, ease: EASE.inOut, stagger: 0.12, delay: 0.2 });
      gsap.from("[data-intro-dot]", { scale: 0, rotate: -90, duration: 0.9, ease: EASE.out, stagger: 0.06, delay: 0.5 });
      gsap.utils.toArray<HTMLElement>("[data-intro-list] li").forEach((li, i) => {
        gsap.from(li, {
          x: -24,
          autoAlpha: 0,
          duration: 0.9,
          ease: EASE.out,
          delay: i * 0.06,
          scrollTrigger: { trigger: li, start: "top 90%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="bg-peach text-dark pt-28 md:pt-32">
      {/* the introduction bar: where you are, and the four steps ahead */}
      <div data-world="peach" className="px-6 md:px-16">
        <div className="relative max-w-7xl mx-auto py-4 md:py-5 flex items-center justify-between gap-6">
          <div data-intro-rule className="absolute inset-x-0 top-0 h-px bg-dark origin-left" />
          <div data-intro-rule className="absolute inset-x-0 bottom-0 h-px bg-dark origin-right" />
          <div className="flex items-center gap-5">
            <CornerDot data-intro-dot className="w-6 h-6 text-dark" />
            <span className="font-sans text-xl md:text-2xl">Introduction</span>
          </div>
          <div className="hidden sm:block">
            <Stepper dim={0} />
          </div>
        </div>
      </div>

      {flow.intro.map((section, i) => {
        const { piece, side } = LAYOUT[i];
        const lastSection = i === flow.intro.length - 1;
        return (
          <section
            key={section.title}
            data-world="peach"
            className="relative px-6 md:px-16 py-20 md:py-32 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
              <div
                className={`flex ${side === "left" ? "md:col-span-5 md:order-1 justify-start md:-ml-16" : "md:col-span-5 md:order-2 md:col-start-8 justify-end"}`}
              >
                <DiamondAnchor
                  id={`intro-${i}`}
                  solo={piece}
                  color="#460E04"
                  tilt={0.7}
                  className="w-[60vw] md:w-full max-w-md aspect-469/439"
                  fallback={<DiamondPiece index={piece} />}
                />
              </div>

              <div
                className={`flex gap-10 lg:gap-16 items-center ${
                  side === "left" ? "md:col-span-7 md:order-2" : "md:col-span-6 md:order-1 md:row-start-1"
                }`}
              >
                {lastSection && (
                  <div className="hidden lg:block shrink-0">
                    <Stepper vertical lit={3} />
                  </div>
                )}
                <div className="max-w-xl">
                  <SplitReveal as={i === 0 ? "h1" : "h2"} by="chars" className="font-sans font-medium text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mb-8">
                    {section.title}
                  </SplitReveal>
                  <div className="flex flex-col gap-5 font-mono text-sm md:text-base leading-relaxed text-dark/90">
                    {section.paragraphs.map((p) => (
                      <SplitReveal key={p} as="p" by="lines" stagger={0.06}>
                        {p}
                      </SplitReveal>
                    ))}
                    {section.list && (
                      <>
                        {section.list.lead && <p>{section.list.lead}</p>}
                        <ul data-intro-list className="flex flex-col gap-3">
                          {section.list.items.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span aria-hidden className="mt-[0.6em] w-1.5 h-1.5 shrink-0 rounded-full bg-burnt" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {section.list.after && <p>{section.list.after}</p>}
                      </>
                    )}
                  </div>
                  {lastSection && (
                    <div className="mt-12">
                      <Button href={flow.formHref}>Next</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
