"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Sparkles,
  LayoutTemplate,
  Eye,
  Copy,
} from "lucide-react";

const features = [
  {
    title: "Local-first privacy",
    description:
      "Your resume data stays on your machine with IndexedDB-powered storage.",
    icon: Shield,
    delay: 0,
  },
  {
    title: "ATS optimization",
    description:
      "Match job descriptions quickly with focused keyword and structure suggestions.",
    icon: Search,
    delay: 0.1,
  },
  {
    title: "AI rewriting",
    description:
      "Convert raw experience into impact-driven bullet points in seconds.",
    icon: Sparkles,
    delay: 0.2,
  },
  {
    title: "Section templates",
    description:
      "Choose role-based templates for faster, consistent resume writing.",
    icon: LayoutTemplate,
    delay: 0.3,
  },
  {
    title: "Live preview",
    description:
      "Instantly review every change before exporting your final version.",
    icon: Eye,
    delay: 0.4,
  },
  {
    title: "Export variants",
    description:
      "Generate role-specific versions of your resume with minimal effort.",
    icon: Copy,
    delay: 0.5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 12 },
  },
};

export function TopFeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Top Features
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything you need to build better resumes faster, while keeping full
          data ownership.
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <motion.div
                    variants={iconVariants}
                    className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20"
                  >
                    <Icon className="size-6" />
                  </motion.div>
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-sm text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
