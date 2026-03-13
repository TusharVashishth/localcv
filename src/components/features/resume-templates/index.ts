/* ****** Resume Template Registry ****** */

import type { ComponentType } from "react";
import type { Profile } from "@/lib/db/schema";
import type { ResumeStyleConfig } from "./types";
import { ClassicTemplate } from "./classic-template";
import { ModernTemplate } from "./modern-template";
import { MinimalTemplate } from "./minimal-template";
import { ExecutiveTemplate } from "./executive-template";
import { TechnicalTemplate } from "./technical-template";
import { SidebarColorTemplate } from "./sidebar-color-template";
import { PhotoTemplate } from "./photo-template";
import { CreativeTemplate } from "./creative-template";
import type { ResumeSectionKey } from "./section-order";

export type ResumeTemplateData = Pick<
    Profile,
    | "profile"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages"
>;

export interface ResumeTemplateComponentProps {
    data: ResumeTemplateData;
    compact?: boolean;
    styleConfig?: ResumeStyleConfig;
    sectionOrder?: ResumeSectionKey[];
}

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    industries: string[];
    defaultAccentColor?: string;
    component: ComponentType<ResumeTemplateComponentProps>;
}

export const TEMPLATE_PREVIEW_DATA: ResumeTemplateData = {
    profile: {
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "alexm.dev",
        linkedin: "linkedin.com/in/alexm",
        github: "github.com/alexm",
        photo:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
    },
    summary:
        "Product-minded software engineer with 8+ years of experience building resume, hiring, and workflow tools for fast-moving teams. Known for turning ambiguous requirements into polished user experiences, improving system reliability, and mentoring engineers across frontend and platform work.",
    experience: [
        {
            company: "Atlas Cloud",
            role: "Senior Software Engineer",
            location: "Remote",
            startDate: "2022",
            endDate: "Present",
            achievements: [
                "Rebuilt resume generation flows to reduce completion time by 38% across high-intent users.",
                "Introduced quality gates and analytics reviews that cut production regressions by 27%.",
                "Partnered with design and growth teams to launch role-based resume templates that improved template adoption by 31%.",
            ],
        },
        {
            company: "Northstar Labs",
            role: "Frontend Engineer",
            location: "New York, NY",
            startDate: "2020",
            endDate: "2022",
            achievements: [
                "Launched dashboard tooling that saved recruiting teams 20+ hours per week.",
                "Built reusable component systems that reduced duplicated UI work across 6 internal products.",
            ],
        },
        {
            company: "BluePeak Studio",
            role: "Software Engineer",
            location: "Seattle, WA",
            startDate: "2018",
            endDate: "2020",
            achievements: [
                "Delivered customer-facing workflow builders used by more than 12,000 monthly active users.",
                "Improved page performance scores by over 30 points through code-splitting and rendering optimizations.",
            ],
        },
    ],
    education: [
        {
            institution: "University of Washington",
            degree: "B.S.",
            field: "Informatics",
            startDate: "2014",
            endDate: "2018",
        },
        {
            institution: "DesignLab",
            degree: "Certificate",
            field: "UX Design Foundations",
            startDate: "2019",
            endDate: "2020",
        },
    ],
    skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Tailwind CSS",
        "Design Systems",
        "Product Strategy",
        "Performance",
    ],
    projects: [
        {
            name: "localCV Builder",
            description:
                "A local-first resume builder with AI-assisted tailoring and export-ready previews.",
            highlights: [
                "Improved template switching performance for large resumes",
                "Shipped ATS-focused exports with customizable section order",
                "Added privacy-first local storage flows for profile management",
            ],
            technologies: ["Next.js", "TypeScript", "Dexie", "Tailwind CSS"],
            link: "https://localcv.app",
        },
        {
            name: "Hiring Insights Dashboard",
            description:
                "A recruiter-facing analytics suite for monitoring funnel quality and role performance.",
            highlights: [
                "Designed reusable dashboard blocks for rapid reporting",
                "Integrated trend visualizations and benchmark summaries",
            ],
            technologies: ["React", "Node.js", "PostgreSQL", "Charts"],
            link: "https://example.com/hiring-insights",
        },
    ],
    certifications: [
        {
            name: "AWS Certified Developer",
            issuer: "Amazon Web Services",
            issueDate: "2025",
        },
        {
            name: "Professional Scrum Master I",
            issuer: "Scrum.org",
            issueDate: "2024",
        },
    ],
    languages: [
        {
            name: "English",
            proficiency: "Native",
        },
        {
            name: "Spanish",
            proficiency: "Professional",
        },
    ],
};

export function getTemplatePreviewStyleConfig(
    template: ResumeTemplate,
    styleConfig: ResumeStyleConfig,
): ResumeStyleConfig {
    const accentColor =
        template.defaultAccentColor ?? styleConfig.accentColor;

    return {
        ...styleConfig,
        accentColor,
        sidebarColor: accentColor,
    };
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
    {
        id: "classic",
        name: "Classic",
        description: "Traditional corporate format used widely for business and operations roles.",
        industries: ["Business", "Operations", "Administration"],
        component: ClassicTemplate,
    },
    {
        id: "modern",
        name: "Modern",
        description: "Balanced contemporary layout suitable across most industries.",
        industries: ["General", "Marketing", "Product"],
        component: ModernTemplate,
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Clean and concise template optimized for ATS readability.",
        industries: ["Consulting", "Finance", "Healthcare"],
        component: MinimalTemplate,
    },
    {
        id: "executive",
        name: "Executive",
        description: "Leadership-first format for management and senior leadership roles.",
        industries: ["Leadership", "Strategy", "Corporate"],
        component: ExecutiveTemplate,
    },
    {
        id: "technical",
        name: "Technical",
        description: "Detail-focused format for engineering and technical specialist roles.",
        industries: ["Engineering", "Data", "IT"],
        component: TechnicalTemplate,
    },
    {
        id: "sidebar-color",
        name: "Sidebar Color",
        description: "Bold two-column layout with a vibrant colored sidebar — ideal for creative roles.",
        industries: ["Design", "Marketing", "Creative"],
        defaultAccentColor: "#0f4c81",
        component: SidebarColorTemplate,
    },
    {
        id: "photo",
        name: "With Photo",
        description: "Modern template with a profile photo placeholder and colorful header band.",
        industries: ["Media", "Sales", "Public Relations"],
        defaultAccentColor: "#2563eb",
        component: PhotoTemplate,
    },
    {
        id: "creative",
        name: "Creative",
        description: "Vibrant teal-accented layout with colorful skill tags — great for tech and design.",
        industries: ["Technology", "UX", "Design", "Startups"],
        defaultAccentColor: "#0d9488",
        component: CreativeTemplate,
    },
];

export * from "./resume-export";
export * from "./types";
export * from "./section-order";
