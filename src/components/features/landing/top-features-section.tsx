"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "Local-first privacy",
    description:
      "Your resume data stays on your machine with IndexedDB-powered storage.",
  },
  {
    title: "ATS optimization",
    description:
      "Match job descriptions quickly with focused keyword and structure suggestions.",
  },
  {
    title: "AI rewriting",
    description:
      "Convert raw experience into impact-driven bullet points in seconds.",
  },
  {
    title: "Section templates",
    description:
      "Choose role-based templates for faster, consistent resume writing.",
  },
  {
    title: "Live preview",
    description:
      "Instantly review every change before exporting your final version.",
  },
  {
    title: "Export variants",
    description:
      "Generate role-specific versions of your resume with minimal effort.",
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TopFeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10"
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
        viewport={{ once: true }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="h-full border-border/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
