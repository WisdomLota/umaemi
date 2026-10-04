"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import CornerDot from "@/components/ui/CornerDot";
import Button from "@/components/ui/Button";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import HeroDiamond from "@/components/three/HeroDiamond";
import { bus } from "@/components/three/diamond-bus";
import { gsap, ScrollTrigger, SplitText, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

const services = [
  {
    title: "Consultation & Guidance",
    tagline:
      "Free consultation and value-first guidance, helping you explore solutions before committing.",
    body: "Our process begins with a free consultation session where we take time to understand your challenges and goals. In this conversation, we explore ideas together and outline practical solutions tailored to your needs. It's a chance to see how technology can support your business in clear, simple terms, without pressure or jargon, so you can move forward with confidence and make informed decisions about the next steps.",
    image: "/images/services/consultation.png",
  },
  {
    title: "White-Label Solutions",
    tagline:
      "Ready-made, customizable software and tools you can try on trial, freemium, or subscription before investing in a full custom solution build.",
    body: "We provide flexible, ready-made software that can be customized to fit your business. With options available on trial, freemium, or subscription, you can experiment with dashboards and tools, explore what works best, and validate ideas before moving to a full custom solution. This way, you reduce risk and gain confidence while testing technology in real time.",
    image: "/images/services/white-label.png",
  },
  {
    title: "Custom Tech Solutions",
    tagline:
      "We design and build digital tools tailored to your business, solving everyday challenges with technology that works for you.",
    body: "We create technology that fits your business, not the other way around. Our custom solutions are built to simplify daily operations, turning complex challenges into easy-to-use digital tools. Whether you're a company or an individual without a technical background, we design systems that work seamlessly so you can focus on what matters most, running and growing your business.",
    image: "/images/services/custom-tech.png",
  },
  {
    title: "Branding & Visualization",
    tagline:
      "Comprehensive branding and ongoing management, from creating your identity and design to continuously refining and updating your brand guide.",
    body: "At Umaemi, we craft and manage your brand with care, building a strong identity and professional design that grows with your business. Beyond the initial creation, we provide ongoing updates and refinements to your brand guide, ensuring your presence stays consistent, modern, and aligned with your goals. This continuous support gives you confidence and clarity as your brand evolves in a changing market.",
    image: "/images/services/branding.png",
  },
];

const N = services.length;
// The four corner marks sit in a 2×2 dial: TL, TR, BL, BR → service 0, 1, 3, 2.
const DIAL = [
  { i: 0, rot: "rotate-0" },
  { i: 1, rot: "rotate-90" },
  { i: 3, rot: "-rotate-90" },
  { i: 2, rot: "rotate-180" },
];
const PIXELS = { cols: 8, rows: 10 };

export default function Services() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const shown = useRef(0);
  const lenis = useLenis();
  const current = services[active];

  // Desktop: pin the section and let scroll turn the dial.
  useEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
      trigger.current = ScrollTrigger.create({
        trigger: pin.current,
        pin: true,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.6}`,
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.05 },
        onUpdate(self) {
          const i = Math.round(self.progress * (N - 1));
          if (i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
        },
      });
      gsap.to("[data-svc-progress]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: pin.current, start: "top top", end: () => `+=${window.innerHeight * 2.6}`, scrub: true },
      });
      return () => {
        trigger.current = null;
      };
    });

    // The diamond spotlights the piece that matches the active service, but
    // only while this section owns the screen.
    const focus = ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        bus.focus = self.isActive ? activeRef.current : -1;
      },
    });
    return () => {
      focus.kill();
      mm.revert();
      bus.focus = -1;
    };
  }, []);

  useEffect(() => {
    if (bus.focus !== -1) bus.focus = active;
  }, [active]);

  // Copy swap: words rise out of their lines each time the service changes.
  useEffect(() => {
    const el = copy.current;
    if (!el || prefersReducedMotion()) return;
    const splits = Array.from(el.querySelectorAll<HTMLElement>("[data-svc-split]")).map((t) =>
      SplitText.create(t, { type: "lines,words", mask: "lines" })
    );
    const tl = gsap.timeline();
    splits.forEach((s, k) =>
      tl.from(s.words, { yPercent: 110, duration: 0.9, ease: EASE.out, stagger: k === 2 ? 0.004 : 0.025 }, k * 0.08)
    );
    tl.fromTo("[data-svc-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: EASE.inOut }, 0.1);
    return () => {
      tl.kill();
      splits.forEach((s) => s.revert());
    };
  }, [active]);

  // Image swap: a field of pixels floods the frame, the photo changes behind
  // it, and the pixels drain away in a different order.
  useEffect(() => {
    const el = media.current;
    if (!el || shown.current === active) return;
    const imgs = el.querySelectorAll<HTMLElement>("[data-svc-img]");
    const cells = el.querySelectorAll("[data-svc-pixel]");
    const swap = () => {
      imgs.forEach((img, i) => gsap.set(img, { autoAlpha: i === active ? 1 : 0 }));
      shown.current = active;
    };
    if (prefersReducedMotion()) {
      swap();
      return;
    }
    const tl = gsap.timeline();
    tl.to(cells, { scale: 1, duration: 0.18, ease: "power2.out", stagger: { each: 0.004, from: "random", grid: [PIXELS.rows, PIXELS.cols] } })
      .add(swap)
      .fromTo(imgs[active], { scale: 1.18 }, { scale: 1, duration: 1.6, ease: EASE.out })
      .to(cells, { scale: 0, duration: 0.25, ease: "power2.in", stagger: { each: 0.005, from: "edges", grid: [PIXELS.rows, PIXELS.cols] } }, "<");
    return () => {
      tl.progress(1).kill();
    };
  }, [active]);

  const select = (i: number) => {
    const st = trigger.current;
    if (st && lenis) {
      lenis.scrollTo(st.start + ((st.end - st.start) * i) / (N - 1), { duration: 1.2 });
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + N) % N;
    select(next);
    document.getElementById(`svc-tab-${next}`)?.focus();
  };

  // Mobile: swipe the image to change service.
  const swipe = useRef<number | null>(null);

  return (
    <section
      id="services"
      ref={root}
      data-world="cream"
      className="relative bg-cream text-dark -mt-36 pt-36"
    >
      <div ref={pin} className="md:h-svh flex items-center px-6 sm:px-10 md:px-16 py-16 md:py-0">
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 w-full max-w-7xl mx-auto md:h-[min(80vh,780px)]">
          <div ref={copy} className="md:col-span-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-6 mb-8">
              <h2 className="font-sans font-medium text-5xl lg:text-6xl tracking-[-0.03em]">Services</h2>
              <DiamondAnchor
                id="services"
                className="h-20 lg:h-24 aspect-469/439"
                color="#460E04"
                explode={0.12}
                tilt={0.8}
                fallback={<HeroDiamond />}
              />
            </div>

            <div className="flex items-center gap-6 mb-8">
              {/* the dial: four brand corners; the cluster turns to bring the active one home */}
              <div
                role="tablist"
                aria-label="Services"
                onKeyDown={onKey}
                className="grid grid-cols-2 gap-1.5 transition-transform duration-1000 ease-out-expo"
                style={{ transform: `rotate(${-90 * active}deg)` }}
              >
                {DIAL.map(({ i, rot }) => (
                  <button
                    key={i}
                    id={`svc-tab-${i}`}
                    role="tab"
                    aria-selected={i === active}
                    aria-controls="svc-panel"
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => select(i)}
                    aria-label={services[i].title}
                    className="p-1 group"
                  >
                    <CornerDot
                      className={`${rot} w-7 h-7 transition-[color,transform] duration-500 ${
                        i === active ? "text-burnt scale-110" : "text-dark/30 group-hover:text-dark/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="font-mono text-sm tabular-nums">
                <span className="text-burnt">0{active + 1}</span>
                <span className="text-dark/40"> / 0{N}</span>
              </div>
            </div>

            <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`} aria-live="polite" className="flex flex-col flex-1 min-h-0">
              <h3 key={`t${active}`} data-svc-split className="font-sans font-medium text-3xl lg:text-4xl tracking-[-0.02em] mb-4">
                {current.title}
              </h3>
              <p key={`g${active}`} data-svc-split className="font-mono text-sm text-dark/90 mb-6">
                {current.tagline}
              </p>
              <div data-svc-rule className="mb-6 dash-x text-ink/80 origin-left" />
              <p key={`b${active}`} data-svc-split className="font-mono text-sm text-dark/70 leading-relaxed">
                {current.body}
              </p>
              <div className="mt-10 md:mt-auto pt-6">
                <Button href="#contact">Book Consultation Session</Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 relative min-h-112 md:min-h-0 flex gap-5">
            <div
              ref={media}
              className="relative flex-1 corner [--r:2.5rem] overflow-hidden bg-dark touch-pan-y"
              onPointerDown={(e) => (swipe.current = e.clientX)}
              onPointerUp={(e) => {
                if (swipe.current === null) return;
                const dx = e.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(dx) > 50 && !trigger.current) select((active + (dx < 0 ? 1 : -1) + N) % N);
              }}
            >
              {services.map((s, i) => (
                <div key={s.image} data-svc-img className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
              <div
                aria-hidden
                className="absolute inset-0 grid pointer-events-none"
                style={{ gridTemplateColumns: `repeat(${PIXELS.cols}, 1fr)`, gridTemplateRows: `repeat(${PIXELS.rows}, 1fr)` }}
              >
                {Array.from({ length: PIXELS.cols * PIXELS.rows }, (_, i) => (
                  <span key={i} data-svc-pixel className={`scale-0 -m-px ${i % 3 === 0 ? "bg-dark" : "bg-burnt"}`} />
                ))}
              </div>
              <div className="absolute left-6 bottom-6 font-mono text-xs tracking-widest text-cream/80 mix-blend-normal md:hidden">
                0{active + 1} / 0{N}
              </div>
            </div>

            {/* scroll progress through the four services */}
            <div aria-hidden className="hidden md:block relative w-0.5 self-stretch">
              <div className="absolute inset-0 dash-y text-dark/20" />
              <div data-svc-progress className="absolute inset-0 bg-burnt origin-top scale-y-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
