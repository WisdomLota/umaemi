"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import Button from "@/components/ui/Button";
import TiltCard from "@/components/ui/TiltCard";
import PixelReveal from "@/components/ui/PixelReveal";
import { gsap, Flip, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { projects, Project } from "@/lib/projects";

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13 13l5 5" strokeLinecap="round" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const name = project.catalog.name ?? project.name;
  return (
    <TiltCard max={6} glare outerClassName="h-full" className="group h-full corner-flip [--r:1.25rem]">
      <article
        className="relative h-full flex flex-col border border-cream/40 corner-flip [--r:1.25rem] overflow-hidden transition-colors duration-500 group-hover:border-cream/80"
        style={{ ["--accent" as string]: project.accent }}
      >
        <div className="relative h-52 md:h-56 flex items-center justify-center border-b border-cream/40 overflow-hidden">
          {/* the brand's own colour blooms behind its logo on hover */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: "radial-gradient(60% 70% at 50% 55%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)" }}
          />
          <PixelReveal cols={8} rows={6} start="top 92%">
            <div
              data-depth="40"
              className="w-28 h-28 md:w-32 md:h-32 logo-mute group-hover:scale-110"
            >
              <Image src={project.icon} alt={name} width={128} height={128} className="w-full h-full object-contain" />
            </div>
          </PixelReveal>
        </div>
        <div className="flex flex-col flex-1 p-6 md:p-7">
          <h2 className="font-sans text-2xl text-cream mb-3">{name}</h2>
          <p className="font-mono text-sm text-cream/75 leading-relaxed mb-5">{project.catalog.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-wider text-burnt mb-7">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="mt-auto text-cream" data-cursor="view">
            <Button
              href={project.url ?? "#"}
              variant="outline"
              icon={<ArrowUpRight className="w-4 h-4" />}
              magnetic={false}
              className="max-w-none border-burnt! py-4! md:py-4! text-sm"
            >
              {project.action}
            </Button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function CatalogGrid() {
  const [query, setQuery] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);
  const q = query.trim().toLowerCase();
  const visible = projects.filter((p) =>
    [p.name, p.catalog.name ?? "", p.catalog.description, ...p.tags].join(" ").toLowerCase().includes(q)
  );

  // Cards cascade in as the grid scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
          rotate: i % 3 === 0 ? -2 : i % 3 === 2 ? 2 : 0,
          duration: 1.2,
          ease: EASE.out,
          delay: (i % 3) * 0.1,
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });
      gsap.from("[data-search]", { y: 30, autoAlpha: 0, duration: 1.1, ease: EASE.out, delay: 0.2 });
    }, grid.current!.parentElement!);
    return () => ctx.revert();
  }, []);

  // Filtering reflows the grid; cards glide to their new places.
  const onSearch = (v: string) => {
    if (!prefersReducedMotion() && grid.current) flip.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    setQuery(v);
  };
  useLayoutEffect(() => {
    const state = flip.current;
    if (!state || !grid.current) return;
    flip.current = null;
    const tween = Flip.from(state, {
      duration: 0.8,
      ease: EASE.out,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: EASE.out }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4 }),
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [q]);

  return (
    <section data-world="night" className="relative bg-night text-cream px-5 sm:px-8 md:px-16 pt-32 md:pt-36 pb-28 md:pb-40">
      <div className="max-w-6xl mx-auto">
        <label data-search className="flex items-center gap-4 border border-cream/60 corner [--r:0.9rem] px-5 py-3.5 mb-16 md:mb-20 focus-within:border-cream transition-colors">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
            aria-label="Search projects"
            className="flex-1 bg-transparent font-mono text-sm text-cream placeholder:text-cream/50 focus:outline-none"
          />
        </label>

        <div ref={grid} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-16 md:gap-y-14">
          {visible.map((p) => (
            <div key={p.slug} data-card data-flip-id={p.slug} className="h-full">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="font-mono text-sm text-cream/60 text-center py-20">No projects match &ldquo;{query.trim()}&rdquo;.</p>
        )}
      </div>
    </section>
  );
}
