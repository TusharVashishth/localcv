"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Award,
  Bot,
  Briefcase,
  ChevronRight,
  FileText,
  FolderOpen,
  GraduationCap,
  Loader2,
  UploadCloud,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProfile } from "../hooks/use-profile";
import {
  defaultProfileFormValues,
  profileSchema,
  type ProfileFormValues,
} from "../schema/profile-schema";
import { ProfileBasicInfoSection } from "./sections/profile-basic-info-section";
import { ProfileEducationSection } from "./sections/profile-education-section";
import { ProfileExperienceSection } from "./sections/profile-experience-section";
import { ProfileExtraSection } from "./sections/profile-extra-section";
import { ProfileProjectsSection } from "./sections/profile-projects-section";
import { ProfileSummarySkillsSection } from "./sections/profile-summary-skills-section";

const TABS = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "summary", label: "Summary & Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "extra", label: "Certifications & Languages", icon: Award },
] as const;

type TabId = (typeof TABS)[number]["id"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProfileForm() {
  const { profile, saveProfile } = useProfile();
  const { config, getDecryptedApiKey } = useAIConfig();
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isParsing, setIsParsing] = useState(false);
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false);
  const [isExperienceGenerating, setIsExperienceGenerating] = useState(false);
  const [isProjectsGenerating, setIsProjectsGenerating] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedProfile = useRef(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as never,
    defaultValues: defaultProfileFormValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const formValues = form.watch();
  const errors = form.formState.errors;
  const canUseProfileAI = !!config?.provider && !!config?.modelName;

  useEffect(() => {
    if (!profile || hasLoadedProfile.current) return;
    hasLoadedProfile.current = true;
    form.reset({
      profile: {
        ...profile.profile,
        website: profile.profile.website ?? "",
        linkedin: profile.profile.linkedin ?? "",
        github: profile.profile.github ?? "",
      },
      summary: profile.summary,
      experience: profile.experience.map((item) => ({
        ...item,
        location: item.location ?? "",
        description: item.description ?? "",
      })),
      education: profile.education,
      skills: profile.skills,
      projects: profile.projects.map((item) => ({
        ...item,
        link: item.link ?? "",
      })),
      certifications: profile.certifications.map((item) => ({
        ...item,
        credentialId: item.credentialId ?? "",
      })),
      languages: profile.languages,
    });
  }, [form, profile]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF size should be under 5MB.");
      return;
    }
    setUploadFile(file);
    toast.success(`"${file.name}" selected.`);
  }

  async function handleParseWithoutAI() {
    if (!uploadFile) {
      toast.error("Upload a PDF first.");
      return;
    }
    try {
      setIsParsing(true);
      const fileDataUrl = await fileToDataUrl(uploadFile);
      const response = await fetch("/api/profile/parse-cv-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: uploadFile.name, fileDataUrl }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to extract text from CV.");
        return;
      }

      const prev = form.getValues();
      const extracted = data.extracted;
      form.reset({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: extracted.profile.fullName || prev.profile.fullName,
          email: extracted.profile.email || prev.profile.email,
          phone: extracted.profile.phone || prev.profile.phone,
          location: extracted.profile.location || prev.profile.location,
          linkedin: extracted.profile.linkedin ?? prev.profile.linkedin,
          github: extracted.profile.github ?? prev.profile.github,
          website: extracted.profile.website ?? prev.profile.website,
        },
        summary: extracted.summary || prev.summary,
        skills: extracted.skills.length > 0 ? extracted.skills : prev.skills,
        experience:
          extracted.experience.length > 0
            ? extracted.experience
            : prev.experience,
        education:
          extracted.education.length > 0 ? extracted.education : prev.education,
        projects:
          extracted.projects.length > 0 ? extracted.projects : prev.projects,
        certifications:
          extracted.certifications.length > 0
            ? extracted.certifications
            : prev.certifications,
        languages:
          extracted.languages.length > 0 ? extracted.languages : prev.languages,
      });

      toast.success("CV text extracted. Review and correct the fields.");
    } catch {
      toast.error("Unable to extract CV. Please try again.");
    } finally {
      setIsParsing(false);
    }
  }

  async function handleParseWithAI() {
    if (!uploadFile) {
      toast.error("Upload a PDF first.");
      return;
    }
    if (!config?.provider || !config?.modelName) {
      toast.error("Configure AI provider and model first.");
      return;
    }

    try {
      setIsParsing(true);
      const apiKey = await getDecryptedApiKey();
      if (!apiKey) {
        toast.error("API key not found. Configure it from the dashboard.");
        return;
      }

      const fileDataUrl = await fileToDataUrl(uploadFile);
      const response = await fetch("/api/profile/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: config.provider,
          modelName: config.modelName,
          apiKey,
          fileName: uploadFile.name,
          fileDataUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to parse CV with AI.");
        return;
      }

      form.reset(data.profile as ProfileFormValues);
      toast.success("CV parsed with AI and profile autofilled.");
    } catch {
      toast.error("Unable to parse CV. Please try again.");
    } finally {
      setIsParsing(false);
    }
  }

  async function getAIConfigForRequest() {
    if (!config?.provider || !config?.modelName) {
      throw new Error("AI configuration not found in aiConfig table.");
    }

    const apiKey = await getDecryptedApiKey();
    if (!apiKey) {
      throw new Error("API key not found. Configure it from the dashboard.");
    }

    return {
      provider: config.provider,
      modelName: config.modelName,
      apiKey,
    };
  }

  async function handleEnhanceSummary() {
    if (!formValues.summary.trim()) {
      toast.error("Add a summary first before enhancing with AI.");
      return;
    }

    try {
      setIsSummaryGenerating(true);
      const runtimeConfig = await getAIConfigForRequest();
      const response = await fetch("/api/profile/refine-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "summary",
          config: runtimeConfig,
          summary: formValues.summary,
          skills: formValues.skills,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to enhance summary.");
        return;
      }

      setRootField("summary", data.refined.summary ?? formValues.summary);
      toast.success("Summary enhanced with AI.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to enhance summary.",
      );
    } finally {
      setIsSummaryGenerating(false);
    }
  }

  async function handleRefineExperienceSection() {
    if (formValues.experience.length === 0) {
      toast.error("Add at least one experience entry first.");
      return;
    }

    try {
      setIsExperienceGenerating(true);
      const runtimeConfig = await getAIConfigForRequest();
      const response = await fetch("/api/profile/refine-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "experience",
          config: runtimeConfig,
          experience: formValues.experience,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to refine experience.");
        return;
      }

      form.setValue(
        "experience",
        data.refined.experience ?? formValues.experience,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );
      toast.success("Experience section refined with AI.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to refine experience.",
      );
    } finally {
      setIsExperienceGenerating(false);
    }
  }

  async function handleRefineProjectsSection() {
    if (formValues.projects.length === 0) {
      toast.error("Add at least one project first.");
      return;
    }

    try {
      setIsProjectsGenerating(true);
      const runtimeConfig = await getAIConfigForRequest();
      const response = await fetch("/api/profile/refine-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "projects",
          config: runtimeConfig,
          projects: formValues.projects,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to refine projects.");
        return;
      }

      form.setValue("projects", data.refined.projects ?? formValues.projects, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      toast.success("Projects section refined with AI.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to refine projects.",
      );
    } finally {
      setIsProjectsGenerating(false);
    }
  }

  function setRootField<K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) {
    form.setValue(key as never, value as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function setProfileField<K extends keyof ProfileFormValues["profile"]>(
    key: K,
    value: ProfileFormValues["profile"][K],
  ) {
    form.setValue(`profile.${key}` as never, value as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function addExperience() {
    const current = form.getValues("experience");
    form.setValue(
      "experience",
      [
        ...current,
        {
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [],
        },
      ],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function removeExperience(index: number) {
    const current = form.getValues("experience");
    form.setValue(
      "experience",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function updateExperience(index: number, key: string, value: string) {
    const current = form.getValues("experience");
    const next = [...current];
    next[index] = {
      ...next[index],
      [key]: key === "achievements" ? value.split("\n").filter(Boolean) : value,
    };
    form.setValue("experience", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function addEducation() {
    const current = form.getValues("education");
    form.setValue(
      "education",
      [
        ...current,
        { institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function removeEducation(index: number) {
    const current = form.getValues("education");
    form.setValue(
      "education",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function updateEducation(index: number, key: string, value: string) {
    const current = form.getValues("education");
    const next = [...current];
    next[index] = { ...next[index], [key]: value };
    form.setValue("education", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function addProject() {
    const current = form.getValues("projects");
    form.setValue(
      "projects",
      [
        ...current,
        {
          name: "",
          description: "",
          highlights: [],
          technologies: [],
          link: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function removeProject(index: number) {
    const current = form.getValues("projects");
    form.setValue(
      "projects",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function updateProject(index: number, key: string, value: string) {
    const current = form.getValues("projects");
    const next = [...current];
    next[index] = {
      ...next[index],
      [key]:
        key === "highlights" || key === "technologies"
          ? value
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean)
          : value,
    };
    form.setValue("projects", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function addCertification() {
    const current = form.getValues("certifications");
    form.setValue(
      "certifications",
      [...current, { name: "", issuer: "", issueDate: "", credentialId: "" }],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function removeCertification(index: number) {
    const current = form.getValues("certifications");
    form.setValue(
      "certifications",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function updateCertification(index: number, key: string, value: string) {
    const current = form.getValues("certifications");
    const next = [...current];
    next[index] = { ...next[index], [key]: value };
    form.setValue("certifications", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function addLanguage() {
    const current = form.getValues("languages");
    form.setValue("languages", [...current, { name: "", proficiency: "" }], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function removeLanguage(index: number) {
    const current = form.getValues("languages");
    form.setValue(
      "languages",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  }

  function updateLanguage(index: number, key: string, value: string) {
    const current = form.getValues("languages");
    const next = [...current];
    next[index] = { ...next[index], [key]: value };
    form.setValue("languages", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  const tabContent: Record<TabId, ReactNode> = {
    basic: (
      <ProfileBasicInfoSection
        formValues={formValues}
        setRootField={setRootField}
        setProfileField={setProfileField}
        errors={errors}
      />
    ),
    summary: (
      <ProfileSummarySkillsSection
        formValues={formValues}
        setRootField={setRootField}
        errors={errors}
        onEnhanceSummary={handleEnhanceSummary}
        isEnhancingSummary={isSummaryGenerating}
        canUseAI={canUseProfileAI}
      />
    ),
    experience: (
      <ProfileExperienceSection
        formValues={formValues}
        addExperience={addExperience}
        removeExperience={removeExperience}
        updateExperience={updateExperience}
        errors={errors}
        onRefineExperience={handleRefineExperienceSection}
        isRefiningExperience={isExperienceGenerating}
        canUseAI={canUseProfileAI}
      />
    ),
    education: (
      <ProfileEducationSection
        formValues={formValues}
        addEducation={addEducation}
        removeEducation={removeEducation}
        updateEducation={updateEducation}
        errors={errors}
      />
    ),
    projects: (
      <ProfileProjectsSection
        formValues={formValues}
        addProject={addProject}
        removeProject={removeProject}
        updateProject={updateProject}
        errors={errors}
        onRefineProjects={handleRefineProjectsSection}
        isRefiningProjects={isProjectsGenerating}
        canUseAI={canUseProfileAI}
      />
    ),
    extra: (
      <ProfileExtraSection
        formValues={formValues}
        addCertification={addCertification}
        removeCertification={removeCertification}
        updateCertification={updateCertification}
        addLanguage={addLanguage}
        removeLanguage={removeLanguage}
        updateLanguage={updateLanguage}
        errors={errors}
      />
    ),
  };

  const currentTabIndex = TABS.findIndex((tab) => tab.id === activeTab);

  /* ****** Fields validated per tab step ****** */
  const TAB_FIELDS: Record<TabId, (keyof ProfileFormValues)[]> = {
    basic: ["profile"],
    summary: ["summary", "skills"],
    experience: ["experience"],
    education: ["education"],
    projects: ["projects"],
    extra: ["certifications", "languages"],
  };

  async function handleNext() {
    const fields = TAB_FIELDS[activeTab];
    const isValid = await form.trigger(fields as never, { shouldFocus: true });
    if (!isValid) return;
    setActiveTab(TABS[currentTabIndex + 1].id);
  }

  async function handleSaveCurrentTab() {
    const fields = TAB_FIELDS[activeTab];
    const isValid = await form.trigger(fields as never, { shouldFocus: true });
    if (!isValid) return;

    setIsManualSaving(true);
    try {
      await saveProfile(form.getValues());
      toast.success("Tab data saved successfully.");
    } catch {
      toast.error("Unable to save. Please try again.");
    } finally {
      setIsManualSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values: ProfileFormValues) => {
          try {
            await saveProfile(values);
            toast.success("Profile saved successfully.");
          } catch {
            toast.error("Unable to save profile. Please try again.");
          }
        })}
        className="flex flex-col"
      >
        <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/5 via-violet-500/5 to-blue-500/5 px-6 py-5">
          <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-primary/8 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 left-10 size-24 rounded-full bg-violet-500/8 blur-2xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <UploadCloud className="size-4" />
                </div>
                <h3 className="text-sm font-semibold">Import from CV</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload your existing PDF resume — we&apos;ll extract your
                details automatically.
              </p>
            </div>

            <div
              className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 transition-colors ${
                uploadFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-accent/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText
                className={`size-8 shrink-0 ${uploadFile ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="min-w-0">
                {uploadFile ? (
                  <>
                    <p className="truncate text-sm font-medium">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.size / 1024).toFixed(0)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Drop PDF here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Max 5 MB</p>
                  </>
                )}
              </div>
              {uploadFile && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setUploadFile(null);
                  }}
                  className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="shrink-0 flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!uploadFile || isParsing}
                onClick={handleParseWithoutAI}
                className="gap-1.5"
              >
                <Zap className="size-3.5 text-amber-500" />
                {isParsing ? "Extracting..." : "Extract Without AI"}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!uploadFile || isParsing || !config}
                onClick={handleParseWithAI}
                className="gap-1.5 bg-linear-to-r from-violet-600 to-primary hover:from-violet-700 hover:to-primary/90"
              >
                <Bot className="size-3.5" />
                {isParsing ? "Parsing..." : "Parse with AI"}
              </Button>
              {!config && (
                <p className="text-center text-[10px] text-muted-foreground">
                  Add AI key to enable AI parse
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 border-b bg-background">
          <div
            className="flex gap-0 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "border-primary font-medium text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-6">{tabContent[activeTab]}</div>

        <div className="flex items-center justify-between border-t bg-background px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {profile
              ? "Profile loaded — make your changes and save."
              : "Fill in your details and save your profile."}
          </p>
          <div className="flex items-center gap-3">
            {/* ****** Back button shown from step 2 onwards ****** */}
            {currentTabIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(TABS[currentTabIndex - 1].id)}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isManualSaving}
              onClick={handleSaveCurrentTab}
              className="min-w-25"
            >
              {isManualSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
            {currentTabIndex < TABS.length - 1 ? (
              /* ****** Next validates current tab fields before advancing ****** */
              <Button type="button" size="sm" onClick={handleNext}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              /* ****** Save Profile only on the last step ****** */
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isManualSaving}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
