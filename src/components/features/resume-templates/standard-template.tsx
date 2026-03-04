/* ****** Shared Standard Resume Template Renderer ****** */

import type React from "react";
import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";

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

function joinContact(data: ResumeTemplateData) {
  return [
    data.profile.email,
    data.profile.phone,
    data.profile.location,
    data.profile.website,
    data.profile.linkedin,
    data.profile.github,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function StandardTemplate({
  data,
  variant,
  compact = false,
  styleConfig,
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

  return (
    <article
      className={`${pageClass} ${variant.pageClassName} ${styleConfig?.fontFamily ?? ""}`}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      <header className={variant.headerClassName}>
        <h1
          className={
            compact
              ? "text-sm font-semibold"
              : "text-2xl font-semibold tracking-tight"
          }
        >
          {data.profile.fullName}
        </h1>
        {data.profile.headline && (
          <p
            className={
              compact
                ? "text-[10px] text-muted-foreground"
                : "text-sm text-muted-foreground"
            }
          >
            {data.profile.headline}
          </p>
        )}
        <p
          className={
            compact
              ? "text-[10px] text-muted-foreground"
              : "text-xs text-muted-foreground"
          }
        >
          {joinContact(data)}
        </p>
      </header>

      {data.summary && (
        <section className={`${spacingClass} mt-4`}>
          {sectionHeading(
            "Professional Summary",
            variant.headingClassName,
            accentStyle,
          )}
          <p className={`${contentTextClass} leading-relaxed`}>
            {data.summary}
          </p>
        </section>
      )}

      <div
        className={
          variant.twoColumn ? "mt-4 grid grid-cols-3 gap-6" : "mt-4 space-y-4"
        }
      >
        <div
          className={variant.twoColumn ? "col-span-2 space-y-4" : "space-y-4"}
        >
          {data.experience.length > 0 && (
            <section className={spacingClass}>
              {sectionHeading(
                "Experience",
                variant.headingClassName,
                accentStyle,
              )}
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
                    <ul
                      className={`${contentTextClass} list-disc pl-4 space-y-0.5`}
                    >
                      {item.achievements.map((point, pointIndex) => (
                        <li key={`${item.company}-ach-${pointIndex}`}>
                          {point}
                        </li>
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
          )}

          {data.education.length > 0 && (
            <section className={spacingClass}>
              {sectionHeading(
                "Education",
                variant.headingClassName,
                accentStyle,
              )}
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
          )}

          {data.projects.length > 0 && (
            <section className={spacingClass}>
              {sectionHeading(
                "Projects",
                variant.headingClassName,
                accentStyle,
              )}
              {data.projects.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className={compact ? "space-y-0.5" : "space-y-1"}
                >
                  <h3
                    className={
                      compact
                        ? "text-[10px] font-semibold"
                        : "text-xs font-semibold"
                    }
                  >
                    {item.name}
                  </h3>
                  <p className={contentTextClass}>{item.description}</p>
                  {item.highlights.length > 0 && (
                    <ul
                      className={`${contentTextClass} list-disc pl-4 space-y-0.5`}
                    >
                      {item.highlights.map((highlight, highlightIndex) => (
                        <li key={`${item.name}-highlight-${highlightIndex}`}>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        <aside
          className={variant.twoColumn ? "col-span-1 space-y-4" : "space-y-4"}
        >
          {data.skills.length > 0 && (
            <section className={spacingClass}>
              {sectionHeading("Skills", variant.headingClassName, accentStyle)}
              <p className={contentTextClass}>{data.skills.join(" · ")}</p>
            </section>
          )}

          {data.certifications.length > 0 && (
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
          )}

          {data.languages.length > 0 && (
            <section className={spacingClass}>
              {sectionHeading(
                "Languages",
                variant.headingClassName,
                accentStyle,
              )}
              <ul className={`${contentTextClass} list-disc pl-4 space-y-0.5`}>
                {data.languages.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name} · {item.proficiency}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
