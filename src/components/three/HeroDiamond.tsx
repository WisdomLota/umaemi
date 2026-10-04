import { DIAMOND_PIECES, DIAMOND_VIEWBOX } from "./diamond-paths";

/**
 * Flat SVG version of the diamond — used wherever the 3D stage is off
 * (reduced motion, no WebGL). Hovering opens the four pieces slightly.
 */
export default function HeroDiamond({ color = "#460E04", className = "" }: { color?: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${DIAMOND_VIEWBOX.width} ${DIAMOND_VIEWBOX.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`group/diamond w-full h-full overflow-visible ${className}`}
      aria-hidden
    >
      {DIAMOND_PIECES.map((p) => (
        <path
          key={p.id}
          d={p.d}
          fill={color}
          className="transition-transform duration-700 ease-out-expo group-hover/diamond:[transform:translate(var(--dx),var(--dy))]"
          style={{ ["--dx" as string]: `${p.dir[0] * 14}px`, ["--dy" as string]: `${-p.dir[1] * 14}px` }}
        />
      ))}
    </svg>
  );
}
