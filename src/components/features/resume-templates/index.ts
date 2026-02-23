/* ****** Resume Template Type Definitions ****** */

export interface ResumeTemplateData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: {
        company: string;
        role: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
    }[];
    skills: string[];
}

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    preview: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
    {
        id: "classic",
        name: "Classic",
        description: "Traditional and clean layout perfect for corporate roles.",
        preview: "classic",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Sleek design with accent colors and modern typography.",
        preview: "modern",
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Simple and elegant with plenty of white space.",
        preview: "minimal",
    },
];
