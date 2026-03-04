"use client";

/* ****** Resume Builder — Client Orchestrator ****** */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Settings2 } from "lucide-react";
import { RESUME_TEMPLATES } from "@/components/features/resume-templates";
import {
  DEFAULT_STYLE_CONFIG,
  type ResumeStyleConfig,
} from "@/components/features/resume-templates/types";
import { TemplateSelector } from "./template-selector";
import { EditorToolbar } from "./editor-toolbar";
import { ResumePreview, PREVIEW_ELEMENT_ID } from "./resume-preview";
import { DownloadActions } from "./download-actions";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BuilderClient() {
  const { profile, isLoading } = useProfile();
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    RESUME_TEMPLATES[0]?.id ?? "classic",
  );
  const [styleConfig, setStyleConfig] =
    useState<ResumeStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [showToolbar, setShowToolbar] = useState(true);

  const selectedTemplate = useMemo(
    () =>
      RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
      RESUME_TEMPLATES[0],
    [selectedTemplateId],
  );

  /* ****** Apply accent color default from template when switching ****** */
  const handleSelectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    const tpl = RESUME_TEMPLATES.find((t) => t.id === id);
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

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="container mx-auto px-6 py-8">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Complete your profile first to generate resume templates.
            </p>
            <Link href="/dashboard/profile">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8 space-y-4">
      {/* ****** Editor Toolbar ****** */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Resume Builder</h1>
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
        {/* ****** Left Panel — sticky, fixed width, independent scroll ****** */}
        <div className="lg:sticky lg:top-4">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-muted-foreground" />
                Choose Template
              </CardTitle>
              <CardDescription className="text-xs">
                Your saved profile details are loaded automatically.
              </CardDescription>
            </CardHeader>
            <CardContent
              className="space-y-4 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              {/* Template list with thumbnails */}
              <TemplateSelector
                templates={RESUME_TEMPLATES}
                selectedId={selectedTemplate.id}
                onSelect={handleSelectTemplate}
                styleConfig={styleConfig}
                previewData={profile}
              />
            </CardContent>
          </Card>
        </div>

        {/* ****** Right Panel — live preview with downloads on top ****** */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  {selectedTemplate.name} Preview
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {profile.profile.fullName || "Your Name"}
                </CardDescription>
              </div>
            </div>
            {/* ****** Download buttons at TOP of preview panel ****** */}
            <div className="mt-3">
              <DownloadActions
                data={profile}
                templateId={selectedTemplate.id}
                previewElementId={PREVIEW_ELEMENT_ID}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ResumePreview
              template={selectedTemplate}
              data={profile}
              styleConfig={styleConfig}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
