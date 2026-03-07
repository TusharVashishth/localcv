"use client";

/* ****** Resume Style Editor Toolbar ****** */

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
}

export function EditorToolbar({ styleConfig, onChange }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-lg border bg-muted/30 text-sm">
      {/* ****** Font Family ****** */}
      <div className="flex items-center gap-2 min-w-0">
        <Type className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          Font
        </span>
        {/* ****** Horizontally scrollable font buttons ****** */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 max-w-65 lg:max-w-100 scrollbar-hide">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value + opt.fontFamilyValue}
              type="button"
              title={opt.label}
              onClick={() =>
                onChange({
                  fontFamily: opt.value,
                  fontFamilyValue: opt.fontFamilyValue,
                })
              }
              className={cn(
                "shrink-0 px-2 py-0.5 rounded text-xs border transition-colors",
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

      <div className="h-4 w-px bg-border" />

      {/* ****** Font Size ****** */}
      <div className="flex items-center gap-2">
        <ALargeSmall className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Size
        </span>
        <div className="flex gap-1">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.label}
              onClick={() => onChange({ fontSize: opt.value })}
              className={cn(
                "px-2 py-0.5 rounded text-xs border transition-colors",
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

      <div className="h-4 w-px bg-border" />

      {/* ****** Accent Color ****** */}
      <div className="flex items-center gap-2">
        <Baseline className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Color
        </span>
        <div className="flex gap-1.5">
          {ACCENT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              onClick={() => onChange({ accentColor: preset.value })}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                styleConfig.accentColor === preset.value
                  ? "border-foreground scale-110 shadow-sm"
                  : "border-transparent",
              )}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          {/* Custom hex input */}
          <label
            className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-muted-foreground overflow-hidden"
            title="Custom color"
          >
            <input
              type="color"
              value={styleConfig.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="opacity-0 absolute w-px h-px"
            />
            <span className="text-[8px] text-muted-foreground font-bold">
              +
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
