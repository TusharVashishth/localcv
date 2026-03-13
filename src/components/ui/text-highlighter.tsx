"use client";

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react";
import { cn } from "@/lib/utils";

export interface TextHighlighterProps extends Omit<
  ComponentPropsWithoutRef<"mark">,
  "children"
> {
  children: string;
  color?: string;
  animated?: boolean;
}

export const TextHighlighter: FC<TextHighlighterProps> = ({
  children,
  color = "yellow",
  animated = true,
  className,
  ...props
}: TextHighlighterProps) => {
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-200/40 dark:bg-yellow-500/40",
    blue: "bg-blue-200/40 dark:bg-blue-500/40",
    green: "bg-green-200/40 dark:bg-green-500/40",
    pink: "bg-pink-200/40 dark:bg-pink-500/40",
    purple: "bg-purple-200/40 dark:bg-purple-500/40",
  };

  const animationClass = animated ? "animate-pulse" : "";

  return (
    <mark
      className={cn(
        "relative inline-block rounded-sm px-1 py-0.5 font-semibold text-inherit no-underline",
        colorMap[color] || colorMap.yellow,
        animationClass,
        className,
      )}
      style={
        {
          "--highlight-color": color,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </mark>
  );
};
