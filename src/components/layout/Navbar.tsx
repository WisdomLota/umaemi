"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { introStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/media";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

/** Each letter rolls up out of view as its twin rolls in, one after another. */
export function RollText({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          <span
            className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
          <span
            className="absolute left-0 top-full inline-block text-burnt transition-transform duration-500 ease-out-expo group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Entrance, hide-on-scroll-down, glass-on-scroll, scroll progress, and a
  // logo that spins with the scroll's momentum.
  useEffect(() => {
    const h = header.current!;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.set("[data-nav-in]", { yPercent: reduced ? 0 : -140 });
      const enter = () =>
        gsap.to("[data-nav-in]", { yPercent: 0, duration: 1.2, ease: EASE.out, stagger: 0.06, delay: 0.25 });
      if (introStore.get() === "done") enter();
      const unsub = introStore.subscribe(() => introStore.get() === "done" && enter());

      gsap.to(progress.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      let spin = 0;
      let velocity = 0;
      const tick = (_: number, dt: number) => {
        spin += (0.4 + Math.min(Math.abs(velocity) / 120, 14)) * dt * 0.06;
        velocity *= 0.92;
        if (logo.current) logo.current.style.transform = `rotate(${spin}deg)`;
      };
      if (!reduced) gsap.ticker.add(tick);

      const hide = gsap.quickTo(h, "yPercent", { duration: 0.6, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          velocity = self.getVelocity();
          const y = self.scroll();
          bar.current?.classList.toggle("is-glass", y > 40);
          if (!reduced) hide(self.direction === 1 && y > 240 ? -130 : 0);
        },
      });

      return () => {
        unsub();
        gsap.ticker.remove(tick);
      };
    }, h);
    return () => ctx.revert();
  }, []);

  // Full-screen menu: the panel drops in with the brand corner, links rise.
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    if (open) lenis?.stop();
    else lenis?.start();
    const tl = gsap.timeline();
    if (open) {
      tl.set(m, { visibility: "visible" })
        .fromTo(
          m,
          { clipPath: "inset(0% 0% 100% 0% round 0px 0px 120px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 0.9, ease: EASE.inOut }
        )
        .fromTo("[data-menu-link]", { yPercent: 120 }, { yPercent: 0, duration: 1, ease: EASE.out, stagger: 0.07 }, 0.35);
    } else {
      tl.to(m, { clipPath: "inset(0% 0% 100% 0% round 0px 0px 120px 0px)", duration: 0.7, ease: EASE.inOut }).set(m, {
        visibility: "hidden",
      });
    }
    return () => {
      tl.kill();
    };
  }, [open, lenis]);

  return (
    <>
      <header ref={header} className={`fixed inset-x-0 top-0 ${open ? "z-[66]" : "z-40"}`} style={{ color: open ? "var(--color-cream)" : "var(--world-fg)" }}>
        <div className="h-1.5 bg-burnt relative overflow-hidden">
          <div ref={progress} className="absolute inset-0 bg-dark origin-left scale-x-0" />
        </div>
        <div className="px-3 md:px-6 pt-3">
          <div
            ref={bar}
            className="group/bar corner [--r:20px] transition-[background-color,backdrop-filter,box-shadow] duration-500 [&.is-glass]:bg-[var(--world-glass)] [&.is-glass]:backdrop-blur-md [&.is-glass]:shadow-[0_10px_40px_-20px_rgba(17,4,2,0.35)]"
          >
            <nav className="flex items-center justify-between px-5 md:px-10 py-4 md:py-5" aria-label="Primary">
              <div className="overflow-hidden">
                <Link href="#hero" data-nav-in className="block font-mono font-medium" aria-label="Umaemi home">
                  <div ref={logo} className="will-change-transform">
                    <Image src="/icons/logo.svg" alt="Umaemi" width={44} height={44} priority />
                  </div>
                </Link>
              </div>

              <ul className="hidden md:flex items-center gap-12 font-mono text-base font-medium">
                {navLinks.map((link) => (
                  <li key={link.href} className="overflow-hidden py-1">
                    <Link href={link.href} data-nav-in className="group relative inline-block">
                      <RollText text={link.label} />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="md:hidden overflow-hidden">
                <button
                  data-nav-in
                  className="relative w-11 h-11 flex flex-col items-center justify-center gap-[7px]"
                  onClick={() => setOpen((o) => !o)}
                  aria-label="Toggle menu"
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                >
                  <span className={`block h-[2px] w-7 bg-current transition-transform duration-500 ease-out-expo ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
                  <span className={`block h-[2px] w-7 bg-current transition-transform duration-500 ease-out-expo ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-0 z-[65] bg-burnt text-cream md:hidden invisible flex flex-col justify-end px-6 pb-14"
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <li key={link.href} className="overflow-hidden border-b border-cream/25">
              <Link
                href={link.href}
                data-menu-link
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-3 font-sans font-medium text-[15vw] leading-[1] tracking-tight"
              >
                {link.label}
                <span className="font-mono text-sm text-cream/60">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
