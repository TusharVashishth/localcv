import type { FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";
import { Camera, X } from "lucide-react";
import { useState, useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setProfileField("photo", base64String);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfileField("photo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const fullNameError = errorText(errors.profile?.fullName?.message);
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
          title="Personal Details"
          description="Your name and contact info."
        />
        <div className="mb-6 flex items-center gap-6">
          <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted">
            {formValues.profile.photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formValues.profile.photo}
                  alt="Profile"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive"
                >
                  <X className="size-3" />
                  <span className="sr-only">Remove photo</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground"
              >
                <Camera className="size-6" />
                <span className="text-[10px] font-medium">Upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Profile Photo</p>
            <p>Recommended: Square image, max 2MB.</p>
            <p>Will be used in templates that support photos.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
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
          <div className="space-y-1.5 md:col-span-2">
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
