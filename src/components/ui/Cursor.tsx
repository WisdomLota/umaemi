"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/media";
import ArrowUpRight from "./ArrowUpRight";

type Mode = "idle" | "hover" | "view" | "text";

/**
 * A dot that tracks the pointer exactly and a ring that follows with mass.
 * Over anything interactive the ring morphs into the brand corner shape.
 */
function CursorInner() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = dot.current!;
    const r = ring.current!;
    const ic = icon.current!;
    document.documentElement.classList.add("has-cursor");

    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let mode: Mode = "idle";
    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      const shapes: Record<Mode, gsap.TweenVars> = {
        idle: { width: 36, height: 36, borderRadius: "18px 18px 18px 18px", backgroundColor: "rgba(229,65,0,0)", borderWidth: 1.5 },
        hover: { width: 64, height: 64, borderRadius: "22px 0px 22px 0px", backgroundColor: "rgba(229,65,0,0.14)", borderWidth: 1.5 },
        view: { width: 92, height: 92, borderRadius: "30px 0px 30px 0px", backgroundColor: "rgba(229,65,0,0.92)", borderWidth: 0 },
        text: { width: 4, height: 34, borderRadius: "2px 2px 2px 2px", backgroundColor: "rgba(229,65,0,0.9)", borderWidth: 0 },
      };
      gsap.to(r, { ...shapes[next], duration: 0.5, ease: "expo.out", overwrite: "auto" });
      gsap.to(d, { scale: next === "idle" ? 1 : 0, duration: 0.3, ease: "power3.out" });
      gsap.to(ic, { scale: next === "view" ? 1 : 0, rotate: next === "view" ? 0 : -45, duration: 0.5, ease: "expo.out" });
    };

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = e.target as HTMLElement | null;
      const explicit = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor as Mode | undefined;
      if (explicit) setMode(explicit);
      else if (t?.closest("input, textarea")) setMode("text");
      else if (t?.closest("a, button, [role='tab']")) setMode("hover");
      else setMode("idle");
    };
    const down = () => gsap.to(r, { scale: 0.82, duration: 0.2, ease: "power3.out" });
    const up = () => gsap.to(r, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center border-solid"
        style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: "var(--world-accent)" }}
      >
        <div ref={icon} className="text-cream scale-0">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 w-1.5 h-1.5 rounded-full"
        style={{ background: "var(--world-accent)" }}
      />
    </div>
  );
}

export default function Cursor() {
  const fine = useFinePointer();
  return fine ? <CursorInner /> : null;
}
