"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileStack } from "lucide-react";
import Link from "next/link";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextHighlighter } from "@/components/ui/text-highlighter";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom,rgba(22,163,74,0.2),transparent_60%)]" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 pb-24 pt-28 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-muted/80 dark:bg-muted/60"
          >
            <FileStack className="h-3.5 w-3.5" />
            Your privacy-first resume builder
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build ATS-Ready Resume With{" "}
          <SparklesText className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Local CV
          </SparklesText>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl text-base text-muted-foreground sm:text-lg"
        >
          Craft your perfect resume{" "}
          <TextHighlighter color="yellow" animated={false}>
            completely free
          </TextHighlighter>
          , with{" "}
          <TextHighlighter color="blue" animated={false}>
            no signup or credit card required
          </TextHighlighter>
          . Your data stays on your device, and choose from{" "}
          <TextHighlighter color="green" animated={false}>
            optimized templates
          </TextHighlighter>{" "}
          tailored for ATS success.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-xl px-8 text-base font-semibold transition-transform hover:scale-105",
            )}
          >
            Build Your Resume
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
