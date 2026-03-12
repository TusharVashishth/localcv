import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/test"],
        },
        sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
        host: seoConfig.siteUrl,
    };
}
