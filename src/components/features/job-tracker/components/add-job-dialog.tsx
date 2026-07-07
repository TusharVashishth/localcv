"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Link as LinkIcon,
  User,
  Mail,
  Share2,
  Eye,
  FilePenLine,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  jobApplicationFormSchema,
  type JobApplicationFormValues,
} from "../schema/job-tracker-schema";
import { STATUS_LABELS } from "../types/job-tracker-types";
import type { JobApplication } from "@/lib/db/schema";
import { MarkdownRenderer } from "./markdown-renderer";

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  editingJob?: JobApplication | null;
  prefilledValues?: Partial<JobApplicationFormValues> | null;
}

function MarkdownPreview({ value }: { value: string }) {
  if (!value.trim()) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-md border border-dashed bg-muted/20 px-4 text-center text-sm text-muted-foreground">
        Markdown preview will appear here as you write notes.
      </div>
    );
  }

  return (
    <MarkdownRenderer
      value={value}
      className="min-h-[220px] rounded-md border bg-background px-4 py-3 text-sm leading-6"
    />
  );
}

export function AddJobDialog({
  open,
  onOpenChange,
  onSave,
  editingJob,
  prefilledValues,
}: AddJobDialogProps) {
  const isEditing = !!editingJob;
  const [notesMode, setNotesMode] = useState<"write" | "preview">("write");

  const defaultDate = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationFormSchema) as unknown as Resolver<JobApplicationFormValues>,
    defaultValues: {
      companyName: "",
      role: "",
      jobUrl: "",
      jobDescription: "",
      status: "saved",
      applicationDate: defaultDate,
      followUpDate: "",
      notes: "",
      salaryMin: undefined,
      salaryMax: undefined,
      currency: "USD",
      recruiterName: "",
      recruiterEmail: "",
      source: "",
    },
  });

  const currentStatus = useWatch({ control, name: "status" });
  const currentCurrency = useWatch({ control, name: "currency" });
  const notesValue = useWatch({ control, name: "notes" });

  useEffect(() => {
    if (open) {
      if (editingJob) {
        reset({
          companyName: editingJob.companyName,
          role: editingJob.role,
          jobUrl: editingJob.jobUrl || "",
          jobDescription: editingJob.jobDescription || "",
          status: editingJob.status,
          applicationDate: editingJob.applicationDate,
          followUpDate: editingJob.followUpDate || "",
          notes: editingJob.notes || "",
          salaryMin: editingJob.salaryMin,
          salaryMax: editingJob.salaryMax,
          currency: editingJob.currency || "USD",
          companyResumeId: editingJob.companyResumeId,
          recruiterName: editingJob.recruiterName || "",
          recruiterEmail: editingJob.recruiterEmail || "",
          source: editingJob.source || "",
        });
      } else if (prefilledValues) {
        reset({
          companyName: prefilledValues.companyName || "",
          role: prefilledValues.role || "",
          jobUrl: prefilledValues.jobUrl || "",
          jobDescription: prefilledValues.jobDescription || "",
          status: prefilledValues.status || "applied",
          applicationDate: prefilledValues.applicationDate || defaultDate,
          followUpDate: prefilledValues.followUpDate || "",
          notes: prefilledValues.notes || "",
          salaryMin: prefilledValues.salaryMin,
          salaryMax: prefilledValues.salaryMax,
          currency: prefilledValues.currency || "USD",
          companyResumeId: prefilledValues.companyResumeId,
          recruiterName: prefilledValues.recruiterName || "",
          recruiterEmail: prefilledValues.recruiterEmail || "",
          source: prefilledValues.source || "",
        });
      } else {
        reset({
          companyName: "",
          role: "",
          jobUrl: "",
          jobDescription: "",
          status: "saved",
          applicationDate: defaultDate,
          followUpDate: "",
          notes: "",
          salaryMin: undefined,
          salaryMax: undefined,
          currency: "USD",
          recruiterName: "",
          recruiterEmail: "",
          source: "",
        });
      }
    }
  }, [open, editingJob, prefilledValues, reset, defaultDate]);

  async function onSubmit(values: JobApplicationFormValues) {
    try {
      await onSave({
        companyName: values.companyName,
        role: values.role,
        jobUrl: values.jobUrl || undefined,
        jobDescription: values.jobDescription || undefined,
        status: values.status,
        applicationDate: values.applicationDate,
        followUpDate: values.followUpDate || undefined,
        notes: values.notes || undefined,
        salaryMin: values.salaryMin,
        salaryMax: values.salaryMax,
        currency: values.currency || undefined,
        companyResumeId: values.companyResumeId || editingJob?.companyResumeId,
        recruiterName: values.recruiterName || undefined,
        recruiterEmail: values.recruiterEmail || undefined,
        source: values.source || undefined,
      });

      toast.success(
        isEditing
          ? "Job application updated successfully."
          : `Job application at ${values.companyName} added.`
      );
      onOpenChange(false);
      reset();
    } catch {
      toast.error("Failed to save job application.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92dvh] max-h-[92dvh] min-h-0 w-full max-w-[95vw] flex-col gap-0 overflow-hidden p-0 md:max-w-[90vw] lg:max-w-[82vw] xl:max-w-[72vw]">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-3 border-b px-6 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle>
                {isEditing ? "Edit Job Application" : "Add Job Application"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the details for this job application."
                  : "Track a new job opportunity in your pipeline."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea className="min-h-0 flex-1 overflow-hidden">
            <div className="flex flex-col gap-6 px-6 py-5">
              <FieldSet>
                <FieldLegend>Opportunity basics</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!errors.companyName}>
                    <FieldLabel htmlFor="companyName">
                      <Building2 className="size-3 text-muted-foreground" />
                      Company Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="companyName"
                      placeholder="e.g. Google, Vercel..."
                      aria-invalid={!!errors.companyName}
                      {...register("companyName")}
                    />
                    <FieldError errors={[errors.companyName]} />
                  </Field>

                  <Field data-invalid={!!errors.role}>
                    <FieldLabel htmlFor="role">
                      <BriefcaseBusiness className="size-3 text-muted-foreground" />
                      Job Title / Role <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="role"
                      placeholder="e.g. Software Engineer..."
                      aria-invalid={!!errors.role}
                      {...register("role")}
                    />
                    <FieldError errors={[errors.role]} />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Pipeline timing</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="status">Pipeline Status</FieldLabel>
                    <Select
                      value={currentStatus}
                      onValueChange={(val) =>
                        setValue("status", val as JobApplicationFormValues["status"])
                      }
                    >
                      <SelectTrigger className="h-9 text-xs w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([status, label]) => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field data-invalid={!!errors.applicationDate}>
                    <FieldLabel htmlFor="applicationDate">
                      <CalendarDays className="size-3 text-muted-foreground" />
                      Apply Date <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="applicationDate"
                      type="date"
                      aria-invalid={!!errors.applicationDate}
                      {...register("applicationDate")}
                    />
                    <FieldError errors={[errors.applicationDate]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="followUpDate">
                      <CalendarDays className="size-3 text-muted-foreground" />
                      Follow-up Date
                    </FieldLabel>
                    <Input
                      id="followUpDate"
                      type="date"
                      {...register("followUpDate")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Source and contact</FieldLegend>
                <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Field data-invalid={!!errors.jobUrl}>
                    <FieldLabel htmlFor="jobUrl">
                      <LinkIcon className="size-3 text-muted-foreground" />
                      Job URL
                    </FieldLabel>
                    <Input
                      id="jobUrl"
                      placeholder="e.g. https://careers.google.com/jobs/..."
                      aria-invalid={!!errors.jobUrl}
                      {...register("jobUrl")}
                    />
                    <FieldError errors={[errors.jobUrl]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="source">
                      <Share2 className="size-3 text-muted-foreground" />
                      Job Source
                    </FieldLabel>
                    <Input
                      id="source"
                      placeholder="e.g. LinkedIn, Referral, Company Page..."
                      {...register("source")}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/20 p-4 md:grid-cols-2 lg:col-span-2">
                    <FieldSet>
                      <FieldLegend className="text-sm">Compensation</FieldLegend>
                      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                        <Field>
                          <FieldLabel htmlFor="currency">Currency</FieldLabel>
                          <Select
                            value={currentCurrency}
                            onValueChange={(val) =>
                              setValue("currency", val as JobApplicationFormValues["currency"])
                            }
                          >
                            <SelectTrigger className="h-8 text-[11px] w-full">
                              <SelectValue placeholder="USD" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD" className="text-xs">USD ($)</SelectItem>
                              <SelectItem value="EUR" className="text-xs">EUR (€)</SelectItem>
                              <SelectItem value="GBP" className="text-xs">GBP (£)</SelectItem>
                              <SelectItem value="INR" className="text-xs">INR (₹)</SelectItem>
                              <SelectItem value="CAD" className="text-xs">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field data-invalid={!!errors.salaryMax}>
                          <FieldLabel>Min / Max Range</FieldLabel>
                          <div className="flex items-center gap-2">
                            <Input
                              id="salaryMin"
                              type="number"
                              placeholder="Min"
                              {...register("salaryMin")}
                            />
                            <span className="text-muted-foreground text-xs">—</span>
                            <Input
                              id="salaryMax"
                              type="number"
                              placeholder="Max"
                              aria-invalid={!!errors.salaryMax}
                              {...register("salaryMax")}
                            />
                          </div>
                          <FieldError errors={[errors.salaryMax]} />
                        </Field>
                      </FieldGroup>
                    </FieldSet>

                    <FieldSet>
                      <FieldLegend className="text-sm">Recruiter details</FieldLegend>
                      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="recruiterName">
                            <User className="size-2.5 text-muted-foreground" />
                            Recruiter Name
                          </FieldLabel>
                          <Input
                            id="recruiterName"
                            placeholder="e.g. Jane Doe"
                            {...register("recruiterName")}
                          />
                        </Field>
                        <Field data-invalid={!!errors.recruiterEmail}>
                          <FieldLabel htmlFor="recruiterEmail">
                            <Mail className="size-2.5 text-muted-foreground" />
                            Recruiter Email
                          </FieldLabel>
                          <Input
                            id="recruiterEmail"
                            placeholder="jane@company.com"
                            aria-invalid={!!errors.recruiterEmail}
                            {...register("recruiterEmail")}
                          />
                          <FieldError errors={[errors.recruiterEmail]} />
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </div>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Job description</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="jobDescription">Role details and requirements</FieldLabel>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste job description or requirements here..."
                      className="min-h-[220px] resize-y"
                      {...register("jobDescription")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Personal notes</FieldLegend>
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      Use markdown for prep tasks, interview takeaways, and follow-up reminders.
                    </p>
                  </div>
                  <div className="flex w-full rounded-md border bg-muted/30 p-1 md:w-fit">
                    <Button
                      type="button"
                      variant={notesMode === "write" ? "secondary" : "ghost"}
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => setNotesMode("write")}
                    >
                      <FilePenLine data-icon="inline-start" />
                      Write
                    </Button>
                    <Button
                      type="button"
                      variant={notesMode === "preview" ? "secondary" : "ghost"}
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => setNotesMode("preview")}
                    >
                      <Eye data-icon="inline-start" />
                      Preview
                    </Button>
                  </div>
                </div>
                <FieldGroup>
                  <Field>
                    {notesMode === "write" ? (
                      <Textarea
                        id="notes"
                        placeholder={"## Interview notes\n- Recruiter screen scheduled for Friday\n- Ask about remote policy\n\n**Next step:** send thank-you note"}
                        className="min-h-[220px] resize-y font-mono text-sm"
                        {...register("notes")}
                      />
                    ) : (
                      <MarkdownPreview value={notesValue || ""} />
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </ScrollArea>

          <Separator />
          <DialogFooter className="mx-0 mb-0 shrink-0 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Application"
                  : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
