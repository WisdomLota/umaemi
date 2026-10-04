"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import Button from "@/components/ui/Button";
import CornerDot from "@/components/ui/CornerDot";
import CornerFrame from "@/components/ui/CornerFrame";
import TiltCard from "@/components/ui/TiltCard";
import PixelReveal from "@/components/ui/PixelReveal";
import SplitReveal from "@/components/ui/SplitReveal";
import Scramble from "@/components/ui/Scramble";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import HeroDiamond from "@/components/three/HeroDiamond";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";

const sideProjects = [
  { name: "Hastium", icon: "/icons/projects/hastim.svg" },
  { name: "TMD", icon: "/icons/projects/tmd.svg" },
];

const sideProjectsRight = [
  { name: "Efandex", icon: "/icons/projects/efandex.svg" },
  { name: "Lowin", icon: "/icons/projects/lowin.svg" },
];

const tags = ["BRANDING", "DEVELOPMENT", "MAINTENANCE"];

function ProjectTile({ name, icon, size = "lg" }: { name: string; icon: string; size?: "sm" | "lg" }) {
  return (
    <TiltCard max={14} className="group corner [--r:0.9rem]">
      <figure
        data-tile
        className={`relative corner [--r:0.9rem] border border-cream/15 bg-cream/[0.02] flex items-center justify-center transition-colors duration-500 group-hover:border-burnt/70 group-hover:bg-burnt/[0.06] ${
          size === "lg" ? "w-32 h-32 lg:w-40 lg:h-40" : "w-full aspect-square"
        }`}
      >
        <div data-depth="40" className="opacity-60 grayscale transition-[opacity,filter,transform] duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110">
          <Image src={icon} alt={name} width={64} height={64} className="w-12 h-12 lg:w-16 lg:h-16 object-contain" />
        </div>
        <CornerDot className="absolute -top-px -left-px w-4 h-4 text-burnt scale-0 transition-transform duration-500 ease-out-expo group-hover:scale-100" />
        <CornerDot className="absolute -bottom-px -right-px w-4 h-4 text-burnt rotate-180 scale-0 transition-transform duration-500 delay-75 ease-out-expo group-hover:scale-100" />
        <figcaption className="absolute left-3 bottom-2 font-mono text-[10px] tracking-widest text-cream/0 transition-colors duration-500 group-hover:text-cream/60">
          {name.toUpperCase()}
        </figcaption>
      </figure>
    </TiltCard>
  );
}

function FeaturedCard() {
  return (
    <TiltCard max={8} className="w-60 lg:w-72 h-112 lg:h-136 shrink-0 corner-flip [--r:1rem]">
      {/* dashed outer frame marches around; cyan inner frame glows */}
      <CornerFrame corners="tr-bl" radius={16} stroke="var(--color-cream)" dashed march />
      <div className="absolute inset-2">
        <CornerFrame corners="tl-br" radius={16} stroke="var(--color-pixel)" />
        <div
          aria-hidden
          className="absolute inset-0 corner [--r:1rem] opacity-60"
          style={{ boxShadow: "inset 0 0 60px -10px rgba(76,201,240,0.35), 0 0 80px -30px rgba(76,201,240,0.5)" }}
        />
        {/* scanline sweep */}
        <div aria-hidden className="absolute inset-0 overflow-hidden corner [--r:1rem]">
          <div className="absolute inset-x-0 h-24 -top-24 bg-gradient-to-b from-transparent via-pixel/10 to-transparent animate-[scan_4.5s_linear_infinite]" />
        </div>
        <div data-depth="60" className="absolute inset-0 flex items-center justify-center">
          <PixelReveal cols={10} rows={8} className="w-[100px] lg:w-[120px]">
            <Image src="/icons/projects/pixel-codex.svg" alt="Pixel Codex" width={120} height={120} className="w-full h-auto" />
          </PixelReveal>
        </div>
      </div>
    </TiltCard>
  );
}

function ProjectInfo({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center max-w-xs" : "text-left max-w-xs"}>
      <SplitReveal as="h3" by="chars" className="font-sans text-3xl lg:text-4xl font-medium mb-4">
        Pixel Codex
      </SplitReveal>
      <SplitReveal as="p" by="lines" className="font-mono text-sm lg:text-base text-cream/70 mb-6">
        An Ed-Tech company that helps beginners in the tech space grow
        to a professional level of proficiency
      </SplitReveal>
      <div className={`flex gap-4 lg:gap-6 flex-wrap font-mono text-xs lg:text-sm font-medium text-burnt ${align === "center" ? "justify-center" : ""}`}>
        {tags.map((t, i) => (
          <Scramble key={t} text={t} hover delay={i * 0.12} />
        ))}
      </div>
    </div>
  );
}

function ProjectActions() {
  return (
    <div className="flex flex-col items-stretch gap-4 w-full max-w-xs lg:w-72">
      <div data-cursor="view">
        <Button href="#" variant="outline" icon={<ArrowUpRight className="w-5 h-5" />} className="justify-center">
          Visit Site
        </Button>
      </div>
      <Button href="#" className="w-full justify-center">
        Explore
      </Button>
    </div>
  );
}

export default function ProjectCatalog() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The dark sheet rises over the hero, opening out of the brand corner.
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 6% 0% 6% round 180px 0px 180px 0px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px 0px 140px 0px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
        }
      );
      // Title halves slide in from opposite sides, leaving room for the diamond.
      gsap.from("[data-title-left]", {
        xPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 90%", end: "top 15%", scrub: true },
      });
      gsap.from("[data-title-right]", {
        xPercent: 40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 90%", end: "top 15%", scrub: true },
      });
      // Tiles drift at different speeds — a little depth while scrolling.
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((d) => {
        gsap.fromTo(
          d,
          { y: Number(d.dataset.drift) },
          { y: -Number(d.dataset.drift), ease: "none", scrollTrigger: { trigger: d, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={root}
      data-world="night"
      className="relative z-10 bg-night text-cream rounded-br-[140px] py-28 md:py-40 px-6 sm:px-10 md:px-16 overflow-hidden"
    >
      <h2 className="relative text-center font-sans font-medium text-[12vw] md:text-[7.5vw] leading-[0.95] tracking-[-0.04em] mb-16 md:mb-28 flex flex-wrap items-center justify-center gap-x-[0.25em]">
        <span data-title-left className="inline-block">Our Project</span>
        <DiamondAnchor
          id="projects"
          className="inline-block h-[0.78em] aspect-[469/439]"
          color="#E54100"
          glow={0.55}
          spin={0.9}
          tilt={0.4}
          fallback={<HeroDiamond color="#E54100" />}
        />
        <span data-title-right className="inline-block">Catalog</span>
      </h2>

      {/* mobile: stacked */}
      <div className="flex flex-col items-center gap-12 md:hidden">
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {[...sideProjects, ...sideProjectsRight].map((p) => (
            <ProjectTile key={p.name} {...p} size="sm" />
          ))}
        </div>
        <FeaturedCard />
        <ProjectInfo align="center" />
        <ProjectActions />
      </div>

      {/* desktop: the featured project held between its siblings */}
      <div className="hidden md:flex w-full justify-center items-start gap-6 lg:gap-10">
        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 right-0 flex gap-6">
            {sideProjects.map((p, i) => (
              <div key={p.name} data-drift={20 + i * 25}>
                <ProjectTile {...p} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 right-0">
            <ProjectInfo />
          </div>
        </div>

        <FeaturedCard />

        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 left-0 flex gap-6">
            {sideProjectsRight.map((p, i) => (
              <div key={p.name} data-drift={45 - i * 25}>
                <ProjectTile {...p} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 left-0">
            <ProjectActions />
          </div>
        </div>
      </div>
    </section>
  );
}
