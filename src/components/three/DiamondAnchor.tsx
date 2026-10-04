"use client";

import { ReactNode, useEffect, useRef } from "react";
import { anchors, AnchorPose } from "./diamond-bus";
import { useStageEnabled } from "@/lib/media";

type DiamondAnchorProps = Partial<AnchorPose> & {
  id: string;
  className?: string;
  /** Rendered instead when the 3D stage is off (reduced motion / no WebGL). */
  fallback?: ReactNode;
};

const DEFAULT_POSE: AnchorPose = {
  explode: 0,
  scale: 1,
  color: "#460E04",
  glow: 0,
  spin: 0,
  tilt: 1,
};

/**
 * Marks a spot in the layout for the floating diamond. The stage reads the
 * element's on-screen box every frame and flies the diamond to it, so the
 * choreography survives any layout or viewport size.
 */
export default function DiamondAnchor({ id, className = "", fallback, ...pose }: DiamondAnchorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useStageEnabled();
  const { explode, scale, color, glow, spin, tilt } = { ...DEFAULT_POSE, ...pose };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const section = (el.closest("[data-world]") as HTMLElement) ?? el;
    anchors.set(id, { el, section, pose: { explode, scale, color, glow, spin, tilt } });
    return () => {
      anchors.delete(id);
    };
  }, [id, explode, scale, color, glow, spin, tilt]);

  return (
    <div ref={ref} aria-hidden className={className} data-diamond-anchor={id}>
      {!enabled && fallback}
    </div>
  );
}
