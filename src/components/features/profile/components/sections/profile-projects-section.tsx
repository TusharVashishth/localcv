import type { FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";

function errorText(message?: unknown) {
  return typeof message === "string" ? message : undefined;
}

export function ProfileProjectsSection({
  formValues,
  addProject,
  removeProject,
  updateProject,
  errors,
}: {
  formValues: ProfileFormValues;
  addProject: () => void;
  removeProject: (index: number) => void;
  updateProject: (index: number, key: string, value: string) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const projectsListError = errorText(errors.projects?.message);

  return (
    <div className="space-y-4">
      <ProfileSectionHeader
        title="Projects"
        description="Showcase your best work."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProject}
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        }
      />
      {projectsListError && (
        <p className="-mt-2 text-xs text-destructive">{projectsListError}</p>
      )}
      {formValues.projects.length === 0 && (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          No projects added yet.
        </div>
      )}
      {formValues.projects.map((item, index) => {
        const itemErrors = errors.projects?.[index];
        const nameError = errorText(itemErrors?.name?.message);
        const linkError = errorText(itemErrors?.link?.message);
        const descriptionError = errorText(itemErrors?.description?.message);
        const highlightsError = errorText(itemErrors?.highlights?.message);
        const technologiesError = errorText(itemErrors?.technologies?.message);

        return (
          <Card key={`proj-${index}`} className="border-border/60">
            <CardHeader className="px-4 pb-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {item.name || `Project ${index + 1}`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`project-name-${index}`}>
                    Project name *
                  </Label>
                  <Input
                    id={`project-name-${index}`}
                    value={item.name}
                    onChange={(event) =>
                      updateProject(index, "name", event.target.value)
                    }
                    aria-invalid={!!nameError}
                  />
                  {nameError && (
                    <p className="text-xs text-destructive">{nameError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`project-link-${index}`}>Link</Label>
                  <Input
                    id={`project-link-${index}`}
                    value={item.link ?? ""}
                    onChange={(event) =>
                      updateProject(index, "link", event.target.value)
                    }
                    aria-invalid={!!linkError}
                  />
                  {linkError && (
                    <p className="text-xs text-destructive">{linkError}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`project-description-${index}`}>
                  Description *
                </Label>
                <Textarea
                  id={`project-description-${index}`}
                  rows={2}
                  value={item.description}
                  onChange={(event) =>
                    updateProject(index, "description", event.target.value)
                  }
                  aria-invalid={!!descriptionError}
                />
                {descriptionError && (
                  <p className="text-xs text-destructive">{descriptionError}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`project-highlights-${index}`}>
                    Highlights (one per line)
                  </Label>
                  <Textarea
                    id={`project-highlights-${index}`}
                    rows={3}
                    value={item.highlights.join("\n")}
                    onChange={(event) =>
                      updateProject(index, "highlights", event.target.value)
                    }
                    aria-invalid={!!highlightsError}
                  />
                  {highlightsError && (
                    <p className="text-xs text-destructive">
                      {highlightsError}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`project-technologies-${index}`}>
                    Technologies (one per line)
                  </Label>
                  <Textarea
                    id={`project-technologies-${index}`}
                    rows={3}
                    value={item.technologies.join("\n")}
                    onChange={(event) =>
                      updateProject(index, "technologies", event.target.value)
                    }
                    aria-invalid={!!technologiesError}
                  />
                  {technologiesError && (
                    <p className="text-xs text-destructive">
                      {technologiesError}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
