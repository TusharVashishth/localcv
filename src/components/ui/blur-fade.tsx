"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  blur?: string;
}

/**
 * Blur-fade entrance animation. Fades in + un-blurs content on mount (or on scroll into view).
 */
export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  offset = 10,
  direction = "up",
  inView = false,
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: "-50px" });
  const isVisible = !inView || inViewResult;

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? -1 : 1;

  const variants: Variants = {
    hidden: {
      [axis]: sign * offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
