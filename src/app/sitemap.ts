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
    ];
}
