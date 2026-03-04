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

export function ProfileExperienceSection({
  formValues,
  addExperience,
  removeExperience,
  updateExperience,
  errors,
}: {
  formValues: ProfileFormValues;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  updateExperience: (index: number, key: string, value: string) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const experienceListError = errorText(errors.experience?.message);

  return (
    <div className="space-y-4">
      <ProfileSectionHeader
        title="Work Experience"
        description="List your roles from most recent to oldest."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
          >
            <Plus className="size-4" />
            Add Experience
          </Button>
        }
      />
      {experienceListError && (
        <p className="-mt-2 text-xs text-destructive">{experienceListError}</p>
      )}
      {formValues.experience.length === 0 && (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          No experience added yet.
        </div>
      )}
      {formValues.experience.map((item, index) => {
        const itemErrors = errors.experience?.[index];
        const companyError = errorText(itemErrors?.company?.message);
        const roleError = errorText(itemErrors?.role?.message);
        const locationError = errorText(itemErrors?.location?.message);
        const startDateError = errorText(itemErrors?.startDate?.message);
        const endDateError = errorText(itemErrors?.endDate?.message);
        const descriptionError = errorText(itemErrors?.description?.message);
        const achievementsError = errorText(itemErrors?.achievements?.message);

        return (
          <Card key={`exp-${index}`} className="border-border/60">
            <CardHeader className="px-4 pb-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {item.company || item.role
                    ? `${item.role}${item.company ? ` at ${item.company}` : ""}`
                    : `Experience ${index + 1}`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeExperience(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`experience-company-${index}`}>
                    Company *
                  </Label>
                  <Input
                    id={`experience-company-${index}`}
                    value={item.company}
                    onChange={(event) =>
                      updateExperience(index, "company", event.target.value)
                    }
                    aria-invalid={!!companyError}
                  />
                  {companyError && (
                    <p className="text-xs text-destructive">{companyError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`experience-role-${index}`}>
                    Role / Title *
                  </Label>
                  <Input
                    id={`experience-role-${index}`}
                    value={item.role}
                    onChange={(event) =>
                      updateExperience(index, "role", event.target.value)
                    }
                    aria-invalid={!!roleError}
                  />
                  {roleError && (
                    <p className="text-xs text-destructive">{roleError}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`experience-location-${index}`}>
                    Location
                  </Label>
                  <Input
                    id={`experience-location-${index}`}
                    value={item.location ?? ""}
                    onChange={(event) =>
                      updateExperience(index, "location", event.target.value)
                    }
                    aria-invalid={!!locationError}
                  />
                  {locationError && (
                    <p className="text-xs text-destructive">{locationError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`experience-startDate-${index}`}>
                    Start date *
                  </Label>
                  <Input
                    id={`experience-startDate-${index}`}
                    value={item.startDate}
                    onChange={(event) =>
                      updateExperience(index, "startDate", event.target.value)
                    }
                    aria-invalid={!!startDateError}
                  />
                  {startDateError && (
                    <p className="text-xs text-destructive">{startDateError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`experience-endDate-${index}`}>
                    End date *
                  </Label>
                  <Input
                    id={`experience-endDate-${index}`}
                    value={item.endDate}
                    onChange={(event) =>
                      updateExperience(index, "endDate", event.target.value)
                    }
                    aria-invalid={!!endDateError}
                  />
                  {endDateError && (
                    <p className="text-xs text-destructive">{endDateError}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`experience-description-${index}`}>
                  Short description
                </Label>
                <Textarea
                  id={`experience-description-${index}`}
                  rows={2}
                  value={item.description ?? ""}
                  onChange={(event) =>
                    updateExperience(index, "description", event.target.value)
                  }
                  aria-invalid={!!descriptionError}
                />
                {descriptionError && (
                  <p className="text-xs text-destructive">{descriptionError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`experience-achievements-${index}`}>
                  Key achievements (one per line)
                </Label>
                <Textarea
                  id={`experience-achievements-${index}`}
                  rows={3}
                  value={item.achievements.join("\n")}
                  onChange={(event) =>
                    updateExperience(index, "achievements", event.target.value)
                  }
                  aria-invalid={!!achievementsError}
                />
                {achievementsError && (
                  <p className="text-xs text-destructive">
                    {achievementsError}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
