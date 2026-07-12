import type { FieldErrors } from "react-hook-form";
import { useRef, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { toast } from "sonner";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Camera, Crop as CropIcon, ImagePlus, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ProfileFormValues } from "../../schema/profile-schema";
import { ProfileSectionHeader } from "../profile-section-header";

const PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const PHOTO_OUTPUT_SIZE = 512;

function errorText(msg?: unknown) {
  return typeof msg === "string" ? msg : undefined;
}

export function ProfileBasicInfoSection({
  formValues,
  setProfileField,
  errors,
}: {
  formValues: ProfileFormValues;
  setProfileField: <K extends keyof ProfileFormValues["profile"]>(
    key: K,
    value: ProfileFormValues["profile"][K],
  ) => void;
  errors: FieldErrors<ProfileFormValues>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  /* react-image-crop controlled crop selection */
  const [crop, setCrop] = useState<Crop>();
  /* Pixel crop captured on onComplete — used for canvas export */
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  /* Local preview so the avatar refreshes immediately after cropping */
  const [savedPreviewOverride, setSavedPreviewOverride] = useState<
    string | null
  >(null);

  const currentPhoto = savedPreviewOverride ?? formValues.profile.photo ?? "";
  const hasPhoto = !!currentPhoto;

  // ── editor lifecycle ──────────────────────────────────────────────────────
  const openPhotoEditor = (src: string) => {
    setEditorImageSrc(src);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsEditorOpen(true);
  };

  const closeEditor = () => setIsEditorOpen(false);

  // ── file upload ───────────────────────────────────────────────────────────
  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      toast.error("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src !== "string") {
        toast.error("Unable to read the selected image.");
        return;
      }
      openPhotoEditor(src);
    };
    reader.onerror = () => toast.error("Unable to read the selected image.");
    reader.readAsDataURL(file);
    /* Reset so the same file can be re-selected */
    event.target.value = "";
  };

  const removePhoto = () => {
    setSavedPreviewOverride("");
    setProfileField("photo", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── ReactCrop callbacks ───────────────────────────────────────────────────

  /* When the crop image loads, initialise a centred 90 % square selection */
  const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = event.currentTarget;
    const initial = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height,
    );
    setCrop(initial);
  };

  // ── save crop ─────────────────────────────────────────────────────────────
  const applyCrop = () => {
    const img = cropImgRef.current;
    if (!img || !completedCrop || completedCrop.width === 0) {
      toast.error("Please make a crop selection first.");
      return;
    }

    /* Scale factor: ReactCrop gives crop coords in rendered CSS pixels;
       drawImage needs natural pixel coords. */
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = PHOTO_OUTPUT_SIZE;
    outputCanvas.height = PHOTO_OUTPUT_SIZE;

    const ctx = outputCanvas.getContext("2d");
    if (!ctx) {
      toast.error("Unable to process the image.");
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      PHOTO_OUTPUT_SIZE,
      PHOTO_OUTPUT_SIZE,
    );

    const cropped = outputCanvas.toDataURL("image/jpeg", 0.92);
    setSavedPreviewOverride(cropped);
    setProfileField("photo", cropped);
    closeEditor();
    toast.success(hasPhoto ? "Photo updated." : "Photo saved.");
  };

  // ── error helpers ─────────────────────────────────────────────────────────
  const fullNameError = errorText(errors.profile?.fullName?.message);
  const emailError = errorText(errors.profile?.email?.message);
  const phoneError = errorText(errors.profile?.phone?.message);
  const locationError = errorText(errors.profile?.location?.message);
  const websiteError = errorText(errors.profile?.website?.message);
  const linkedinError = errorText(errors.profile?.linkedin?.message);
  const githubError = errorText(errors.profile?.github?.message);

  return (
    <>
      <div className="space-y-6">
        <div>
          <ProfileSectionHeader
            title="Personal Details"
            description="Your name and contact info."
          />

          {/* ── Photo card ──────────────────────────────────────────────── */}
          <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:flex-row sm:items-center">
            {/* Circular avatar preview */}
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50">
              {hasPhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute right-0.5 top-0.5 rounded-full bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive"
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
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Description + actions */}
            <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Profile Photo</p>
                <p>
                  PNG or JPG · up to 2 MB · shown in photo-enabled templates.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button
                  type="button"
                  variant={hasPhoto ? "outline" : "default"}
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="size-4" />
                  {hasPhoto ? "Change photo" : "Upload photo"}
                </Button>
                {hasPhoto && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openPhotoEditor(currentPhoto)}
                  >
                    <CropIcon className="size-4" />
                    Edit crop
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Personal details grid ────────────────────────────────────── */}
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
                onChange={(event) =>
                  setProfileField("email", event.target.value)
                }
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
                onChange={(event) =>
                  setProfileField("phone", event.target.value)
                }
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

      {/* ── Crop dialog ──────────────────────────────────────────────────── */}
      <Dialog
        open={isEditorOpen}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop profile photo</DialogTitle>
            <DialogDescription>
              Drag the handles to resize the crop area. The result will be a
              square photo used in your resume.
            </DialogDescription>
          </DialogHeader>

          {/* ReactCrop renders the image at its natural aspect ratio and
              overlays accessible crop handles — no custom drag math needed */}
          {editorImageSrc && (
            <div className="flex justify-center overflow-auto rounded-xl">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                keepSelection
                minWidth={40}
                minHeight={40}
                className="max-h-[65vh]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={cropImgRef}
                  src={editorImageSrc}
                  alt="Crop source"
                  onLoad={onImageLoad}
                  style={{
                    maxHeight: "65vh",
                    width: "auto",
                    maxWidth: "100%",
                    display: "block",
                  }}
                />
              </ReactCrop>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditor}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!completedCrop || completedCrop.width === 0}
              onClick={applyCrop}
            >
              Save photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
