/* ****** Cover Letter Template Registry ****** */

import type { CoverLetterTemplate } from "./types";
import { CleanTemplate } from "./templates/clean-template";
import { ProfessionalTemplate } from "./templates/professional-template";
import { BoldTemplate } from "./templates/bold-template";
import { ElegantTemplate } from "./templates/elegant-template";

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
    {
        id: "clean",
        name: "Clean",
        description: "Minimalist white layout with a slim accent underline. ATS-friendly.",
        defaultAccentColor: "#0f4c81",
        defaultTextColor: "#1a1a1a",
        component: CleanTemplate,
    },
    {
        id: "professional",
        name: "Professional",
        description: "Solid accent header band. Classic and authoritative.",
        defaultAccentColor: "#2563eb",
        defaultTextColor: "#1a1a1a",
        component: ProfessionalTemplate,
    },
    {
        id: "bold",
        name: "Bold",
        description: "Strong left accent border with oversized name. Modern and confident.",
        defaultAccentColor: "#0d9488",
        defaultTextColor: "#1a1a1a",
        component: BoldTemplate,
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Centered header with decorative rule. Refined serif aesthetic.",
        defaultAccentColor: "#7c3aed",
        defaultTextColor: "#1a1a1a",
        component: ElegantTemplate,
    },
];

export type { CoverLetterTemplate, CoverLetterTemplateProps } from "./types";
export {
    DEFAULT_COVER_LETTER_STYLE,
    COVER_LETTER_FONT_OPTIONS,
    COVER_LETTER_FONT_SIZE_OPTIONS,
    COVER_LETTER_TEXT_COLOR_PRESETS,
    COVER_LETTER_ACCENT_COLOR_PRESETS,
    getFontSizeValue,
    getLineHeightValue,
} from "./types";
export { exportCoverLetterToHtml, exportCoverLetterToMarkdown } from "./cover-letter-export";
