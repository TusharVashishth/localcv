import { buildPageMetadata } from "@/lib/seo";
import { ResumeTemplatesClient } from "../../components/features/resume-templates/resume-templates-client";

export const metadata = buildPageMetadata({
  title: "Free ATS-Friendly Resume Templates",
  description:
    "Browse and select from our library of professional, recruiter-approved, and ATS-optimized resume templates. Fully customize accent colors, fonts, margins, and section ordering locally and privately.",
  path: "/resume-templates",
  keywords: [
    "ats resume templates",
    "professional cv layouts",
    "free resume templates",
    "customizable cv template",
    "privacy-first resume maker",
    "recruiter-approved resume format",
  ],
});

const templateListingStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://localcv.tusharvashishth.com/resume-templates#webpage",
      "url": "https://localcv.tusharvashishth.com/resume-templates",
      "name": "Free ATS-Friendly Resume Templates | localCV",
      "description": "Browse and select from our library of professional, recruiter-approved, and ATS-optimized resume templates. Fully customize accent colors, fonts, margins, and section ordering locally and privately.",
    },
    {
      "@type": "ItemList",
      "name": "Professional Resume Templates Collection",
      "description": "Recruiter-approved, ATS-compliant templates designed to land interviews. Fully customizable locally.",
      "url": "https://localcv.tusharvashishth.com/resume-templates",
      "numberOfItems": 8,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Classic Template",
          "description": "Traditional corporate format used widely for business and operations roles."
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Modern Template",
          "description": "Balanced contemporary layout suitable across most industries."
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Minimal Template",
          "description": "Clean and concise template optimized for maximum ATS readability."
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Executive Template",
          "description": "Leadership-first format for management and senior leadership roles."
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Technical Template",
          "description": "Detail-focused format for engineering and technical specialist roles."
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Sidebar Color Template",
          "description": "Bold two-column layout with a vibrant colored sidebar — ideal for creative and marketing roles."
        },
        {
          "@type": "ListItem",
          "position": 7,
          "name": "With Photo Template",
          "description": "Modern template with a profile photo placeholder and colorful header band."
        },
        {
          "@type": "ListItem",
          "position": 8,
          "name": "Creative Template",
          "description": "Vibrant teal-accented layout with colorful skill tags — great for tech, startups, and design."
        }
      ]
    }
  ]
};

export default function ResumeTemplatesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(templateListingStructuredData) }}
      />
      <ResumeTemplatesClient />
    </main>
  );
}
