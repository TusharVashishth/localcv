"use client";

/* ****** Company Resume Builder — mirrors builder-client.tsx using company resume data ****** */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Settings2 } from "lucide-react";
import {
  RESUME_TEMPLATES,
  DEFAULT_STYLE_CONFIG,
  getTemplateDefaultSectionOrder,
  resolveSectionOrder,
  type ResumeSectionKey,
  type ResumeStyleConfig,
} from "@/components/features/resume-templates";
import { TemplateSelector } from "@/components/features/builder/components/template-selector";
import { EditorToolbar } from "@/components/features/builder/components/editor-toolbar";
import {
  ResumePreview,
  PREVIEW_ELEMENT_ID,
} from "@/components/features/builder/components/resume-preview";
import { DownloadActions } from "@/components/features/builder/components/download-actions";
import { SectionPriorityEditor } from "@/components/features/builder/components/section-priority-editor";
import { useCompanyResume } from "../hooks/use-company-resumes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompanyResumeBuilderClientProps {
  id: number;
}

export function CompanyResumeBuilderClient({
  id,
}: CompanyResumeBuilderClientProps) {
  const { companyResume, isLoading } = useCompanyResume(id);

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    RESUME_TEMPLATES[0]?.id ?? "classic",
  );
  const [styleConfig, setStyleConfig] =
    useState<ResumeStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [showToolbar, setShowToolbar] = useState(true);
  const [sectionOrderByTemplate, setSectionOrderByTemplate] = useState<
    Record<string, ResumeSectionKey[]>
  >(() => ({
    [RESUME_TEMPLATES[0]?.id ?? "classic"]: getTemplateDefaultSectionOrder(
      RESUME_TEMPLATES[0]?.id ?? "classic",
    ),
  }));

  const selectedTemplate = useMemo(
    () =>
      RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
      RESUME_TEMPLATES[0],
    [selectedTemplateId],
  );

  const selectedSectionOrder = useMemo(
    () =>
      resolveSectionOrder(
        sectionOrderByTemplate[selectedTemplate.id] ??
          getTemplateDefaultSectionOrder(selectedTemplate.id),
      ),
    [sectionOrderByTemplate, selectedTemplate.id],
  );

  const handleSelectTemplate = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    setSectionOrderByTemplate((prev) => {
      if (prev[templateId]) return prev;
      return {
        ...prev,
        [templateId]: getTemplateDefaultSectionOrder(templateId),
      };
    });
    const tpl = RESUME_TEMPLATES.find((t) => t.id === templateId);
    if (tpl?.defaultAccentColor) {
      setStyleConfig((prev) => ({
        ...prev,
        accentColor: tpl.defaultAccentColor!,
      }));
    }
  }, []);

  const handleStyleChange = useCallback(
    (updates: Partial<ResumeStyleConfig>) => {
      setStyleConfig((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const handleSectionOrderChange = useCallback(
    (nextOrder: ResumeSectionKey[]) => {
      setSectionOrderByTemplate((prev) => ({
        ...prev,
        [selectedTemplate.id]: resolveSectionOrder(nextOrder),
      }));
    },
    [selectedTemplate.id],
  );

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading resume…</p>
      </main>
    );
  }

  if (!companyResume) {
    return (
      <main className="container mx-auto px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Company resume not found.
            </p>
            <Link href="/dashboard/company-resumes">
              <Button>Back to Company Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  /* ****** Map CompanyResume to ResumeTemplateData shape ****** */
  const resumeData = {
    profile: companyResume.profile,
    summary: companyResume.summary,
    experience: companyResume.experience,
    education: companyResume.education,
    skills: companyResume.skills,
    projects: companyResume.projects,
    certifications: companyResume.certifications,
    languages: companyResume.languages,
  };

  return (
    <main className="container mx-auto px-6 py-8 space-y-4">
      {/* ****** Back nav + title ****** */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/company-resumes">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Company Resumes
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{companyResume.companyName}</h1>
          <p className="text-xs text-muted-foreground">
            AI-tailored resume builder
          </p>
        </div>
      </div>

      {/* ****** Editor Toolbar ****** */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Style Controls
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowToolbar((v) => !v)}
          >
            <Settings2 className="size-3.5" />
            {showToolbar ? "Hide style tools" : "Show style tools"}
          </Button>
        </div>
        {showToolbar && (
          <EditorToolbar
            styleConfig={styleConfig}
            onChange={handleStyleChange}
          />
        )}
      </div>

      <section className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] items-start">
        {/* ****** Left Panel ****** */}
        <div className="lg:sticky lg:top-4">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-muted-foreground" />
                Choose Template
              </CardTitle>
              <CardDescription className="text-xs">
                Tailored for {companyResume.companyName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 sm:max-h-72 lg:max-h-[calc(100vh-65vh)] overflow-y-auto pr-1">
                <TemplateSelector
                  templates={RESUME_TEMPLATES}
                  selectedId={selectedTemplate.id}
                  onSelect={handleSelectTemplate}
                  styleConfig={styleConfig}
                  previewData={resumeData}
                />
              </div>
              <div className="pt-1 border-t">
                <p className="text-xs font-semibold">Section Priority</p>
                <SectionPriorityEditor
                  order={selectedSectionOrder}
                  onChange={handleSectionOrderChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ****** Right Panel — live preview ****** */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  {selectedTemplate.name} Preview
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {companyResume.profile.fullName || "Your Name"} —{" "}
                  {companyResume.companyName}
                </CardDescription>
              </div>
            </div>
            <div className="mt-3">
              <DownloadActions
                data={resumeData}
                templateId={selectedTemplate.id}
                previewElementId={PREVIEW_ELEMENT_ID}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ResumePreview
              template={selectedTemplate}
              data={resumeData}
              styleConfig={styleConfig}
              sectionOrder={selectedSectionOrder}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
