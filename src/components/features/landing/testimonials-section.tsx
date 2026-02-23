"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I started getting interview calls within two weeks after using localCV.",
    name: "Priya S.",
    role: "Frontend Engineer",
  },
  {
    quote:
      "The ATS suggestions are practical and cut my resume editing time in half.",
    name: "Michael R.",
    role: "Product Manager",
  },
  {
    quote:
      "Private, fast, and genuinely useful. localCV made resume tailoring painless.",
    name: "Ananya K.",
    role: "Data Analyst",
  },
  {
    quote:
      "I love that my data stays on my machine. The AI rewriting is a game changer.",
    name: "David L.",
    role: "Software Developer",
  },
  {
    quote:
      "Finally, a resume builder that doesn't lock my data behind a paywall.",
    name: "Sarah J.",
    role: "UX Designer",
  },
];

export function TestimonialsSection() {
  // Duplicate the array to create a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          What users are saying
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of professionals building better resumes.
        </p>
      </div>

      <div className="relative flex w-full overflow-hidden py-4">
        {/* Gradient masks for smooth fade out at edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <Card
              key={`${testimonial.name}-${index}`}
              className="w-[350px] shrink-0 border-border/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/40 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground italic">
                &ldquo;{testimonial.quote}&rdquo;
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
