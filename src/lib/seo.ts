import type { Metadata } from "next";

type BuildPageMetadataOptions = {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    noIndex?: boolean;
    category?: string;
    type?: "website" | "article";
};

export const seoConfig = {
    siteName: "localCV",
    siteUrl: "https://localcv.tusharvashishth.com",
    defaultTitle: "Free ATS-Optimized Resume Builder",
    defaultDescription:
        "Build ATS-ready resumes with a local-first, privacy-focused resume builder. Create, refine, and export role-specific resumes in minutes.",
    defaultOgImage: "/opengraph-image",
    defaultKeywords: [
        "resume builder",
        "ATS resume",
        "local-first",
        "privacy-focused",
        "AI resume maker",
        "free resume templates",
        "localCV",
    ],
    creator: "Tushar Vashishth",
    publisher: "localCV",
    locale: "en_US",
} as const;

function buildRobots(noIndex?: boolean): Metadata["robots"] {
    const index = !noIndex;

    return {
        index,
        follow: index,
        googleBot: {
            index,
            follow: index,
            "max-image-preview": "large",
            "max-video-preview": -1,
            "max-snippet": -1,
        },
    };
}

export function buildRootMetadata(): Metadata {
    const canonicalPath = "/";

    return {
        metadataBase: new URL(seoConfig.siteUrl),
        title: {
            default: `${seoConfig.defaultTitle} | ${seoConfig.siteName}`,
            template: `%s | ${seoConfig.siteName}`,
        },
        description: seoConfig.defaultDescription,
        applicationName: seoConfig.siteName,
        keywords: [...seoConfig.defaultKeywords],
        authors: [{ name: seoConfig.creator }],
        creator: seoConfig.creator,
        publisher: seoConfig.publisher,
        category: "technology",
        alternates: {
            canonical: canonicalPath,
        },
        robots: buildRobots(false),
        openGraph: {
            type: "website",
            locale: seoConfig.locale,
            siteName: seoConfig.siteName,
            title: `${seoConfig.defaultTitle} | ${seoConfig.siteName}`,
            description: seoConfig.defaultDescription,
            url: canonicalPath,
            images: [
                {
                    url: seoConfig.defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: `${seoConfig.siteName} hero preview`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${seoConfig.defaultTitle} | ${seoConfig.siteName}`,
            description: seoConfig.defaultDescription,
            images: [seoConfig.defaultOgImage],
        },
        other: {
            "theme-color": "#0f172a",
        },
    };
}

export function buildPageMetadata(
    options: BuildPageMetadataOptions,
): Metadata {
    const {
        title,
        description,
        path,
        keywords = [],
        noIndex = false,
        category = "technology",
        type = "website",
    } = options;

    return {
        title,
        description,
        category,
        keywords: [...seoConfig.defaultKeywords, ...keywords],
        alternates: {
            canonical: path,
        },
        robots: buildRobots(noIndex),
        openGraph: {
            type,
            locale: seoConfig.locale,
            siteName: seoConfig.siteName,
            title: `${title} | ${seoConfig.siteName}`,
            description,
            url: path,
            images: [
                {
                    url: seoConfig.defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: `${seoConfig.siteName} hero preview`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${seoConfig.siteName}`,
            description,
            images: [seoConfig.defaultOgImage],
        },
    };
}