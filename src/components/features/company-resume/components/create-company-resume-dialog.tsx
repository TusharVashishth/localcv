"use client";

/* ****** Dialog to create a new company-specific resume via AI ****** */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, BriefcaseBusiness } from "lucide-react";
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
import {
  createCompanyResumeSchema,
  type CreateCompanyResumeFormValues,
} from "../schema/company-resume-schema";
import { useCompanyResumes } from "../hooks/use-company-resumes";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl"
        // onOutsidePointerDown={(e:any) => e.preventDefault()}
      >
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

        {!isProfileCompleted && (
          <Alert variant="destructive">
            <AlertDescription>
              Please complete your profile before creating a company resume.
            </AlertDescription>
          </Alert>
        )}

        {isProfileCompleted && !hasApiKey && (
          <Alert>
            <AlertDescription>
              No AI key configured. Add an API key from the dashboard to enable
              AI tailoring.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="max-h-[70vh] px-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Google, Stripe, Vercel…"
                disabled={isGenerating}
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
                className="min-h-52 resize-y"
                disabled={isGenerating}
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
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canGenerate || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Tailoring Resume…
                  </>
                ) : (
                  "Generate Resume"
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
