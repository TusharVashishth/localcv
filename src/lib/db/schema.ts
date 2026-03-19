/* ****** IndexedDB Schema with Dexie ****** */

export interface AIConfig {
    id?: number;
    provider: string;
    modelName: string;
    encryptedApiKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    id?: number;
    profile: ResumeProfile;
    summary: string;
    experience: WorkExperience[];
    education: Education[];
    skills: string[];
    projects: Projects[];
    certifications: Certification[];
    languages: LanguageSkill[];
    createdAt: Date;
    updatedAt: Date;
}

export type Resume = Profile & {
    title: string;
    templateId: string;
};

export interface ResumeProfile {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    photo?: string;
}

export interface WorkExperience {
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string;
    achievements: string[];
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export interface Projects {
    name: string;
    description: string;
    highlights: string[];
    technologies: string[];
    link?: string;
}

export interface Certification {
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
}

export interface LanguageSkill {
    name: string;
    proficiency: string;
}

export interface CompanyResume {
    id?: number;
    companyName: string;
    jobDescription: string;
    profile: ResumeProfile;
    summary: string;
    experience: WorkExperience[];
    education: Education[];
    skills: string[];
    projects: Projects[];
    certifications: Certification[];
    languages: LanguageSkill[];
    createdAt: Date;
    updatedAt: Date;
}