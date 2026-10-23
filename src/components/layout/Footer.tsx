"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import XIcon from "@/components/ui/XIcon";
import Magnetic from "@/components/ui/Magnetic";
import { navLinks, RollText } from "@/components/layout/Navbar";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

const socials = [
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: XIcon, href: "#", label: "X" },
];

/**
 * The footer waits underneath the page. As the last section lifts away on
 * its rounded corner, the footer is uncovered and its contents settle in.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  // Section links are in-page on the home page and point back home elsewhere.
  const prefix = usePathname() === "/" ? "" : "/";

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Sticky elements confuse trigger maths, so measure from the end of <main>.
      const st = {
        trigger: el.previousElementSibling ?? el,
        start: "bottom bottom",
        end: () => `bottom ${window.innerHeight - el.offsetHeight}px`,
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.fromTo("[data-foot-inner]", { yPercent: -35 }, { yPercent: 0, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-foot-mark]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-foot-rule]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="sticky bottom-0 z-0 bg-ink text-cream overflow-hidden">
      <div data-foot-inner className="px-6 sm:px-10 md:px-16 pt-24 md:pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          <div data-foot-rule className="mb-16 dash-x text-cream/40 origin-left" />

          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left justify-between gap-12">
            <Image src="/icons/logo-gray.svg" alt="Umaemi logo" width={130} height={166} className="w-32.5 h-auto" />

            <div className="flex flex-col items-center md:items-end gap-8">
              <div className="flex gap-5">
                {socials.map(({ icon: Icon, href, label }) => (
                  <Magnetic key={label} strength={0.4} reach={18}>
                    <Link
                      href={href}
                      aria-label={label}
                      className="group/soc relative w-12 h-12 rounded-full border border-cream flex items-center justify-center text-cream overflow-hidden isolate"
                    >
                      <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-burnt scale-0 transition-transform duration-500 ease-out-expo group-hover/soc:scale-100" />
                      <Icon className="w-5 h-5 transition-transform duration-500 ease-out-expo group-hover/soc:scale-110 group-hover/soc:-rotate-6" />
                    </Link>
                  </Magnetic>
                ))}
              </div>

              <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 font-mono text-sm md:text-base text-cream">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={prefix + link.href} className="group inline-block">
                      <RollText text={link.label} />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="font-mono text-sm text-cream/60">
                Umaemi Innovation and Technologies copyright 2026 ©
              </p>
            </div>
          </div>
        </div>

        <div data-foot-mark className="mt-16 md:mt-24 opacity-[0.07]">
          <Image src="/icons/wordmark.svg" alt="Umaemi" width={810} height={140} className="w-full h-auto" />
        </div>
      </div>
    </footer>
  );
}
