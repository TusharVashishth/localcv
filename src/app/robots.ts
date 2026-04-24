import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/test", "/dashboard", "/api"],
        },
        sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
        host: seoConfig.siteUrl,
    };
}
