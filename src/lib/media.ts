"use client";

import { useSyncExternalStore } from "react";

const subscribers = new Map<string, (cb: () => void) => () => void>();

function subscribeQuery(query: string) {
  let sub = subscribers.get(query);
  if (!sub) {
    sub = (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    };
    subscribers.set(query, sub);
  }
  return sub;
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION);
export const useFinePointer = () => useMediaQuery(FINE_POINTER);

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

let webgl: boolean | null = null;
function hasWebGL() {
  if (webgl === null) {
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

const noop = () => () => {};

// The 3D stage only runs when the device can render it and the visitor
// hasn't asked for less motion. Everything else falls back to static SVG.
export function useStageEnabled() {
  const reduced = useReducedMotion();
  const gl = useSyncExternalStore(noop, hasWebGL, () => false);
  return gl && !reduced;
}
