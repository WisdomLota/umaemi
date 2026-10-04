"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}

// The whole site speaks one motion language: a sharp exponential release for
// things arriving, a softer curve for things settling, and three durations.
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.9,
  slow: 1.4,
} as const;

export { gsap, ScrollTrigger, SplitText };
