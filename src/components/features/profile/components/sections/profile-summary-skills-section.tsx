import type { FieldErrors } from "react-hook-form";
import { Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";
import { ProfileSkillSelector } from "../profile-skill-selector";

function errorText(message?: unknown) {
  return typeof message === "string" ? message : undefined;
}

export function ProfileSummarySkillsSection({
  formValues,
  setRootField,
  errors,
  onEnhanceSummary,
  isEnhancingSummary,
  canUseAI,
}: {
  formValues: ProfileFormValues;
  setRootField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => void;
  errors: FieldErrors<ProfileFormValues>;
  onEnhanceSummary: () => void;
  isEnhancingSummary: boolean;
  canUseAI: boolean;
}) {
  const summaryError = errorText(errors.summary?.message);
  const skillsError = errorText(errors.skills?.message);

  return (
    <div className="space-y-6">
      <div>
        <ProfileSectionHeader
          title="Professional Summary"
          description="A 2-4 sentence overview of your profile."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEnhanceSummary}
              disabled={isEnhancingSummary || !canUseAI}
              className="gap-1.5"
            >
              {isEnhancingSummary ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Bot className="size-3.5" />
                  Enhance with AI
                </>
              )}
            </Button>
          }
        />
        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            rows={5}
            value={formValues.summary}
            onChange={(event) => setRootField("summary", event.target.value)}
            placeholder="Results-driven software engineer with 5+ years building scalable web applications..."
            aria-invalid={!!summaryError}
          />
          {summaryError && (
            <p className="text-xs text-destructive">{summaryError}</p>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formValues.summary.length} characters
        </p>
      </div>

      <Separator />

      <div>
        <ProfileSectionHeader
          title="Skills"
          description={`${formValues.skills.length} skill${formValues.skills.length !== 1 ? "s" : ""} selected — click to add or remove.`}
        />
        <ProfileSkillSelector
          selected={formValues.skills}
          onChange={(skills) => setRootField("skills", skills)}
          errorMessage={skillsError}
        />
      </div>
    </div>
  );
}
