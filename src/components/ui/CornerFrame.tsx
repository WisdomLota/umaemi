"use client";

import { useEffect, useRef, useState } from "react";

type CornerFrameProps = {
  /** Which diagonal gets the rounded corners. */
  corners?: "tl-br" | "tr-bl";
  radius?: number;
  inset?: number;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
  /** Dashes travel around the frame. */
  march?: boolean;
  className?: string;
};

function framePath(w: number, h: number, r: number, i: number, corners: "tl-br" | "tr-bl") {
  const x0 = i, y0 = i, x1 = w - i, y1 = h - i;
  if (corners === "tl-br") {
    return `M${x0 + r},${y0} H${x1} V${y1 - r} Q${x1},${y1} ${x1 - r},${y1} H${x0} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`;
  }
  return `M${x0},${y0} H${x1 - r} Q${x1},${y0} ${x1},${y0 + r} V${y1} H${x0 + r} Q${x0},${y1} ${x0},${y1 - r} Z`;
}

/** An SVG outline in the brand's asymmetric corner shape that fits its parent. */
export default function CornerFrame({
  corners = "tl-br",
  radius = 16,
  inset = 1,
  stroke = "currentColor",
  strokeWidth = 2,
  dashed = false,
  march = false,
  className = "",
}: CornerFrameProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      width={size.w}
      height={size.h}
    >
      {size.w > 0 && (
        <path
          d={framePath(size.w, size.h, radius, inset, corners)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashed ? "10 10" : undefined}
          style={march ? { animation: "march 1.2s linear infinite" } : undefined}
        />
      )}
    </svg>
  );
}
