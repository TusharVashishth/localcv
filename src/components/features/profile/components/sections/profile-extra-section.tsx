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

export function ProfileExtraSection({
  formValues,
  addCertification,
  removeCertification,
  updateCertification,
  addLanguage,
  removeLanguage,
  updateLanguage,
  errors,
}: {
  formValues: ProfileFormValues;
  addCertification: () => void;
  removeCertification: (index: number) => void;
  updateCertification: (index: number, key: string, value: string) => void;
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
  updateLanguage: (index: number, key: string, value: string) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const certificationsListError = errorText(errors.certifications?.message);
  const languagesListError = errorText(errors.languages?.message);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <ProfileSectionHeader
          title="Certifications"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCertification}
            >
              <Plus className="size-4" />
              Add
            </Button>
          }
        />
        {certificationsListError && (
          <p className="-mt-2 text-xs text-destructive">
            {certificationsListError}
          </p>
        )}
        {formValues.certifications.length === 0 && (
          <div className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
            None added yet.
          </div>
        )}
        {formValues.certifications.map((item, index) => {
          const itemErrors = errors.certifications?.[index];
          const nameError = errorText(itemErrors?.name?.message);
          const issuerError = errorText(itemErrors?.issuer?.message);
          const issueDateError = errorText(itemErrors?.issueDate?.message);
          const credentialIdError = errorText(
            itemErrors?.credentialId?.message,
          );

          return (
            <Card key={`cert-${index}`} className="border-border/60">
              <CardHeader className="px-3 pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.name || `Cert ${index + 1}`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`cert-name-${index}`}>
                    Certification name *
                  </Label>
                  <Input
                    id={`cert-name-${index}`}
                    value={item.name}
                    onChange={(event) =>
                      updateCertification(index, "name", event.target.value)
                    }
                    aria-invalid={!!nameError}
                  />
                  {nameError && (
                    <p className="text-xs text-destructive">{nameError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`cert-issuer-${index}`}>Issuer *</Label>
                  <Input
                    id={`cert-issuer-${index}`}
                    value={item.issuer}
                    onChange={(event) =>
                      updateCertification(index, "issuer", event.target.value)
                    }
                    aria-invalid={!!issuerError}
                  />
                  {issuerError && (
                    <p className="text-xs text-destructive">{issuerError}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`cert-issueDate-${index}`}>
                      Issue date *
                    </Label>
                    <Input
                      id={`cert-issueDate-${index}`}
                      value={item.issueDate}
                      onChange={(event) =>
                        updateCertification(
                          index,
                          "issueDate",
                          event.target.value,
                        )
                      }
                      aria-invalid={!!issueDateError}
                    />
                    {issueDateError && (
                      <p className="text-xs text-destructive">
                        {issueDateError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`cert-credentialId-${index}`}>
                      Credential ID
                    </Label>
                    <Input
                      id={`cert-credentialId-${index}`}
                      value={item.credentialId ?? ""}
                      onChange={(event) =>
                        updateCertification(
                          index,
                          "credentialId",
                          event.target.value,
                        )
                      }
                      aria-invalid={!!credentialIdError}
                    />
                    {credentialIdError && (
                      <p className="text-xs text-destructive">
                        {credentialIdError}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <ProfileSectionHeader
          title="Languages"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLanguage}
            >
              <Plus className="size-4" />
              Add
            </Button>
          }
        />
        {languagesListError && (
          <p className="-mt-2 text-xs text-destructive">{languagesListError}</p>
        )}
        {formValues.languages.length === 0 && (
          <div className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
            None added yet.
          </div>
        )}
        {formValues.languages.map((item, index) => {
          const itemErrors = errors.languages?.[index];
          const nameError = errorText(itemErrors?.name?.message);
          const proficiencyError = errorText(itemErrors?.proficiency?.message);

          return (
            <Card key={`lang-${index}`} className="border-border/60">
              <CardHeader className="px-3 pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.name || `Language ${index + 1}`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLanguage(index)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`lang-name-${index}`}>Language *</Label>
                  <Input
                    id={`lang-name-${index}`}
                    value={item.name}
                    onChange={(event) =>
                      updateLanguage(index, "name", event.target.value)
                    }
                    aria-invalid={!!nameError}
                  />
                  {nameError && (
                    <p className="text-xs text-destructive">{nameError}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`lang-proficiency-${index}`}>
                    Proficiency *
                  </Label>
                  <Input
                    id={`lang-proficiency-${index}`}
                    value={item.proficiency}
                    onChange={(event) =>
                      updateLanguage(index, "proficiency", event.target.value)
                    }
                    aria-invalid={!!proficiencyError}
                  />
                  {proficiencyError && (
                    <p className="text-xs text-destructive">
                      {proficiencyError}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
