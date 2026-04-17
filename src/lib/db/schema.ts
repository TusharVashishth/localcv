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

export interface ATSScoreBreakdown {
    keywordMatch: number;
    experienceRelevance: number;
    skillsMatch: number;
    formatQuality: number;
}

export interface ATSSectionFeedback {
    summary: string;
    experience: string;
    skills: string;
    education: string;
}

export interface ATSResult {
    id?: number;
    jobTitle?: string;
    jobDescription: string;
    score: number;
    scoreBreakdown: ATSScoreBreakdown;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    improvements: string[];
    sectionFeedback: ATSSectionFeedback;
    generatedResume?: CompanyResume;
    createdAt: Date;
}

export interface CoverLetterContent {
    salutation: string;
    openingParagraph: string;
    bodyParagraphs: string[];
    closingParagraph: string;
    signature: string;
    generatedAt: Date;
}

export interface CoverLetterStyleConfig {
    fontFamily: string;
    fontFamilyValue?: string;
    fontSize: "small" | "medium" | "large";
    textColor: string;
    accentColor: string;
    template: string;
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
    coverLetter?: CoverLetterContent;
    coverLetterStyle?: CoverLetterStyleConfig;
    createdAt: Date;
    updatedAt: Date;
}