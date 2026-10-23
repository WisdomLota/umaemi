"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { kickDiamond } from "@/components/three/diamond-bus";
import { gsap, Flip } from "@/lib/gsap";
import { homeProjects, Project } from "@/lib/projects";
import { prefersReducedMotion } from "@/lib/media";

// The home catalog shows five projects; the rest live on /projects.
const projects = homeProjects;

// order[0] is the featured project; order[1..4] fill the four side slots
// (two left, two right). Choosing a tile swaps it with the featured one.
const INITIAL_ORDER = [0, 1, 2, 3, 4];

function ProjectTile({
  project,
  onSelect,
  size = "lg",
}: {
  project: Project;
  onSelect: () => void;
  size?: "sm" | "lg";
}) {
  const { name, icon } = project;
  return (
    <TiltCard max={14} className="group corner [--r:0.9rem]">
      <button
        type="button"
        onClick={onSelect}
        aria-label={name}
        className={`relative corner [--r:0.9rem] border border-cream/15 bg-cream/[0.02] flex items-center justify-center transition-colors duration-500 group-hover:border-burnt/70 group-hover:bg-burnt/[0.06] ${
          size === "lg" ? "w-32 h-32 lg:w-40 lg:h-40" : "w-full aspect-square"
        }`}
      >
        <div className="logo-mute group-hover:scale-110">
          <div data-flip-id={project.slug} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16">
            <Image src={icon} alt={`${name} logo`} width={64} height={64} className="w-full h-full object-contain" />
          </div>
        </div>
        <CornerDot className="absolute -top-px -left-px w-4 h-4 text-burnt scale-0 transition-transform duration-500 ease-out-expo group-hover:scale-100" />
        <CornerDot className="absolute -bottom-px -right-px w-4 h-4 text-burnt rotate-180 scale-0 transition-transform duration-500 delay-75 ease-out-expo group-hover:scale-100" />
        <span className="absolute left-3 bottom-2 font-mono text-[10px] tracking-widest text-cream/0 transition-colors duration-500 group-hover:text-cream/60 hidden sm:block">
          {name.toUpperCase()}
        </span>
      </button>
    </TiltCard>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <TiltCard max={8} className="w-60 lg:w-72 h-112 lg:h-136 shrink-0 corner-flip [--r:1rem]">
      {/* dashed outer frame marches around; the inner frame takes on the
          featured brand's own colour and glows with it */}
      <CornerFrame corners="tr-bl" radius={16} stroke="var(--color-cream)" dashed march />
      <div className="absolute inset-2" style={{ ["--accent" as string]: project.accent }}>
        <CornerFrame corners="tl-br" radius={16} stroke="var(--accent)" className="transition-[stroke] duration-700" />
        <div
          aria-hidden
          className="absolute inset-0 corner [--r:1rem] opacity-60 transition-shadow duration-700"
          style={{
            boxShadow:
              "inset 0 0 60px -10px color-mix(in oklab, var(--accent) 35%, transparent), 0 0 80px -30px color-mix(in oklab, var(--accent) 50%, transparent)",
          }}
        />
        {/* scanline sweep */}
        <div aria-hidden className="absolute inset-0 overflow-hidden corner [--r:1rem]">
          <div
            className="absolute inset-x-0 h-24 -top-24 animate-[scan_4.5s_linear_infinite]"
            style={{ background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent) 10%, transparent), transparent)" }}
          />
        </div>
        <div data-depth="60" className="absolute inset-0 flex items-center justify-center">
          <PixelReveal cols={10} rows={8}>
            <div data-flip-id={project.slug} className="w-25 h-25 lg:w-30 lg:h-30">
              <Image src={project.icon} alt={project.name} width={120} height={120} className="w-full h-full object-contain" />
            </div>
          </PixelReveal>
        </div>
      </div>
    </TiltCard>
  );
}

function ProjectInfo({ project, align = "left" }: { project: Project; align?: "left" | "center" }) {
  // Keyed by project so the copy re-animates in each time the featured one changes.
  const copy = project.home!;
  return (
    <div key={project.slug} aria-live="polite" className={align === "center" ? "text-center max-w-xs" : "text-left max-w-xs"}>
      <SplitReveal as="h3" by="chars" className="font-sans text-3xl lg:text-4xl font-medium mb-4">
        {copy.name ?? project.name}
      </SplitReveal>
      <SplitReveal as="p" by="lines" className="font-mono text-sm lg:text-base text-cream/70 mb-6">
        {copy.description}
      </SplitReveal>
      <div className={`flex gap-4 lg:gap-6 flex-wrap font-mono text-xs lg:text-sm font-medium text-burnt ${align === "center" ? "justify-center" : ""}`}>
        {project.tags.map((t, i) => (
          <Scramble key={t} text={t} hover delay={i * 0.12} />
        ))}
      </div>
    </div>
  );
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="flex flex-col items-stretch gap-4 w-full max-w-xs lg:w-72">
      <div data-cursor="view" className="text-cream">
        <Button
          href={project.url ?? "#"}
          variant="outline"
          icon={<ArrowUpRight className="w-5 h-5" />}
          className="justify-center border-burnt!"
        >
          {project.action}
        </Button>
      </div>
      <Button href="/projects" className="w-full justify-center">
        Explore Catalog
      </Button>
    </div>
  );
}

export default function ProjectCatalog() {
  const root = useRef<HTMLElement>(null);
  const [order, setOrder] = useState(INITIAL_ORDER);
  const flipState = useRef<Flip.FlipState | null>(null);
  const featured = projects[order[0]];
  const slot = (i: number) => projects[order[i]];

  // Only the visible layout (mobile or desktop) takes part in the flip.
  const visibleLogos = () =>
    Array.from(root.current?.querySelectorAll<HTMLElement>("[data-flip-id]") ?? []).filter(
      (el) => el.offsetParent !== null
    );

  const select = (s: number) => {
    if (!prefersReducedMotion()) flipState.current = Flip.getState(visibleLogos());
    setOrder((o) => {
      const next = [...o];
      [next[0], next[s]] = [next[s], next[0]];
      return next;
    });
  };

  // The chosen logo flies into the centre screen while the old one flies
  // back out to take its place; the diamond in the title spins with it.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    kickDiamond(1.4);
    const tween = Flip.from(state, {
      targets: visibleLogos(),
      duration: 1.1,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      zIndex: 40,
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [order]);

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
          {[1, 2, 3, 4].map((i) => (
            <ProjectTile key={i} project={slot(i)} onSelect={() => select(i)} size="sm" />
          ))}
        </div>
        <FeaturedCard project={featured} />
        <ProjectInfo project={featured} align="center" />
        <ProjectActions project={featured} />
      </div>

      {/* desktop: the featured project held between its siblings */}
      <div className="hidden md:flex w-full justify-center items-start gap-6 lg:gap-10">
        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 right-0 flex gap-6">
            {[1, 2].map((i, k) => (
              <div key={i} data-drift={20 + k * 25}>
                <ProjectTile project={slot(i)} onSelect={() => select(i)} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 right-0">
            <ProjectInfo project={featured} />
          </div>
        </div>

        <FeaturedCard project={featured} />

        <div className="relative h-136 w-64 lg:w-80">
          <div className="absolute -top-14 left-0 flex gap-6">
            {[3, 4].map((i, k) => (
              <div key={i} data-drift={45 - k * 25}>
                <ProjectTile project={slot(i)} onSelect={() => select(i)} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-14 left-0">
            <ProjectActions project={featured} />
          </div>
        </div>
      </div>
    </section>
  );
}
