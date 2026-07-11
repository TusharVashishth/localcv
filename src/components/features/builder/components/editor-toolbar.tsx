"use client";

/* ****** Resume Style Editor Toolbar — Vertical Sidebar Panel ****** */

import {
  ACCENT_COLOR_PRESETS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  type ResumeStyleConfig,
} from "@/components/features/resume-templates/types";
import { cn } from "@/lib/utils";
import { ALargeSmall, Baseline, Type } from "lucide-react";

interface EditorToolbarProps {
  styleConfig: ResumeStyleConfig;
  onChange: (updated: Partial<ResumeStyleConfig>) => void;
  /** When true renders in compact horizontal mode (for mobile top bar) */
  compact?: boolean;
}

export function EditorToolbar({ styleConfig, onChange, compact = false }: EditorToolbarProps) {
  if (compact) {
    /* ****** Horizontal scrolling compact strip for mobile ****** */
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Font Family */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Type className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex gap-1">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.value + opt.fontFamilyValue}
                type="button"
                onClick={() => onChange({ fontFamily: opt.value, fontFamilyValue: opt.fontFamilyValue })}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors whitespace-nowrap",
                  styleConfig.fontFamilyValue === opt.fontFamilyValue
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted",
                )}
                style={{ fontFamily: opt.fontFamilyValue }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px bg-border/60 self-center shrink-0" />

        {/* Font Size */}
        <div className="flex shrink-0 items-center gap-1.5">
          <ALargeSmall className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex gap-1">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ fontSize: opt.value })}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors",
                  styleConfig.fontSize === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px bg-border/60 self-center shrink-0" />

        {/* Colors */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Baseline className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex gap-1.5 items-center">
            {ACCENT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                onClick={() => onChange({ accentColor: preset.value })}
                className={cn(
                  "size-5 rounded-full border-2 transition-transform hover:scale-110",
                  styleConfig.accentColor === preset.value
                    ? "border-foreground scale-110 shadow-sm"
                    : "border-transparent",
                )}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ****** Vertical stacked panel for sidebar ****** */
  return (
    <div className="space-y-5">
      {/* Font Family */}
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
            <Type className="size-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Font Family</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value + opt.fontFamilyValue}
              type="button"
              onClick={() => onChange({ fontFamily: opt.value, fontFamilyValue: opt.fontFamilyValue })}
              className={cn(
                "flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition-all text-left",
                styleConfig.fontFamilyValue === opt.fontFamilyValue
                  ? "border-primary/60 bg-primary/8 text-primary font-semibold shadow-sm"
                  : "border-border/60 bg-background/60 text-foreground hover:bg-muted/60 hover:border-border",
              )}
              style={{ fontFamily: opt.fontFamilyValue }}
            >
              <span>{opt.label}</span>
              {styleConfig.fontFamilyValue === opt.fontFamilyValue && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* Font Size */}
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
            <ALargeSmall className="size-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Font Size</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ fontSize: opt.value })}
              className={cn(
                "rounded-xl border py-2 text-xs font-medium transition-all",
                styleConfig.fontSize === opt.value
                  ? "border-primary/60 bg-primary/8 text-primary shadow-sm"
                  : "border-border/60 bg-background/60 text-foreground hover:bg-muted/60",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* Accent Color */}
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
            <Baseline className="size-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Accent Color</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {ACCENT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              onClick={() => onChange({ accentColor: preset.value })}
              className={cn(
                "size-7 rounded-full border-2 transition-all hover:scale-110 hover:shadow-md",
                styleConfig.accentColor === preset.value
                  ? "border-foreground scale-110 shadow-md"
                  : "border-transparent",
              )}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          {/* ****** Custom color picker ****** */}
          <label
            className="relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/40 transition-all hover:border-primary hover:scale-110"
            title="Custom color"
          >
            <input
              type="color"
              value={styleConfig.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="absolute h-px w-px opacity-0"
            />
            <span className="text-[9px] font-bold text-muted-foreground">+</span>
          </label>
        </div>

        {/* ****** Active color preview chip ****** */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2">
          <div
            className="size-4 rounded-full shadow-sm"
            style={{ backgroundColor: styleConfig.accentColor }}
          />
          <span className="text-xs text-muted-foreground font-mono">{styleConfig.accentColor}</span>
        </div>
      </div>
    </div>
  );
}
