"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
  "Paste your experience and role details",
  "Choose a resume template",
  "Get AI-enhanced ATS suggestions",
  "Export job-specific resume in minutes",
];

export function EasyFlowSection() {
  return (
    <section className="border-y border-border/70 bg-muted/20 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(22,163,74,0.15),transparent_50%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4">
            Streamlined Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Build a modern resume in minutes
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Our intuitive flow guides you from a rough draft to an ATS-optimized
            masterpiece without the hassle.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 transition-transform hover:scale-105"
            >
              Create Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 transition-transform hover:scale-105"
            >
              Explore Templates
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-border/70 shadow-2xl bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Resume Build Flow</CardTitle>
              <CardDescription>
                Your journey to a better career starts here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background/80 p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none mb-1.5">
                      {step}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Step {index + 1} of {steps.length}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
