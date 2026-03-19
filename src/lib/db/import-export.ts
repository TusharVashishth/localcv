/* ****** Local Data Import/Export Utilities ****** */

import { z } from "zod";
import { db } from "./index";
import type { AIConfig, CompanyResume, Profile } from "./schema";

const dateSchema = z
    .union([z.string().datetime(), z.date()])
    .transform((value) => (value instanceof Date ? value : new Date(value)));

const optionalStringSchema = z.string().optional();

const aiConfigSchema = z
    .object({
        provider: z.string().trim().min(1),
        modelName: z.string().trim().min(1),
        encryptedApiKey: z.string().trim().min(1),
        createdAt: dateSchema,
        updatedAt: dateSchema,
    })
    .strict();

const profileSchema = z
    .object({
        profile: z
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
            .strict(),
        summary: z.string(),
        experience: z.array(
            z
                .object({
                    company: z.string(),
                    role: z.string(),
                    location: optionalStringSchema,
                    startDate: z.string(),
                    endDate: z.string(),
                    description: optionalStringSchema,
                    achievements: z.array(z.string()),
                })
                .strict(),
        ),
        education: z.array(
            z
                .object({
                    institution: z.string(),
                    degree: z.string(),
                    field: z.string(),
                    startDate: z.string(),
                    endDate: z.string(),
                })
                .strict(),
        ),
        skills: z.array(z.string()),
        projects: z.array(
            z
                .object({
                    name: z.string(),
                    description: z.string(),
                    highlights: z.array(z.string()),
                    technologies: z.array(z.string()),
                    link: optionalStringSchema,
                })
                .strict(),
        ),
        certifications: z.array(
            z
                .object({
                    name: z.string(),
                    issuer: z.string(),
                    issueDate: z.string(),
                    credentialId: optionalStringSchema,
                })
                .strict(),
        ),
        languages: z.array(
            z
                .object({
                    name: z.string(),
                    proficiency: z.string(),
                })
                .strict(),
        ),
        createdAt: dateSchema,
        updatedAt: dateSchema,
    })
    .strict();

const localDataPayloadSchema = z
    .object({
        version: z.union([z.literal(1), z.literal(2)]),
        exportedAt: z.string().datetime(),
        aiConfigs: z.array(aiConfigSchema),
        profiles: z.array(profileSchema),
        companyResumes: z
            .array(
                z
                    .object({
                        companyName: z.string().trim().min(1),
                        jobDescription: z.string(),
                        profile: z
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
                            .strict(),
                        summary: z.string(),
                        experience: z.array(
                            z
                                .object({
                                    company: z.string(),
                                    role: z.string(),
                                    location: optionalStringSchema,
                                    startDate: z.string(),
                                    endDate: z.string(),
                                    description: optionalStringSchema,
                                    achievements: z.array(z.string()),
                                })
                                .strict(),
                        ),
                        education: z.array(
                            z
                                .object({
                                    institution: z.string(),
                                    degree: z.string(),
                                    field: z.string(),
                                    startDate: z.string(),
                                    endDate: z.string(),
                                })
                                .strict(),
                        ),
                        skills: z.array(z.string()),
                        projects: z.array(
                            z
                                .object({
                                    name: z.string(),
                                    description: z.string(),
                                    highlights: z.array(z.string()),
                                    technologies: z.array(z.string()),
                                    link: optionalStringSchema,
                                })
                                .strict(),
                        ),
                        certifications: z.array(
                            z
                                .object({
                                    name: z.string(),
                                    issuer: z.string(),
                                    issueDate: z.string(),
                                    credentialId: optionalStringSchema,
                                })
                                .strict(),
                        ),
                        languages: z.array(
                            z
                                .object({
                                    name: z.string(),
                                    proficiency: z.string(),
                                })
                                .strict(),
                        ),
                        createdAt: dateSchema,
                        updatedAt: dateSchema,
                    })
                    .strict(),
            )
            .optional()
            .default([]),
    })
    .strict();

export type LocalDataPayload = z.infer<typeof localDataPayloadSchema>;

export async function createLocalDataExport(): Promise<LocalDataPayload> {
    const [aiConfigs, profiles, companyResumes] = await Promise.all([
        db.aiConfigs.toArray(),
        db.profiles.toArray(),
        db.companyResumes.toArray(),
    ]);

    return {
        version: 2,
        exportedAt: new Date().toISOString(),
        aiConfigs: aiConfigs.map((item) => normalizeAiConfig(item)),
        profiles: profiles.map((item) => normalizeProfile(item)),
        companyResumes: companyResumes.map((item) => normalizeCompanyResume(item)),
    };
}

export function parseLocalDataImport(raw: unknown): LocalDataPayload {
    return localDataPayloadSchema.parse(raw);
}

export async function importLocalData(raw: unknown): Promise<void> {
    const parsed = parseLocalDataImport(raw);

    await db.transaction("rw", db.aiConfigs, db.profiles, db.companyResumes, async () => {
        await db.aiConfigs.clear();
        await db.profiles.clear();
        await db.companyResumes.clear();

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
    });
}

function normalizeAiConfig(input: Omit<AIConfig, "id">): Omit<AIConfig, "id"> {
    return {
        provider: input.provider.trim(),
        modelName: input.modelName.trim(),
        encryptedApiKey: input.encryptedApiKey.trim(),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}

function normalizeProfile(input: Omit<Profile, "id">): Omit<Profile, "id"> {
    return {
        profile: {
            fullName: input.profile.fullName.trim(),
            email: input.profile.email.trim(),
            phone: input.profile.phone.trim(),
            location: input.profile.location.trim(),
            website: normalizeOptionalString(input.profile.website),
            linkedin: normalizeOptionalString(input.profile.linkedin),
            github: normalizeOptionalString(input.profile.github),
            photo: normalizeOptionalString(input.profile.photo),
        },
        summary: input.summary.trim(),
        experience: input.experience.map((item) => ({
            company: item.company.trim(),
            role: item.role.trim(),
            location: normalizeOptionalString(item.location),
            startDate: item.startDate.trim(),
            endDate: item.endDate.trim(),
            description: normalizeOptionalString(item.description),
            achievements: item.achievements.map((achievement) => achievement.trim()),
        })),
        education: input.education.map((item) => ({
            institution: item.institution.trim(),
            degree: item.degree.trim(),
            field: item.field.trim(),
            startDate: item.startDate.trim(),
            endDate: item.endDate.trim(),
        })),
        skills: input.skills.map((skill) => skill.trim()),
        projects: input.projects.map((item) => ({
            name: item.name.trim(),
            description: item.description.trim(),
            highlights: item.highlights.map((highlight) => highlight.trim()),
            technologies: item.technologies.map((technology) => technology.trim()),
            link: normalizeOptionalString(item.link),
        })),
        certifications: input.certifications.map((item) => ({
            name: item.name.trim(),
            issuer: item.issuer.trim(),
            issueDate: item.issueDate.trim(),
            credentialId: normalizeOptionalString(item.credentialId),
        })),
        languages: input.languages.map((item) => ({
            name: item.name.trim(),
            proficiency: item.proficiency.trim(),
        })),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}

function normalizeOptionalString(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeCompanyResume(input: Omit<CompanyResume, "id">): Omit<CompanyResume, "id"> {
    return {
        companyName: input.companyName.trim(),
        jobDescription: input.jobDescription.trim(),
        profile: {
            fullName: input.profile.fullName.trim(),
            email: input.profile.email.trim(),
            phone: input.profile.phone.trim(),
            location: input.profile.location.trim(),
            website: normalizeOptionalString(input.profile.website),
            linkedin: normalizeOptionalString(input.profile.linkedin),
            github: normalizeOptionalString(input.profile.github),
            photo: normalizeOptionalString(input.profile.photo),
        },
        summary: input.summary.trim(),
        experience: input.experience.map((item) => ({
            company: item.company.trim(),
            role: item.role.trim(),
            location: normalizeOptionalString(item.location),
            startDate: item.startDate.trim(),
            endDate: item.endDate.trim(),
            description: normalizeOptionalString(item.description),
            achievements: item.achievements.map((a) => a.trim()),
        })),
        education: input.education.map((item) => ({
            institution: item.institution.trim(),
            degree: item.degree.trim(),
            field: item.field.trim(),
            startDate: item.startDate.trim(),
            endDate: item.endDate.trim(),
        })),
        skills: input.skills.map((s) => s.trim()),
        projects: input.projects.map((item) => ({
            name: item.name.trim(),
            description: item.description.trim(),
            highlights: item.highlights.map((h) => h.trim()),
            technologies: item.technologies.map((t) => t.trim()),
            link: normalizeOptionalString(item.link),
        })),
        certifications: input.certifications.map((item) => ({
            name: item.name.trim(),
            issuer: item.issuer.trim(),
            issueDate: item.issueDate.trim(),
            credentialId: normalizeOptionalString(item.credentialId),
        })),
        languages: input.languages.map((item) => ({
            name: item.name.trim(),
            proficiency: item.proficiency.trim(),
        })),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
    };
}
