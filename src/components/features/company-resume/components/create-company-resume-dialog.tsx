"use client";

/* ****** Dialog to create a new company-specific resume via AI ****** */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  FileText,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  createCompanyResumeSchema,
  type CreateCompanyResumeFormValues,
} from "../schema/company-resume-schema";
import { useCompanyResumes } from "../hooks/use-company-resumes";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

/* ****** Generation step definitions ****** */
const GENERATION_STEPS = [
  { Icon: Search, label: "Analyzing job description" },
  { Icon: Target, label: "Matching your skills & experience" },
  { Icon: FileText, label: "Crafting tailored content" },
  { Icon: Sparkles, label: "Finalizing your resume" },
] as const;

interface CreateCompanyResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: number) => void;
}

export function CreateCompanyResumeDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateCompanyResumeDialogProps) {
  const { profile, isProfileCompleted } = useProfile();
  const { config, hasApiKey, getDecryptedApiKey } = useAIConfig();
  const { saveCompanyResume } = useCompanyResumes();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyResumeFormValues>({
    resolver: zodResolver(createCompanyResumeSchema),
    defaultValues: { companyName: "", jobDescription: "" },
  });

  const canGenerate = isProfileCompleted && hasApiKey;

  async function onSubmit(values: CreateCompanyResumeFormValues) {
    if (!profile) {
      toast.error("Please complete your profile first.");
      return;
    }

    try {
      setIsGenerating(true);

      const apiKey = await getDecryptedApiKey();
      if (!apiKey) {
        toast.error(
          "Could not retrieve AI key. Please reconfigure it in the dashboard.",
        );
        return;
      }

      const response = await fetch("/api/resume/generate-company-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: values.companyName,
          jobDescription: values.jobDescription,
          profileData: {
            profile: profile.profile,
            summary: profile.summary,
            experience: profile.experience,
            education: profile.education,
            skills: profile.skills,
            projects: profile.projects,
            certifications: profile.certifications,
            languages: profile.languages,
          },
          config: {
            provider: config?.provider ?? "",
            modelName: config?.modelName ?? "",
            apiKey,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(
          data.error ?? "Failed to generate resume. Please try again.",
        );
        return;
      }

      const tailored = data.resume;

      const newId = await saveCompanyResume({
        companyName: values.companyName,
        jobDescription: values.jobDescription,
        profile: profile.profile,
        summary: tailored.summary,
        experience: tailored.experience,
        education: tailored.education,
        skills: tailored.skills,
        projects: tailored.projects,
        certifications: tailored.certifications,
        languages: tailored.languages,
      });

      toast.success(`Resume tailored for ${values.companyName} created!`);
      reset();
      onOpenChange(false);
      onCreated?.(newId);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-lg bg-green-500/10 text-green-600">
              <BriefcaseBusiness className="size-4" />
            </div>
            <div>
              <DialogTitle>Create Company Resume</DialogTitle>
              <DialogDescription>
                Paste the job description and our AI will tailor your resume to
                match.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ****** Animated content area — form ↔ loading state ****** */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            /* ****** AI Generation Loading State ****** */
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="py-6 flex flex-col items-center gap-7"
            >
              {/* Orbiting circles visual */}
              <div className="relative flex items-center justify-center size-36">
                {/* Outer orbit */}
                <OrbitingCircles radius={58} duration={9} iconSize={30}>
                  <FileText className="size-4 text-blue-500" />
                  <Target className="size-4 text-emerald-500" />
                  <Sparkles className="size-4 text-violet-500" />
                  <Search className="size-4 text-pink-500" />
                </OrbitingCircles>

                {/* Inner orbit (reverse) */}
                <OrbitingCircles
                  radius={30}
                  duration={5}
                  reverse
                  iconSize={22}
                  path={false}
                >
                  <Zap className="size-3 text-amber-400" />
                  <Sparkles className="size-3 text-cyan-400" />
                </OrbitingCircles>

                {/* Center pulsing icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.07, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(139,92,246,0.3)",
                      "0 0 20px 6px rgba(139,92,246,0.25)",
                      "0 0 0 0 rgba(139,92,246,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute z-10 flex items-center justify-center size-14 rounded-2xl bg-linear-to-br from-violet-500 to-pink-500 text-white shadow-lg"
                >
                  <BriefcaseBusiness className="size-6" />
                </motion.div>
              </div>

              {/* Title & subtitle */}
              <div className="text-center space-y-1">
                <p className="font-semibold text-base">
                  Tailoring your resume…
                </p>
                <p className="text-xs text-muted-foreground">
                  AI is crafting your personalised resume — this may take
                  15–30 seconds
                </p>
              </div>

              {/* Animated generation steps */}
              <div className="w-full max-w-xs space-y-3">
                {GENERATION_STEPS.map(({ Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.55,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-3"
                  >
                    {/* Step icon badge */}
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

                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>

                    {/* Pulsing dot on the last step */}
                    {i === GENERATION_STEPS.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          delay: (GENERATION_STEPS.length - 1) * 0.55 + 0.6,
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
          ) : (
            /* ****** Normal form state ****** */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {!isProfileCompleted && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Please complete your profile before creating a company
                    resume.
                  </AlertDescription>
                </Alert>
              )}

              {isProfileCompleted && !hasApiKey && (
                <Alert>
                  <AlertDescription>
                    No AI key configured. Add an API key from the dashboard to
                    enable AI tailoring.
                  </AlertDescription>
                </Alert>
              )}

              <ScrollArea className="max-h-[55vh] px-1">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 p-1"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g. Google, Stripe, Vercel…"
                      {...register("companyName")}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the full job description here…"
                      className="min-h-48 max-h-64 resize-none"
                      {...register("jobDescription")}
                    />
                    {errors.jobDescription && (
                      <p className="text-xs text-destructive">
                        {errors.jobDescription.message}
                      </p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!canGenerate}
                      className="gap-2"
                    >
                      Generate Resume
                    </Button>
                  </DialogFooter>
                </form>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
