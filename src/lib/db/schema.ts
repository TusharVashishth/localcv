/* ****** IndexedDB Schema with Dexie ****** */

export interface AIConfig {
    id?: number;
    provider: string;
    modelName: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Resume {
    id?: number;
    title: string;
    templateId: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: WorkExperience[];
    education: Education[];
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}
