/* ****** Resume Customization Types ****** */

export interface ResumeStyleConfig {
    /** Tailwind font class: font-sans | font-serif | font-mono */
    fontFamily: string;
    /** Explicit CSS font-family value for inline style */
    fontFamilyValue?: string;
    /** Base font size multiplier: 'small' | 'medium' | 'large' */
    fontSize: "small" | "medium" | "large";
    /** Primary accent color (hex) */
    accentColor: string;
    /** Sidebar or header background color (hex) — used by sidebar/photo templates */
    sidebarColor?: string;
}

export const DEFAULT_STYLE_CONFIG: ResumeStyleConfig = {
    fontFamily: "font-sans",
    fontFamilyValue: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "medium",
    accentColor: "#0f4c81",
};

export const FONT_OPTIONS = [
    { label: "Sans-serif", value: "font-sans", fontFamilyValue: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Inter", value: "font-inter", fontFamilyValue: "Inter, ui-sans-serif, system-ui, sans-serif" },
    { label: "Arial", value: "font-arial", fontFamilyValue: "Arial, Helvetica, sans-serif" },
    { label: "Verdana", value: "font-verdana", fontFamilyValue: "Verdana, Geneva, Tahoma, sans-serif" },
    { label: "Trebuchet", value: "font-trebuchet", fontFamilyValue: "'Trebuchet MS', Helvetica, sans-serif" },
    { label: "Calibri", value: "font-calibri", fontFamilyValue: "Calibri, 'Gill Sans', sans-serif" },
    { label: "Serif", value: "font-serif", fontFamilyValue: "ui-serif, Georgia, serif" },
    { label: "Georgia", value: "font-georgia", fontFamilyValue: "Georgia, 'Times New Roman', Times, serif" },
    { label: "Garamond", value: "font-garamond", fontFamilyValue: "Garamond, 'EB Garamond', 'Times New Roman', serif" },
    { label: "Palatino", value: "font-palatino", fontFamilyValue: "'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
    { label: "Cambria", value: "font-cambria", fontFamilyValue: "Cambria, Georgia, serif" },
    { label: "Mono", value: "font-mono", fontFamilyValue: "ui-monospace, 'Courier New', monospace" },
] as const;

export const ACCENT_COLOR_PRESETS = [
    { label: "Navy Blue", value: "#0f4c81" },
    { label: "Royal Blue", value: "#2563eb" },
    { label: "Teal", value: "#0d9488" },
    { label: "Emerald", value: "#059669" },
    { label: "Purple", value: "#7c3aed" },
    { label: "Rose", value: "#e11d48" },
    { label: "Orange", value: "#ea580c" },
    { label: "Gray", value: "#374151" },
] as const;

export const FONT_SIZE_OPTIONS = [
    { label: "Small", value: "small" as const },
    { label: "Medium", value: "medium" as const },
    { label: "Large", value: "large" as const },
] as const;
