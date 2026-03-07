import { extractText } from "unpdf";

type SectionKey =
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages";

export interface ExtractedResumeProfile {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
}

export interface ExtractedExperience {
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string;
    achievements: string[];
}

export interface ExtractedEducation {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export interface ExtractedProject {
    name: string;
    description: string;
    highlights: string[];
    technologies: string[];
    link?: string;
}

export interface ExtractedCertification {
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
}

export interface ExtractedLanguage {
    name: string;
    proficiency: string;
}

export interface ExtractedCvData {
    profile: ExtractedResumeProfile;
    summary: string;
    experience: ExtractedExperience[];
    education: ExtractedEducation[];
    skills: string[];
    projects: ExtractedProject[];
    certifications: ExtractedCertification[];
    languages: ExtractedLanguage[];
}

const MONTH_OR_YEAR_PATTERN =
    "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\\d{4})";

const DATE_RANGE_REGEX = new RegExp(
    `(${MONTH_OR_YEAR_PATTERN}[^\\n]{0,20})\\s*(?:-|–|—|to)\\s*(Present|Current|${MONTH_OR_YEAR_PATTERN}[^\\n]{0,20})`,
    "i",
);

const SECTION_PATTERNS: Record<SectionKey, RegExp> = {
    summary:
        /^(summary|professional summary|profile|objective|about|about me)$/i,
    experience:
        /^(experience|work experience|professional experience|employment history|work history)$/i,
    education: /^(education|academic background|qualifications)$/i,
    skills:
        /^(skills|technical skills|core competencies|key skills|technologies)$/i,
    projects: /^(projects|project experience)$/i,
    certifications: /^(certifications|certificates|licenses)$/i,
    languages: /^(languages)$/i,
};

function normalizeLine(value: string): string {
    return value.replace(/\s+/g, " ").replace(/[|]+/g, " ").trim();
}

function normalizeUrlText(value: string): string {
    return value
        .replace(/\s*([./:#?=&])\s*/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
}

function removeTrailingColon(value: string): string {
    return value.replace(/:$/, "").trim();
}

function normalizeSkill(skill: string): string {
    return skill
        .replace(/^[•\-*/·]+\s*/, "")
        .replace(/[\s.]+$/g, "")
        .trim();
}

function uniqueNonEmpty<T extends string>(items: T[]): T[] {
    const seen = new Set<string>();
    const result: T[] = [];

    for (const item of items) {
        const key = item.toLowerCase().trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        result.push(item);
    }

    return result;
}

function looksLikeHeading(line: string): boolean {
    const plain = removeTrailingColon(normalizeLine(line));
    if (!plain) return false;
    if (Object.values(SECTION_PATTERNS).some((regex) => regex.test(plain))) {
        return true;
    }

    const lettersOnly = plain.replace(/[^A-Za-z]/g, "");
    const isAllCaps = lettersOnly.length > 2 && lettersOnly === lettersOnly.toUpperCase();
    return isAllCaps && plain.split(" ").length <= 4;
}

function getSectionKey(line: string): SectionKey | null {
    const plain = removeTrailingColon(normalizeLine(line));
    for (const [key, regex] of Object.entries(SECTION_PATTERNS) as [SectionKey, RegExp][]) {
        if (regex.test(plain)) return key;
    }
    return null;
}

function splitLines(text: string): string[] {
    return text
        .replace(/\r/g, "")
        .split("\n")
        .map(normalizeLine)
        .filter(Boolean);
}

function splitSections(lines: string[]): Record<SectionKey, string[]> {
    const sections: Record<SectionKey, string[]> = {
        summary: [],
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
    };

    let activeSection: SectionKey | null = null;
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const matchedSection = getSectionKey(line);
        if (matchedSection) {
            if (matchedSection === "projects") {
                const nextLines = lines.slice(index + 1, index + 4).join(" ").toLowerCase();
                const looksLikeSocialBlock = /linkedin|github/.test(nextLines);
                if (looksLikeSocialBlock) {
                    continue;
                }
            }
            activeSection = matchedSection;
            continue;
        }

        if (activeSection) {
            sections[activeSection].push(line);
        }
    }

    return sections;
}

function extractEmail(text: string): string {
    const match = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    return match?.[0] ?? "";
}

function extractPhone(text: string): string {
    const match = text.match(/(\+?[\d][\d\s\-().]{6,}\d)/);
    return match?.[0]?.trim() ?? "";
}

function extractLinkedin(text: string): string | undefined {
    const normalizedText = normalizeUrlText(text);

    const fullMatch = normalizedText.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
    if (fullMatch?.[0]) return fullMatch[0];

    const shortMatch = normalizedText.match(/(?:www\.)?linkedin\.com\/in\/([\w\-]+)/i);
    return shortMatch?.[1] ? `https://linkedin.com/in/${shortMatch[1]}` : undefined;
}

function extractGithub(text: string): string | undefined {
    const normalizedText = normalizeUrlText(text);

    const fullMatch = normalizedText.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i);
    if (fullMatch?.[0]) return fullMatch[0];

    const shortMatch = normalizedText.match(/(?:www\.)?github\.com\/([\w\-]+)/i);
    return shortMatch?.[1] ? `https://github.com/${shortMatch[1]}` : undefined;
}

function extractWebsite(text: string): string | undefined {
    const normalizedText = normalizeUrlText(text);

    const match = normalizedText.match(
        /https?:\/\/(?![^\s]*linkedin\.com)(?![^\s]*github\.com)[\w\-.]+\.[A-Za-z]{2,}(?:\/[^\s]*)?/i,
    );
    return match?.[0];
}

function isLikelyName(line: string): boolean {
    if (line.length < 3 || line.length > 60) return false;
    if (/[@\d]/.test(line)) return false;
    if (looksLikeHeading(line)) return false;

    const words = line.split(" ").filter(Boolean);
    if (words.length < 2 || words.length > 5) return false;
    return words.every((word) => /^[A-Z][a-zA-Z'`.-]+$/.test(word));
}

function extractName(lines: string[]): string {
    const candidate = lines.find(isLikelyName);
    return candidate ?? "";
}

function extractLocation(lines: string[], fullText: string): string {
    const email = extractEmail(fullText);
    const phone = extractPhone(fullText);

    const contactLine = lines.find((line) => line.includes("@") || /\+?\d{7,}/.test(line));
    if (contactLine) {
        const cleaned = contactLine
            .replace(email, "")
            .replace(phone, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        const parts = cleaned
            .split(/\s{2,}|\s\|\s|,/)
            .map((part) => part.trim())
            .filter(Boolean);
        const maybeLocation = parts.find((part) => /[A-Za-z]/.test(part) && part.length >= 3);
        if (maybeLocation) return maybeLocation;
    }

    const locationMatch = fullText.match(/\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2}),\s*([A-Z][a-zA-Z]+)\b/);
    return locationMatch ? `${locationMatch[1]}, ${locationMatch[2]}` : "";
}

function extractSummary(lines: string[], sections: Record<SectionKey, string[]>): string {
    const summaryFromSection = sections.summary.join(" ").trim();
    if (summaryFromSection.length >= 20) return summaryFromSection.slice(0, 700);

    const firstHeadingIndex = lines.findIndex(looksLikeHeading);
    const openingLines = (firstHeadingIndex > 0 ? lines.slice(0, firstHeadingIndex) : lines.slice(0, 8)).filter(
        (line) => !isLikelyName(line) && !line.includes("@") && !DATE_RANGE_REGEX.test(line),
    );

    return openingLines.join(" ").slice(0, 700);
}

function inferHeadline(summary: string, lines: string[]): string {
    const summarySentence = summary.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (summarySentence && summarySentence.length >= 12) {
        return summarySentence.slice(0, 140);
    }

    const headlineLine = lines.find((line) => {
        if (looksLikeHeading(line)) return false;
        if (line.includes("@") || DATE_RANGE_REGEX.test(line)) return false;
        return line.length >= 10 && line.length <= 140;
    });

    return headlineLine ?? "";
}

function parseSkills(skillsLines: string[], fullText: string): string[] {
    const pool = skillsLines.length
        ? skillsLines.join(",")
        : fullText.match(/\b(?:JavaScript|TypeScript|Node|React|Next\.js|AWS|Docker|SQL|Python|Laravel|Redis|Prisma)\b[^\n]*/i)?.[0] ?? "";

    const tokens = pool
        .split(/[\n,|/·•]+/)
        .map((token) => normalizeSkill(token))
        .filter((token) => token.length >= 2 && token.length <= 40);

    return uniqueNonEmpty(tokens).slice(0, 60);
}

function isNoiseLine(line: string): boolean {
    const lower = line.toLowerCase();
    if (looksLikeHeading(line)) return true;
    if (line.includes("@") || line.includes("linkedin") || line.includes("github")) return true;
    if (DATE_RANGE_REGEX.test(line)) return true;
    return lower === "projects" || lower === "skills" || lower === "education";
}

function parseExperience(lines: string): ExtractedExperience[] {
    const rawLines = splitLines(lines);
    const entries: ExtractedExperience[] = [];

    for (let index = 0; index < rawLines.length; index += 1) {
        const currentLine = rawLines[index];
        const dateMatch = currentLine.match(DATE_RANGE_REGEX);
        if (!dateMatch) continue;

        const startDate = (dateMatch[1] ?? "").trim();
        const endDate = (dateMatch[2] ?? "").trim() || "Present";

        let company = "";
        for (let lookback = index - 1; lookback >= Math.max(0, index - 4); lookback -= 1) {
            const candidate = rawLines[lookback];
            if (!isNoiseLine(candidate) && candidate.length <= 80) {
                company = candidate;
                break;
            }
        }

        let role = "";
        for (let lookahead = index + 1; lookahead <= Math.min(rawLines.length - 1, index + 3); lookahead += 1) {
            const candidate = rawLines[lookahead];
            if (!isNoiseLine(candidate) && !candidate.startsWith("•") && candidate.length <= 100) {
                role = candidate;
                break;
            }
        }

        const entryLines: string[] = [];
        for (let cursor = index + 1; cursor < rawLines.length; cursor += 1) {
            const line = rawLines[cursor];
            if (DATE_RANGE_REGEX.test(line)) break;
            if (looksLikeHeading(line)) break;
            entryLines.push(line);
            if (entryLines.length > 12) break;
        }

        const achievements = uniqueNonEmpty(
            entryLines
                .filter((line) => line.startsWith("•") || line.startsWith("-") || line.length > 40)
                .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
                .filter((line) => line.length > 8),
        ).slice(0, 8);

        const description = entryLines
            .filter((line) => !line.startsWith("•") && !line.startsWith("-"))
            .join(" ")
            .slice(0, 400)
            .trim();

        if (!company && !role) continue;

        entries.push({
            company: company || "Unknown Company",
            role: role || "Software Engineer",
            startDate: startDate || "Unknown",
            endDate: endDate || "Present",
            description: description || undefined,
            achievements,
        });
    }

    return uniqueExperience(entries).slice(0, 8);
}

function uniqueExperience(entries: ExtractedExperience[]): ExtractedExperience[] {
    const seen = new Set<string>();
    const result: ExtractedExperience[] = [];

    for (const entry of entries) {
        const key = `${entry.company}-${entry.role}-${entry.startDate}-${entry.endDate}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(entry);
    }

    return result;
}

function parseEducation(lines: string[]): ExtractedEducation[] {
    if (!lines.length) return [];

    const entries: ExtractedEducation[] = [];
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const dateMatch = line.match(/(\d{4})\s*(?:-|–|—|to)\s*(\d{4}|Present|Current)/i);
        if (!dateMatch) continue;

        const institution = lines[index - 2] ?? lines[index - 1] ?? "";
        const degree = lines[index - 1] ?? "";
        const field = lines[index + 1] ?? degree;
        entries.push({
            institution: institution || "Unknown Institution",
            degree: degree || "Degree",
            field: field || "Field",
            startDate: dateMatch[1],
            endDate: dateMatch[2],
        });
    }

    return entries.slice(0, 4);
}

function parseProjects(lines: string[], skills: string[]): ExtractedProject[] {
    if (!lines.length) return [];
    if (lines.some((line) => DATE_RANGE_REGEX.test(line))) return [];

    const projects: ExtractedProject[] = [];
    let index = 0;
    while (index < lines.length) {
        const line = lines[index];
        const isTitle = line.length >= 3 && line.length <= 80 && !DATE_RANGE_REGEX.test(line) && !line.includes("@");

        if (!isTitle) {
            index += 1;
            continue;
        }

        const detailLines: string[] = [];
        let cursor = index + 1;
        while (cursor < lines.length) {
            const candidate = lines[cursor];
            const nextLooksLikeTitle =
                candidate.length <= 80 && !candidate.startsWith("•") && !DATE_RANGE_REGEX.test(candidate) && cursor > index + 1;
            if (nextLooksLikeTitle) break;
            if (looksLikeHeading(candidate)) break;
            detailLines.push(candidate.replace(/^[•\-*]\s*/, "").trim());
            if (detailLines.length >= 5) break;
            cursor += 1;
        }

        const description = detailLines.join(" ").trim();
        const hasProjectSignal =
            /project|built|developed|created|implemented|application|platform|tool/i.test(line) ||
            /built|developed|created|implemented|application|platform|tool/i.test(description);
        if (!hasProjectSignal) {
            index = Math.max(cursor, index + 1);
            continue;
        }

        const technologies = uniqueNonEmpty(
            skills.filter((skill) => new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(description)),
        ).slice(0, 8);

        projects.push({
            name: line,
            description: description || "Project details extracted from CV.",
            highlights: detailLines.slice(0, 4),
            technologies,
        });

        index = Math.max(cursor, index + 1);
    }

    return projects.slice(0, 6);
}

function parseCertifications(lines: string[]): ExtractedCertification[] {
    return lines
        .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter((line) => line.length >= 4)
        .slice(0, 8)
        .map((line) => ({
            name: line,
            issuer: "Not specified",
            issueDate: "Not specified",
        }));
}

function parseLanguages(lines: string[]): ExtractedLanguage[] {
    return lines
        .flatMap((line) => line.split(/[|,]/))
        .map((token) => token.trim())
        .filter(Boolean)
        .slice(0, 8)
        .map((name) => ({
            name,
            proficiency: "Professional",
        }));
}

function inferIndustry(skills: string[], summary: string): string {
    const haystack = `${skills.join(" ")} ${summary}`.toLowerCase();
    if (/(fintech|payments?|banking)/.test(haystack)) return "Fintech";
    if (/(health|doctor|medical|hospital)/.test(haystack)) return "Healthcare";
    if (/(e-?commerce|retail)/.test(haystack)) return "E-commerce";
    if (/(saas|b2b|enterprise)/.test(haystack)) return "SaaS";
    return "General";
}

function inferTargetRole(
    headline: string,
    summary: string,
    experience: ExtractedExperience[],
): string {
    if (experience[0]?.role) return experience[0].role;
    if (headline) return headline.split(",")[0].slice(0, 80).trim();

    const roleMatch = summary.match(
        /(Tech Lead|Engineering Manager|Software Engineer|Full[-\s]?Stack Developer|Backend Engineer|Frontend Engineer)/i,
    );
    return roleMatch?.[0] ?? "Software Engineer";
}

function pickExperienceText(
    sections: Record<SectionKey, string[]>,
    allLines: string[],
): string {
    if (sections.experience.length > 0) return sections.experience.join("\n");

    const startIndex = allLines.findIndex((line) =>
        /experience|employment|work history/i.test(line),
    );
    if (startIndex === -1) return allLines.join("\n");

    const endIndex = allLines.findIndex(
        (line, index) => index > startIndex && /education|skills|projects|certifications|languages/i.test(line),
    );
    const sliceEnd = endIndex === -1 ? allLines.length : endIndex;
    return allLines.slice(startIndex + 1, sliceEnd).join("\n");
}

export function parsePdfDataUrl(fileDataUrl: string): Buffer {
    const base64Payload = fileDataUrl.split(",")[1];
    return Buffer.from(base64Payload, "base64");
}

export async function extractTextFromPdfBuffer(pdfBuffer: Buffer): Promise<string> {
    const { text: extractedText } = await extractText(new Uint8Array(pdfBuffer));
    const textContent = Array.isArray(extractedText)
        ? extractedText.join("\n")
        : (extractedText ?? "");
    return textContent.trim();
}

export function extractCvDataFromText(text: string): ExtractedCvData {
    const lines = splitLines(text);
    const sections = splitSections(lines);

    const summary = extractSummary(lines, sections);
    const skills = parseSkills(sections.skills, text);
    const experienceFromSection = parseExperience(pickExperienceText(sections, lines));
    const experienceFromWholeText = parseExperience(lines.join("\n"));
    const experience =
        experienceFromSection.length > 0
            ? experienceFromSection
            : experienceFromWholeText;
    const education = parseEducation(sections.education);
    const projects = parseProjects(sections.projects, skills);
    const certifications = parseCertifications(sections.certifications);
    const languages = parseLanguages(sections.languages);

    const profile: ExtractedResumeProfile = {
        fullName: extractName(lines),
        email: extractEmail(text),
        phone: extractPhone(text),
        location: extractLocation(lines, text),
        website: extractWebsite(text),
        linkedin: extractLinkedin(text),
        github: extractGithub(text),
    };

    return {
        profile,
        summary,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages,
    };
}

export async function extractCvDataFromPdfDataUrl(
    fileDataUrl: string,
): Promise<{ rawText: string; extracted: ExtractedCvData }> {
    const pdfBuffer = parsePdfDataUrl(fileDataUrl);
    const rawText = await extractTextFromPdfBuffer(pdfBuffer);
    const extracted = extractCvDataFromText(rawText);
    return { rawText, extracted };
}
