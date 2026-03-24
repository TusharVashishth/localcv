/* ****** Local Data Import/Export Utilities ****** */

import { z } from "zod";
import { db } from "./index";
import type { AIConfig, ATSResult, CompanyResume, Profile } from "./schema";

// ─── Primitive helpers ────────────────────────────────────────────────────────

/** Accepts an ISO string or a Date object and always resolves to a Date. */
const dateSchema = z
    .union([z.iso.datetime(), z.date()])
    .transform((value) => (value instanceof Date ? value : new Date(value)));

/** Trims and treats empty strings as undefined. */
const optionalStringSchema = z.string().optional();

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

/** Contact/identity block shared by Profile and CompanyResume. */
const resumeProfileSchema = z
    .object({
        fullName: z.string().trim().min(1),
        email: z.string().trim().min(1),
        phone: z.string().trim().min(1),
        location: z.string().trim().min(1),
        website: optionalStringSchema,
        linkedin: optionalStringSchema,
        github: optionalStringSchema,
        photo: optionalStringSchema,
    })
    .strict();

/** Single work-experience entry. */
const workExperienceSchema = z
    .object({
        company: z.string(),
        role: z.string(),
        location: optionalStringSchema,
        startDate: z.string(),
        endDate: z.string(),
        description: optionalStringSchema,
        achievements: z.array(z.string()),
    })
    .strict();

/** Single education entry. */
const educationSchema = z
    .object({
        institution: z.string(),
        degree: z.string(),
        field: z.string(),
        startDate: z.string(),
        endDate: z.string(),
    })
    .strict();

/** Single project entry. */
const projectSchema = z
    .object({
        name: z.string(),
        description: z.string(),
        highlights: z.array(z.string()),
        technologies: z.array(z.string()),
        link: optionalStringSchema,
    })
    .strict();

/** Single certification entry. */
const certificationSchema = z
    .object({
        name: z.string(),
        issuer: z.string(),
        issueDate: z.string(),
        credentialId: optionalStringSchema,
    })
    .strict();

/** Single language-skill entry. */
const languageSkillSchema = z
    .object({
        name: z.string(),
        proficiency: z.string(),
    })
    .strict();

// ─── Top-level entity schemas ─────────────────────────────────────────────────

/** AI provider configuration (excludes auto-generated id). */
const aiConfigSchema = z
    .object({
        provider: z.string().trim().min(1),
        modelName: z.string().trim().min(1),
        encryptedApiKey: z.string().trim().min(1),
        createdAt: dateSchema,
        updatedAt: dateSchema,
    })
    .strict();

/** Master resume profile with all sections. */
const profileSchema = z
    .object({
        profile: resumeProfileSchema,
        summary: z.string(),
        experience: z.array(workExperienceSchema),
        education: z.array(educationSchema),
        skills: z.array(z.string()),
        projects: z.array(projectSchema),
        certifications: z.array(certificationSchema),
        languages: z.array(languageSkillSchema),
        createdAt: dateSchema,
        updatedAt: dateSchema,
    })
    .strict();

/** Company-tailored resume generated from a profile + job description. */
const companyResumeSchema = z
    .object({
        companyName: z.string().trim().min(1),
        jobDescription: z.string(),
        profile: resumeProfileSchema,
        summary: z.string(),
        experience: z.array(workExperienceSchema),
        education: z.array(educationSchema),
        skills: z.array(z.string()),
        projects: z.array(projectSchema),
        certifications: z.array(certificationSchema),
        languages: z.array(languageSkillSchema),
        createdAt: dateSchema,
        updatedAt: dateSchema,
    })
    .strict();

/** Numeric breakdown of individual ATS scoring dimensions. */
const atsScoreBreakdownSchema = z
    .object({
        keywordMatch: z.number(),
        experienceRelevance: z.number(),
        skillsMatch: z.number(),
        formatQuality: z.number(),
    })
    .strict();

/** Per-section textual feedback returned by the ATS analyser. */
const atsSectionFeedbackSchema = z
    .object({
        summary: z.string(),
        experience: z.string(),
        skills: z.string(),
        education: z.string(),
    })
    .strict();

/** Full ATS analysis result, optionally linked to a generated company resume. */
const atsResultSchema = z
    .object({
        jobTitle: optionalStringSchema,
        jobDescription: z.string(),
        score: z.number(),
        scoreBreakdown: atsScoreBreakdownSchema,
        matchedKeywords: z.array(z.string()),
        missingKeywords: z.array(z.string()),
        strengths: z.array(z.string()),
        improvements: z.array(z.string()),
        sectionFeedback: atsSectionFeedbackSchema,
        generatedResume: companyResumeSchema.optional(),
        createdAt: dateSchema,
    })
    .strict();

// ─── Root payload schema ──────────────────────────────────────────────────────

/** Versioned envelope that wraps all exported local data. */
const localDataPayloadSchema = z
    .object({
        /** Schema version: 1 = initial, 2 = +companyResumes, 3 = +atsResults. */
        version: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        exportedAt: z.iso.datetime(),
        aiConfigs: z.array(aiConfigSchema),
        profiles: z.array(profileSchema),
        /** Added in v2 — optional so v1 exports remain valid. */
        companyResumes: z.array(companyResumeSchema).optional().default([]),
        /** Added in v3 — optional so v1/v2 exports remain valid. */
        atsResults: z.array(atsResultSchema).optional().default([]),
    })
    .strict();

export type LocalDataPayload = z.infer<typeof localDataPayloadSchema>;

// ─── Public API ───────────────────────────────────────────────────────────────

/** Reads all tables and serialises them into a portable export payload. */
export async function createLocalDataExport(): Promise<LocalDataPayload> {
    const [aiConfigs, profiles, companyResumes, atsResults] = await Promise.all([
        db.aiConfigs.toArray(),
        db.profiles.toArray(),
        db.companyResumes.toArray(),
        db.atsResults.toArray(),
    ]);

    return {
        version: 3,
        exportedAt: new Date().toISOString(),
        aiConfigs: aiConfigs.map((item) => normalizeAiConfig(item)),
        profiles: profiles.map((item) => normalizeProfile(item)),
        companyResumes: companyResumes.map((item) => normalizeCompanyResume(item)),
        atsResults: atsResults.map((item) => normalizeAtsResult(item)),
    };
}

/** Validates and parses raw JSON into a typed LocalDataPayload; throws on invalid input. */
export function parseLocalDataImport(raw: unknown): LocalDataPayload {
    return localDataPayloadSchema.parse(raw);
}

/** Validates, clears all tables, then bulk-inserts the imported data in a single transaction. */
export async function importLocalData(raw: unknown): Promise<void> {
    const parsed = parseLocalDataImport(raw);

    await db.transaction("rw", db.aiConfigs, db.profiles, db.companyResumes, db.atsResults, async () => {
        await db.aiConfigs.clear();
        await db.profiles.clear();
        await db.companyResumes.clear();
        await db.atsResults.clear();

        if (parsed.aiConfigs.length > 0) {
            await db.aiConfigs.bulkAdd(parsed.aiConfigs.map((item) => normalizeAiConfig(item)));
        }

        if (parsed.profiles.length > 0) {
            await db.profiles.bulkAdd(parsed.profiles.map((item) => normalizeProfile(item)));
        }

        if (parsed.companyResumes && parsed.companyResumes.length > 0) {
            await db.companyResumes.bulkAdd(
                parsed.companyResumes.map((item) => normalizeCompanyResume(item)),
            );
        }

        if (parsed.atsResults && parsed.atsResults.length > 0) {
            await db.atsResults.bulkAdd(
                parsed.atsResults.map((item) => normalizeAtsResult(item)),
            );
        }
    });
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

/** Trims strings and re-hydrates dates for an AI config record. */
function normalizeAiConfig(input: Omit<AIConfig, "id">): Omit<AIConfig, "id"> {
    return {
        provider: input.provider.trim(),
        modelName: input.modelName.trim(),
        encryptedApiKey: input.encryptedApiKey.trim(),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}

/** Trims strings and re-hydrates dates for a master profile record. */
function normalizeProfile(input: Omit<Profile, "id">): Omit<Profile, "id"> {
    return {
        profile: normalizeResumeProfile(input.profile),
        summary: input.summary.trim(),
        experience: input.experience.map(normalizeWorkExperience),
        education: input.education.map(normalizeEducation),
        skills: input.skills.map((s) => s.trim()),
        projects: input.projects.map(normalizeProject),
        certifications: input.certifications.map(normalizeCertification),
        languages: input.languages.map(normalizeLanguageSkill),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}

/** Trims strings and re-hydrates dates for a company-tailored resume record. */
function normalizeCompanyResume(input: Omit<CompanyResume, "id">): Omit<CompanyResume, "id"> {
    return {
        companyName: input.companyName.trim(),
        jobDescription: input.jobDescription.trim(),
        profile: normalizeResumeProfile(input.profile),
        summary: input.summary.trim(),
        experience: input.experience.map(normalizeWorkExperience),
        education: input.education.map(normalizeEducation),
        skills: input.skills.map((s) => s.trim()),
        projects: input.projects.map(normalizeProject),
        certifications: input.certifications.map(normalizeCertification),
        languages: input.languages.map(normalizeLanguageSkill),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}

/** Trims strings and re-hydrates dates for an ATS analysis result record. */
function normalizeAtsResult(input: Omit<ATSResult, "id">): Omit<ATSResult, "id"> {
    return {
        jobTitle: normalizeOptionalString(input.jobTitle),
        jobDescription: input.jobDescription.trim(),
        score: input.score,
        scoreBreakdown: {
            keywordMatch: input.scoreBreakdown.keywordMatch,
            experienceRelevance: input.scoreBreakdown.experienceRelevance,
            skillsMatch: input.scoreBreakdown.skillsMatch,
            formatQuality: input.scoreBreakdown.formatQuality,
        },
        matchedKeywords: input.matchedKeywords.map((k) => k.trim()),
        missingKeywords: input.missingKeywords.map((k) => k.trim()),
        strengths: input.strengths.map((s) => s.trim()),
        improvements: input.improvements.map((i) => i.trim()),
        sectionFeedback: {
            summary: input.sectionFeedback.summary.trim(),
            experience: input.sectionFeedback.experience.trim(),
            skills: input.sectionFeedback.skills.trim(),
            education: input.sectionFeedback.education.trim(),
        },
        generatedResume: input.generatedResume
            ? normalizeCompanyResume(input.generatedResume)
            : undefined,
        createdAt: new Date(input.createdAt),
    };
}

// ─── Section-level normalisation helpers ─────────────────────────────────────

/** Trims all string fields of a ResumeProfile. */
function normalizeResumeProfile(input: CompanyResume["profile"]): CompanyResume["profile"] {
    return {
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        location: input.location.trim(),
        website: normalizeOptionalString(input.website),
        linkedin: normalizeOptionalString(input.linkedin),
        github: normalizeOptionalString(input.github),
        photo: normalizeOptionalString(input.photo),
    };
}

/** Trims all string fields of a WorkExperience entry. */
function normalizeWorkExperience(item: Profile["experience"][number]): Profile["experience"][number] {
    return {
        company: item.company.trim(),
        role: item.role.trim(),
        location: normalizeOptionalString(item.location),
        startDate: item.startDate.trim(),
        endDate: item.endDate.trim(),
        description: normalizeOptionalString(item.description),
        achievements: item.achievements.map((a) => a.trim()),
    };
}

/** Trims all string fields of an Education entry. */
function normalizeEducation(item: Profile["education"][number]): Profile["education"][number] {
    return {
        institution: item.institution.trim(),
        degree: item.degree.trim(),
        field: item.field.trim(),
        startDate: item.startDate.trim(),
        endDate: item.endDate.trim(),
    };
}

/** Trims all string fields of a Project entry. */
function normalizeProject(item: Profile["projects"][number]): Profile["projects"][number] {
    return {
        name: item.name.trim(),
        description: item.description.trim(),
        highlights: item.highlights.map((h) => h.trim()),
        technologies: item.technologies.map((t) => t.trim()),
        link: normalizeOptionalString(item.link),
    };
}

/** Trims all string fields of a Certification entry. */
function normalizeCertification(item: Profile["certifications"][number]): Profile["certifications"][number] {
    return {
        name: item.name.trim(),
        issuer: item.issuer.trim(),
        issueDate: item.issueDate.trim(),
        credentialId: normalizeOptionalString(item.credentialId),
    };
}

/** Trims all string fields of a LanguageSkill entry. */
function normalizeLanguageSkill(item: Profile["languages"][number]): Profile["languages"][number] {
    return {
        name: item.name.trim(),
        proficiency: item.proficiency.trim(),
    };
}

/** Returns undefined for falsy or whitespace-only strings, otherwise returns the trimmed value. */
function normalizeOptionalString(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
