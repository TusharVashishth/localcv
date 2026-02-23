"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.28),transparent_60%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 md:px-10 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl space-y-6"
        >
          <Badge variant="outline" className="bg-background/80 px-3 py-1">
            Local-first AI Resume Builder
          </Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Build and tailor your resume with localCV.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Craft polished resumes, optimize them for ATS, and keep your data
            private on your own device.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="transition-transform hover:scale-105">
              Start Building
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform hover:scale-105"
            >
              Watch ATS Flow
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <Card className="border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-primary">
                AI Resume Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "ATS compatibility", value: "92%", width: "92%" },
                { label: "Keyword match", value: "88%", width: "88%" },
                { label: "Clarity impact", value: "95%", width: "95%" },
              ].map((item, index) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: item.width }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
