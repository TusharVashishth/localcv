import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: `${seoConfig.siteUrl}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${seoConfig.siteUrl}/dashboard`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${seoConfig.siteUrl}/dashboard/builder`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${seoConfig.siteUrl}/dashboard/profile`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${seoConfig.siteUrl}/dashboard/company-resumes`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${seoConfig.siteUrl}/dashboard/ats-scorer`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];
}
