import type { FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";

function errorText(message?: unknown) {
  return typeof message === "string" ? message : undefined;
}

export function ProfileEducationSection({
  formValues,
  addEducation,
  removeEducation,
  updateEducation,
  errors,
}: {
  formValues: ProfileFormValues;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  updateEducation: (index: number, key: string, value: string) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const educationListError = errorText(errors.education?.message);

  return (
    <div className="space-y-4">
      <ProfileSectionHeader
        title="Education"
        description="Your academic qualifications."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEducation}
          >
            <Plus className="size-4" />
            Add Education
          </Button>
        }
      />
      {educationListError && (
        <p className="-mt-2 text-xs text-destructive">{educationListError}</p>
      )}
      {formValues.education.length === 0 && (
        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          No education added yet.
        </div>
      )}
      {formValues.education.map((item, index) => {
        const itemErrors = errors.education?.[index];
        const institutionError = errorText(itemErrors?.institution?.message);
        const degreeError = errorText(itemErrors?.degree?.message);
        const fieldError = errorText(itemErrors?.field?.message);
        const startDateError = errorText(itemErrors?.startDate?.message);
        const endDateError = errorText(itemErrors?.endDate?.message);

        return (
          <Card key={`edu-${index}`} className="border-border/60">
            <CardHeader className="px-4 pb-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {item.institution || `Education ${index + 1}`}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="space-y-1.5">
                <Label htmlFor={`education-institution-${index}`}>
                  Institution *
                </Label>
                <Input
                  id={`education-institution-${index}`}
                  value={item.institution}
                  onChange={(event) =>
                    updateEducation(index, "institution", event.target.value)
                  }
                  aria-invalid={!!institutionError}
                />
                {institutionError && (
                  <p className="text-xs text-destructive">{institutionError}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`education-degree-${index}`}>Degree *</Label>
                  <Input
                    id={`education-degree-${index}`}
                    value={item.degree}
                    onChange={(event) =>
                      updateEducation(index, "degree", event.target.value)
                    }
                    aria-invalid={!!degreeError}
                  />
                  {degreeError && (
                    <p className="text-xs text-destructive">{degreeError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`education-field-${index}`}>
                    Field of Study *
                  </Label>
                  <Input
                    id={`education-field-${index}`}
                    value={item.field}
                    onChange={(event) =>
                      updateEducation(index, "field", event.target.value)
                    }
                    aria-invalid={!!fieldError}
                  />
                  {fieldError && (
                    <p className="text-xs text-destructive">{fieldError}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`education-startDate-${index}`}>
                    Start year *
                  </Label>
                  <Input
                    id={`education-startDate-${index}`}
                    value={item.startDate}
                    onChange={(event) =>
                      updateEducation(index, "startDate", event.target.value)
                    }
                    aria-invalid={!!startDateError}
                  />
                  {startDateError && (
                    <p className="text-xs text-destructive">{startDateError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`education-endDate-${index}`}>
                    End year *
                  </Label>
                  <Input
                    id={`education-endDate-${index}`}
                    value={item.endDate}
                    onChange={(event) =>
                      updateEducation(index, "endDate", event.target.value)
                    }
                    aria-invalid={!!endDateError}
                  />
                  {endDateError && (
                    <p className="text-xs text-destructive">{endDateError}</p>
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
