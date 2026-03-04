import type { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";

function errorText(message?: unknown) {
  return typeof message === "string" ? message : undefined;
}

export function ProfileBasicInfoSection({
  formValues,
  setRootField,
  setProfileField,
  errors,
}: {
  formValues: ProfileFormValues;
  setRootField: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => void;
  setProfileField: <K extends keyof ProfileFormValues["profile"]>(
    key: K,
    value: ProfileFormValues["profile"][K],
  ) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const industryError = errorText(errors.industry?.message);
  const targetRoleError = errorText(errors.targetRole?.message);
  const fullNameError = errorText(errors.profile?.fullName?.message);
  const headlineError = errorText(errors.profile?.headline?.message);
  const emailError = errorText(errors.profile?.email?.message);
  const phoneError = errorText(errors.profile?.phone?.message);
  const locationError = errorText(errors.profile?.location?.message);
  const websiteError = errorText(errors.profile?.website?.message);
  const linkedinError = errorText(errors.profile?.linkedin?.message);
  const githubError = errorText(errors.profile?.github?.message);

  return (
    <div className="space-y-6">
      <div>
        <ProfileSectionHeader
          title="Position"
          description="What role and industry are you targeting?"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formValues.industry}
              onChange={(event) => setRootField("industry", event.target.value)}
              placeholder="e.g. Software Engineering"
              aria-invalid={!!industryError}
            />
            {industryError && (
              <p className="text-xs text-destructive">{industryError}</p>
            )}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="targetRole">Target Role</Label>
            <Input
              id="targetRole"
              value={formValues.targetRole}
              onChange={(event) =>
                setRootField("targetRole", event.target.value)
              }
              placeholder="e.g. Senior Frontend Engineer"
              aria-invalid={!!targetRoleError}
            />
            {targetRoleError && (
              <p className="text-xs text-destructive">{targetRoleError}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <ProfileSectionHeader
          title="Personal Details"
          description="Your name and headline on the resume."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formValues.profile.fullName}
              onChange={(event) =>
                setProfileField("fullName", event.target.value)
              }
              placeholder="Jane Doe"
              aria-invalid={!!fullNameError}
            />
            {fullNameError && (
              <p className="text-xs text-destructive">{fullNameError}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="headline">
              Headline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="headline"
              value={formValues.profile.headline}
              onChange={(event) =>
                setProfileField("headline", event.target.value)
              }
              placeholder="e.g. Full-Stack Developer"
              aria-invalid={!!headlineError}
            />
            {headlineError && (
              <p className="text-xs text-destructive">{headlineError}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <ProfileSectionHeader
          title="Contact"
          description="Where employers can reach you."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formValues.profile.email}
              onChange={(event) => setProfileField("email", event.target.value)}
              placeholder="jane@example.com"
              aria-invalid={!!emailError}
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              value={formValues.profile.phone}
              onChange={(event) => setProfileField("phone", event.target.value)}
              placeholder="+1 555 000 0000"
              aria-invalid={!!phoneError}
            />
            {phoneError && (
              <p className="text-xs text-destructive">{phoneError}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={formValues.profile.location}
              onChange={(event) =>
                setProfileField("location", event.target.value)
              }
              placeholder="San Francisco, CA"
              aria-invalid={!!locationError}
            />
            {locationError && (
              <p className="text-xs text-destructive">{locationError}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <ProfileSectionHeader
          title="Online Presence"
          description="Your portfolio and professional profiles."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formValues.profile.website ?? ""}
              onChange={(event) =>
                setProfileField("website", event.target.value)
              }
              placeholder="https://yoursite.com"
              aria-invalid={!!websiteError}
            />
            {websiteError && (
              <p className="text-xs text-destructive">{websiteError}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formValues.profile.linkedin ?? ""}
              onChange={(event) =>
                setProfileField("linkedin", event.target.value)
              }
              placeholder="https://linkedin.com/in/..."
              aria-invalid={!!linkedinError}
            />
            {linkedinError && (
              <p className="text-xs text-destructive">{linkedinError}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formValues.profile.github ?? ""}
              onChange={(event) =>
                setProfileField("github", event.target.value)
              }
              placeholder="https://github.com/..."
              aria-invalid={!!githubError}
            />
            {githubError && (
              <p className="text-xs text-destructive">{githubError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
