"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  borderWidth?: number;
}

/**
 * Animated border beam.
 * A small gradient element travels around the container's border using CSS offset-path.
 * The outer wrapper uses mask-composite: exclude to show ONLY the border ring.
 */
export const BorderBeam = ({
  size = 120,
  duration = 5,
  colorFrom = "#a855f7",
  colorTo = "#6366f1",
  className,
  borderWidth = 1.5,
}: BorderBeamProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
      style={{
        /* Creates a `borderWidth`-px ring: content-box mask (hole) XOR border-box mask (fill) */
        padding: borderWidth,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
      }}
    >
      {/* Small gradient pill that travels along the perimeter */}
      <motion.div
        className="absolute aspect-square"
        style={
          {
            width: size,
            background: `linear-gradient(to left, transparent, ${colorFrom}, ${colorTo})`,
            offsetPath: "rect(0 auto auto 0 round 16px)",
          } as React.CSSProperties
        }
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
