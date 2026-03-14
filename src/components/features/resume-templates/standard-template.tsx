/* ****** Shared Standard Resume Template Renderer ****** */

import type React from "react";
import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";
import {
  getRenderableSectionOrder,
  type ResumeSectionKey,
} from "./section-order";

interface TemplateVariant {
  pageClassName: string;
  headerClassName: string;
  headingClassName: string;
  twoColumn: boolean;
  dense: boolean;
}

interface StandardTemplateProps {
  data: ResumeTemplateData;
  variant: TemplateVariant;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
  sectionOrder?: ResumeSectionKey[];
}

function sectionHeading(
  title: string,
  className: string,
  style?: React.CSSProperties,
) {
  return (
    <h2 className={className} style={style}>
      {title}
    </h2>
  );
}

function ContactLink({ url, label }: { url?: string; label: string }) {
  if (!url) return null;
  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {label}
    </a>
  );
}

function ContactDetails({
  data,
  className,
}: {
  data: ResumeTemplateData;
  className: string;
}) {
  const parts: React.ReactNode[] = [];

  if (data.profile.email)
    parts.push(
      <a
        href={`mailto:${data.profile.email}`}
        className="hover:underline"
        key="email"
      >
        {data.profile.email}
      </a>,
    );
  if (data.profile.phone)
    parts.push(<span key="phone">{data.profile.phone}</span>);
  if (data.profile.location)
    parts.push(<span key="location">{data.profile.location}</span>);
  if (data.profile.website)
    parts.push(
      <ContactLink url={data.profile.website} label="Website" key="website" />,
    );
  if (data.profile.linkedin)
    parts.push(
      <ContactLink
        url={data.profile.linkedin}
        label="LinkedIn"
        key="linkedin"
      />,
    );
  if (data.profile.github)
    parts.push(
      <ContactLink url={data.profile.github} label="GitHub" key="github" />,
    );

  return (
    <p className={className}>
      {parts.reduce((prev, curr) => [prev, " · ", curr] as never)}
    </p>
  );
}

export function StandardTemplate({
  data,
  variant,
  compact = false,
  styleConfig,
  sectionOrder,
}: StandardTemplateProps) {
  const spacingClass = compact
    ? "space-y-2"
    : variant.dense
      ? "space-y-3"
      : "space-y-4";

  /* ****** Apply fontSize from styleConfig ****** */
  const fsMap = { small: "text-[10px]", medium: "text-xs", large: "text-sm" };
  const contentTextClass = compact
    ? "text-[10px]"
    : fsMap[styleConfig?.fontSize ?? "medium"];

  const pageClass = compact
    ? "w-full h-full bg-background text-foreground border border-border rounded-md p-3 overflow-hidden"
    : "resume-page bg-background text-foreground max-w-[210mm] min-h-[297mm] mx-auto p-8 print:p-6";

  const accentStyle = styleConfig?.accentColor
    ? { color: styleConfig.accentColor }
    : {};

  const orderedSections = getRenderableSectionOrder(data, sectionOrder);

  const sectionRenderers: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section className={spacingClass}>
        {sectionHeading(
          "Professional Summary",
          variant.headingClassName,
          accentStyle,
        )}
        <p className={`${contentTextClass} leading-relaxed`}>{data.summary}</p>
      </section>
    ),
    experience: (
      <section className={spacingClass}>
        {sectionHeading("Experience", variant.headingClassName, accentStyle)}
        {data.experience.map((item, index) => (
          <div
            key={`${item.company}-${index}`}
            className={compact ? "space-y-1" : "space-y-1.5"}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className={
                  compact
                    ? "text-[10px] font-semibold"
                    : "text-xs font-semibold"
                }
              >
                {item.role}
              </h3>
              <span
                className={
                  compact
                    ? "text-[9px] text-muted-foreground"
                    : "text-xs text-muted-foreground"
                }
              >
                {item.startDate} - {item.endDate}
              </span>
            </div>
            <p
              className={
                compact
                  ? "text-[10px] text-muted-foreground"
                  : "text-xs text-muted-foreground"
              }
            >
              {[item.company, item.location].filter(Boolean).join(" · ")}
            </p>
            {item.achievements.length > 0 ? (
              <ul className={`${contentTextClass} list-disc pl-4 space-y-0.5`}>
                {item.achievements.map((point, pointIndex) => (
                  <li key={`${item.company}-ach-${pointIndex}`}>{point}</li>
                ))}
              </ul>
            ) : (
              item.description && (
                <p className={contentTextClass}>{item.description}</p>
              )
            )}
          </div>
        ))}
      </section>
    ),
    education: (
      <section className={spacingClass}>
        {sectionHeading("Education", variant.headingClassName, accentStyle)}
        {data.education.map((item, index) => (
          <div
            key={`${item.institution}-${index}`}
            className={compact ? "space-y-0.5" : "space-y-1"}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className={
                  compact
                    ? "text-[10px] font-semibold"
                    : "text-xs font-semibold"
                }
              >
                {item.degree} in {item.field}
              </h3>
              <span
                className={
                  compact
                    ? "text-[9px] text-muted-foreground"
                    : "text-xs text-muted-foreground"
                }
              >
                {item.startDate} - {item.endDate}
              </span>
            </div>
            <p
              className={
                compact
                  ? "text-[10px] text-muted-foreground"
                  : "text-xs text-muted-foreground"
              }
            >
              {item.institution}
            </p>
          </div>
        ))}
      </section>
    ),
    skills: (
      <section className={spacingClass}>
        {sectionHeading("Skills", variant.headingClassName, accentStyle)}
        <p className={contentTextClass}>{data.skills.join(" · ")}</p>
      </section>
    ),
    projects: (
      <section className={spacingClass}>
        {sectionHeading("Projects", variant.headingClassName, accentStyle)}
        {data.projects.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={compact ? "space-y-0.5" : "space-y-1"}
          >
            <h3
              className={
                compact ? "text-[10px] font-semibold" : "text-xs font-semibold"
              }
            >
              {item.name}{" "}
              {item.link && (
                <a
                  href={
                    item.link.startsWith("http")
                      ? item.link
                      : `https://${item.link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-muted-foreground hover:underline "
                >
                  (Link)
                </a>
              )}
            </h3>
            <p className={contentTextClass}>{item.description}</p>
            {item.technologies.length > 0 && (
              <>
                <span
                  className={
                    compact
                      ? "text-[10px] font-semibold"
                      : "text-xs font-semibold"
                  }
                >
                  Technologies :-
                </span>
                <span className={contentTextClass}>
                  {item.technologies.join(", ")}
                </span>
              </>
            )}
            {item.highlights.length > 0 && (
              <>
                <br />
                <span
                  className={
                    compact
                      ? "text-[10px] font-semibold"
                      : "text-xs font-semibold"
                  }
                >
                  Highlights :-
                </span>
                <ul
                  className={`${contentTextClass} list-disc pl-4 space-y-0.5`}
                >
                  {item.highlights.map((highlight, highlightIndex) => (
                    <li key={`${item.name}-highlight-${highlightIndex}`}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </section>
    ),
    certifications: (
      <section className={spacingClass}>
        {sectionHeading(
          "Certifications",
          variant.headingClassName,
          accentStyle,
        )}
        <ul className={`${contentTextClass} list-disc pl-4 space-y-0.5`}>
          {data.certifications.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              {item.name} · {item.issuer} ({item.issueDate})
            </li>
          ))}
        </ul>
      </section>
    ),
    languages: (
      <section className={spacingClass}>
        {sectionHeading("Languages", variant.headingClassName, accentStyle)}
        <ul className={`${contentTextClass} list-disc pl-4 space-y-0.5`}>
          {data.languages.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              {item.name} · {item.proficiency}
            </li>
          ))}
        </ul>
      </section>
    ),
  };

  const mainSections = variant.twoColumn
    ? orderedSections.slice(0, Math.min(4, orderedSections.length))
    : orderedSections;
  const asideSections = variant.twoColumn
    ? orderedSections.slice(Math.min(4, orderedSections.length))
    : [];

  return (
    <article
      className={`${pageClass} ${variant.pageClassName} ${styleConfig?.fontFamily ?? ""}`}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      <header className={variant.headerClassName}>
        <h1
          style={accentStyle}
          className={
            compact
              ? "text-sm font-semibold"
              : "text-2xl font-semibold tracking-tight"
          }
        >
          {data.profile.fullName}
        </h1>
        <ContactDetails
          data={data}
          className={
            compact
              ? "text-[10px] text-muted-foreground"
              : "text-xs text-muted-foreground"
          }
        />
      </header>

      <div
        className={
          variant.twoColumn ? "mt-4 grid grid-cols-3 gap-6" : "mt-4 space-y-4"
        }
      >
        <div
          className={variant.twoColumn ? "col-span-2 space-y-4" : "space-y-4"}
        >
          {mainSections.map((section) => (
            <div key={section}>{sectionRenderers[section]}</div>
          ))}
        </div>

        <aside
          className={variant.twoColumn ? "col-span-1 space-y-4" : "space-y-4"}
        >
          {asideSections.map((section) => (
            <div key={section}>{sectionRenderers[section]}</div>
          ))}
        </aside>
      </div>
    </article>
  );
}
