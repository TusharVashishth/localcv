/* ****** Cover Letter Template Types ****** */

import type { CoverLetterContent, CoverLetterStyleConfig, ResumeProfile } from "@/lib/db/schema";

export interface CoverLetterTemplateProps {
    content: CoverLetterContent;
    profile: ResumeProfile;
    companyName: string;
    styleConfig: CoverLetterStyleConfig;
}

export interface CoverLetterTemplate {
    id: string;
    name: string;
    description: string;
    defaultAccentColor: string;
    defaultTextColor: string;
    component: React.ComponentType<CoverLetterTemplateProps>;
}

export const DEFAULT_COVER_LETTER_STYLE: CoverLetterStyleConfig = {
    fontFamily: "font-sans",
    fontFamilyValue: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "medium",
    textColor: "#1a1a1a",
    accentColor: "#0f4c81",
    template: "clean",
};

export const COVER_LETTER_FONT_OPTIONS = [
    { label: "Sans-serif", value: "font-sans", fontFamilyValue: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Inter", value: "font-inter", fontFamilyValue: "Inter, ui-sans-serif, system-ui, sans-serif" },
    { label: "Georgia", value: "font-georgia", fontFamilyValue: "Georgia, 'Times New Roman', Times, serif" },
    { label: "Calibri", value: "font-calibri", fontFamilyValue: "Calibri, 'Gill Sans', sans-serif" },
    { label: "Garamond", value: "font-garamond", fontFamilyValue: "Garamond, 'EB Garamond', 'Times New Roman', serif" },
    { label: "Palatino", value: "font-palatino", fontFamilyValue: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
] as const;

export const COVER_LETTER_FONT_SIZE_OPTIONS = [
    { label: "Small", value: "small" as const },
    { label: "Medium", value: "medium" as const },
    { label: "Large", value: "large" as const },
] as const;

export const COVER_LETTER_TEXT_COLOR_PRESETS = [
    { label: "Near Black", value: "#1a1a1a" },
    { label: "Charcoal", value: "#374151" },
    { label: "Slate", value: "#4b5563" },
    { label: "Navy", value: "#1e3a5f" },
] as const;

export const COVER_LETTER_ACCENT_COLOR_PRESETS = [
    { label: "Navy Blue", value: "#0f4c81" },
    { label: "Royal Blue", value: "#2563eb" },
    { label: "Teal", value: "#0d9488" },
    { label: "Emerald", value: "#059669" },
    { label: "Purple", value: "#7c3aed" },
    { label: "Rose", value: "#e11d48" },
    { label: "Orange", value: "#ea580c" },
    { label: "Gray", value: "#374151" },
] as const;

/** Returns the CSS font-size for a given fontSize option. */
export function getFontSizeValue(fontSize: "small" | "medium" | "large"): string {
    return { small: "13px", medium: "14.5px", large: "16px" }[fontSize];
}

/** Returns line-height for a given fontSize option. */
export function getLineHeightValue(fontSize: "small" | "medium" | "large"): string {
    return { small: "1.55", medium: "1.65", large: "1.75" }[fontSize];
}
