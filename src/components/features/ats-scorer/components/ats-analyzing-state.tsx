"use client";

import { motion } from "framer-motion";
import { FileSearch, Target, Sparkles, BarChart2, Zap } from "lucide-react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const ANALYSIS_STEPS = [
    { Icon: FileSearch, label: "Reading job description" },
    { Icon: Target, label: "Matching keywords & skills" },
    { Icon: BarChart2, label: "Scoring each section" },
    { Icon: Sparkles, label: "Generating detailed feedback" },
] as const;

export function ATSAnalyzingState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="py-10 flex flex-col items-center gap-8"
        >
            {/* Orbiting circles visual */}
            <div className="relative flex items-center justify-center size-40">
                <OrbitingCircles radius={62} duration={10} iconSize={30}>
                    <FileSearch className="size-4 text-blue-500" />
                    <Target className="size-4 text-emerald-500" />
                    <BarChart2 className="size-4 text-violet-500" />
                    <Sparkles className="size-4 text-pink-500" />
                </OrbitingCircles>

                <OrbitingCircles radius={33} duration={6} reverse iconSize={22} path={false}>
                    <Zap className="size-3 text-amber-400" />
                    <Sparkles className="size-3 text-cyan-400" />
                </OrbitingCircles>

                {/* Center */}
                <motion.div
                    animate={{
                        scale: [1, 1.07, 1],
                        boxShadow: [
                            "0 0 0 0 rgba(16,185,129,0.3)",
                            "0 0 20px 6px rgba(16,185,129,0.25)",
                            "0 0 0 0 rgba(16,185,129,0.3)",
                        ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-10 flex items-center justify-center size-14 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg"
                >
                    <Target className="size-6" />
                </motion.div>
            </div>

            <div className="text-center space-y-1">
                <p className="font-semibold text-base">Analyzing your resume…</p>
                <p className="text-xs text-muted-foreground">
                    AI is scoring your profile against the job description — this may take 15–30 seconds
                </p>
            </div>

            <div className="w-full max-w-xs space-y-3">
                {ANALYSIS_STEPS.map(({ Icon, label }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.55, duration: 0.35, ease: "easeOut" }}
                        className="flex items-center gap-3"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: i * 0.55 + 0.2,
                                type: "spring",
                                stiffness: 320,
                                damping: 22,
                            }}
                            className="flex items-center justify-center size-7 rounded-lg bg-muted/70 text-muted-foreground shrink-0"
                        >
                            <Icon className="size-3.5" />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">{label}</span>
                        {i === ANALYSIS_STEPS.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                    delay: (ANALYSIS_STEPS.length - 1) * 0.55 + 0.6,
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="ml-auto size-2 rounded-full bg-primary"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
