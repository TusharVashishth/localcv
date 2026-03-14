"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileStack, Github } from "lucide-react";
import Link from "next/link";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextHighlighter } from "@/components/ui/text-highlighter";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom,rgba(22,163,74,0.2),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.08)_1px,transparent_1px)] dark:opacity-60 dark:bg-[linear-gradient(rgba(74,222,128,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.16)_1px,transparent_1px)]"
        style={{
          backgroundSize: "28px 28px",
        }}
      />
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
            Open source, privacy-first resume builder
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build ATS-Ready Resumes With{" "}
          <SparklesText className="text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Local CV
          </SparklesText>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl text-base text-muted-foreground sm:text-lg"
        >
          The open source way to craft a standout resume{" "}
          <TextHighlighter color="yellow" animated={false}>
            completely free
          </TextHighlighter>
          , with{" "}
          <TextHighlighter color="blue" animated={false}>
            no signup and no paywall
          </TextHighlighter>
          . Your data stays on your device while you build with{" "}
          <TextHighlighter color="green" animated={false}>
            ATS-ready templates
          </TextHighlighter>{" "}
          and AI-powered refinements that help every application hit harder.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
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
          <Link
            href="https://github.com/TusharVashishth/localcv"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-xl px-8 text-base font-semibold transition-transform hover:scale-105",
            )}
          >
            <Github className="size-4" />
            Check Out The Repo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
