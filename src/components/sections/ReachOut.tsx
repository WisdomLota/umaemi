"use client";

import { useEffect, useRef, useState } from "react";
import SendIcon from "@/components/ui/SendIcon";
import Magnetic from "@/components/ui/Magnetic";
import Marquee from "@/components/ui/Marquee";
import SplitReveal from "@/components/ui/SplitReveal";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import HeroDiamond from "@/components/three/HeroDiamond";
import { burstDiamond, kickDiamond } from "@/components/three/diamond-bus";
import { DIAMOND_PIECES, DIAMOND_VIEWBOX } from "@/components/three/diamond-paths";
import { gsap, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

function Glyph() {
  return (
    <svg viewBox={`0 0 ${DIAMOND_VIEWBOX.width} ${DIAMOND_VIEWBOX.height}`} className="h-[0.6em] w-auto mx-[0.35em] inline-block align-middle">
      {DIAMOND_PIECES.map((p) => (
        <path key={p.id} d={p.d} fill="currentColor" />
      ))}
    </svg>
  );
}

export default function ReachOut() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLSpanElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, message });
    // A little ceremony: the diamond bursts and the plane flies off and back.
    burstDiamond();
    if (plane.current && !prefersReducedMotion()) {
      gsap
        .timeline()
        .to(plane.current, { x: 60, y: -60, rotate: 12, autoAlpha: 0, duration: 0.5, ease: "power3.in" })
        .set(plane.current, { x: -40, y: 40, rotate: 0 })
        .to(plane.current, { x: 0, y: 0, autoAlpha: 1, duration: 0.8, ease: EASE.out });
    }
  };

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The panel tips up out of the page like a lid opening toward you.
      gsap.fromTo(
        panel.current,
        { rotationX: 18, yPercent: 14, scale: 0.92, transformOrigin: "50% 100%" },
        {
          rotationX: 0,
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: true },
        }
      );
      gsap.from("[data-field]", {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.out,
        stagger: 0.12,
        scrollTrigger: { trigger: panel.current, start: "top 60%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const fieldBase =
    "w-full bg-transparent px-6 py-4 font-mono text-base font-medium text-peach placeholder:text-peach/60 focus:outline-none focus:placeholder:text-peach/30 transition-colors";

  return (
    <section
      id="contact"
      ref={root}
      data-world="burnt"
      className="relative bg-burnt overflow-hidden py-24 md:py-36"
    >
      <Marquee speed={3} className="absolute top-8 md:top-10 inset-x-0 font-sans font-semibold text-[22vw] md:text-[14vw] leading-none tracking-[-0.04em] text-cream/[0.13] select-none">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="inline-flex items-center pr-[0.2em]">
            Reach Out
            <Glyph />
          </span>
        ))}
      </Marquee>

      <div className="relative px-6 sm:px-10 md:px-16 [perspective:1400px]">
        <div
          ref={panel}
          className="max-w-6xl mx-auto bg-dark corner [--r:2rem] px-7 sm:px-10 md:px-16 py-12 md:py-16 grid md:grid-cols-2 gap-12 md:gap-16 shadow-[0_60px_120px_-40px_rgba(17,4,2,0.7)] will-change-transform"
        >
          <div>
            <div className="flex items-center justify-between gap-6 mb-6">
              <SplitReveal as="h2" by="chars" className="font-sans text-4xl md:text-5xl font-medium tracking-[-0.02em] text-peach">
                Reach Out
              </SplitReveal>
              <DiamondAnchor
                id="contact"
                className="h-16 md:h-20 aspect-469/439"
                color="#FFD0A5"
                glow={0.05}
                explode={0.06}
                tilt={0.9}
                fallback={<HeroDiamond color="#FFD0A5" />}
              />
            </div>
            <SplitReveal as="p" by="lines" className="font-mono text-sm md:text-base font-medium text-peach/90 leading-relaxed">
              Let&apos;s start the conversation. Whether you&apos;re exploring
              ideas, need guidance, or are ready to build, we&apos;re here to
              listen and help. Reach out to us through the form or email, and
              we&apos;ll respond promptly with clarity and support. At Umaemi,
              every connection begins with understanding your needs and finding
              the right solutions together.
            </SplitReveal>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:pt-2">
            <div data-field className="sweep-border rounded-tl-lg rounded-br-lg border border-peach/35 focus-within:shadow-[0_0_40px_-12px_rgba(255,208,165,0.45)] transition-shadow duration-500">
              <input
                type="email"
                required
                aria-label="Email"
                placeholder="youremail@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  kickDiamond(0.18);
                }}
                className={fieldBase}
              />
            </div>
            <div data-field className="sweep-border rounded-tl-lg rounded-br-lg border border-peach/35 focus-within:shadow-[0_0_40px_-12px_rgba(255,208,165,0.45)] transition-shadow duration-500 flex-1">
              <textarea
                required
                rows={6}
                aria-label="Message"
                placeholder="I need help digitizing my business and..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  kickDiamond(0.18);
                }}
                className={`${fieldBase} resize-none h-full`}
                data-lenis-prevent
              />
            </div>
            <div data-field className="flex justify-end">
              <Magnetic strength={0.3} reach={30}>
                <button
                  type="submit"
                  className="group/send relative inline-flex items-center gap-3 px-8 py-4 corner [--r:1rem] bg-burnt text-cream font-mono text-base font-medium overflow-hidden isolate"
                >
                  <span aria-hidden className="absolute inset-0 -z-10 bg-cream corner [--r:1rem] origin-bottom-right scale-0 transition-transform duration-700 ease-out-expo group-hover/send:scale-100" />
                  <span className="transition-colors duration-300 group-hover/send:text-dark">Send</span>
                  <span ref={plane} className="inline-flex transition-colors duration-300 group-hover/send:text-burnt">
                    <SendIcon className="w-5 h-5" />
                  </span>
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
