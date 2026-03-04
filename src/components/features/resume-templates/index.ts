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

export type ResumeTemplateData = Pick<
    Profile,
    | "industry"
    | "targetRole"
    | "profile"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages"
>;

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    industries: string[];
    defaultAccentColor?: string;
    component: ComponentType<{ data: ResumeTemplateData; compact?: boolean; styleConfig?: ResumeStyleConfig }>;
}

export const TEMPLATE_PREVIEW_DATA: ResumeTemplateData = {
    industry: "Technology",
    targetRole: "Senior Software Engineer",
    profile: {
        fullName: "Alex Morgan",
        headline: "Backend Engineer · Distributed Systems",
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "alexm.dev",
        linkedin: "linkedin.com/in/alexm",
        github: "github.com/alexm",
    },
    summary:
        "Results-driven engineer with 7+ years of experience delivering reliable and scalable products. Strong focus on performance, observability, and team collaboration.",
    experience: [
        {
            company: "Atlas Cloud",
            role: "Senior Software Engineer",
            location: "Remote",
            startDate: "2022",
            endDate: "Present",
            achievements: [
                "Reduced API latency by 38% by redesigning critical read paths.",
                "Implemented CI quality gates that lowered production regressions by 27%.",
            ],
        },
        {
            company: "Nova Systems",
            role: "Software Engineer",
            location: "New York, NY",
            startDate: "2019",
            endDate: "2022",
            achievements: [
                "Built internal tooling that saved 20+ engineering hours per week.",
            ],
        },
    ],
    education: [
        {
            institution: "State University",
            degree: "B.Sc.",
            field: "Computer Science",
            startDate: "2014",
            endDate: "2018",
        },
    ],
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    projects: [
        {
            name: "Realtime Analytics Platform",
            description: "A high-throughput event processing service.",
            highlights: ["Processes 2M+ events/day", "99.95% uptime"],
            technologies: ["Kafka", "Go", "ClickHouse"],
            link: "https://example.com/project",
        },
    ],
    certifications: [
        {
            name: "AWS Solutions Architect",
            issuer: "Amazon Web Services",
            issueDate: "2024",
        },
    ],
    languages: [
        {
            name: "English",
            proficiency: "Native",
        },
    ],
};

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
