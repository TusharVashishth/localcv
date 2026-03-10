/* ****** Creative Colorful Resume Template ****** */

import type {
  ResumeSectionKey,
  ResumeTemplateData,
  ResumeTemplateComponentProps,
} from "./index";
import type { ResumeStyleConfig } from "./types";
import { getRenderableSectionOrder } from "./section-order";

interface CreativeTemplateProps extends ResumeTemplateComponentProps {
  data: ResumeTemplateData;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
  sectionOrder?: ResumeSectionKey[];
}

function ContactLink({
  url,
  label,
  className,
}: {
  url?: string;
  label: string;
  className?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:underline ${className || ""}`}
    >
      {label}
    </a>
  );
}

function ContactDetailsList({
  data,
  className,
}: {
  data: ResumeTemplateData;
  className: string;
}) {
  return (
    <div className="flex space-x-4">
      {data.profile.email && (
        <p className={className}>
          <a href={`mailto:${data.profile.email}`} className="hover:underline">
            {data.profile.email}
          </a>
        </p>
      )}
      {data.profile.phone && <p className={className}>{data.profile.phone}</p>}
      {data.profile.location && (
        <p className={className}>{data.profile.location}</p>
      )}
      {data.profile.website && (
        <p className={className}>
          <ContactLink url={data.profile.website} label="Website" />
        </p>
      )}
      {data.profile.linkedin && (
        <p className={className}>
          <ContactLink url={data.profile.linkedin} label="LinkedIn" />
        </p>
      )}
      {data.profile.github && (
        <p className={className}>
          <ContactLink url={data.profile.github} label="GitHub" />
        </p>
      )}
    </div>
  );
}

function SectionTitle({
  title,
  accentColor,
  compact,
}: {
  title: string;
  accentColor: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-2 mb-2"
          : "flex items-center gap-3 mb-3"
      }
    >
      <div
        className={compact ? "w-1 rounded-full h-4" : "w-1.5 rounded-full h-5"}
        style={{ backgroundColor: accentColor }}
      />
      <h2
        className={
          compact
            ? "text-[9px] font-bold uppercase tracking-widest"
            : "text-xs font-bold uppercase tracking-widest"
        }
        style={{ color: accentColor }}
      >
        {title}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: `${accentColor}30` }}
      />
    </div>
  );
}

export function CreativeTemplate({
  data,
  compact = false,
  styleConfig,
  sectionOrder,
}: CreativeTemplateProps) {
  const accentColor = styleConfig?.accentColor ?? "#0d9488";
  const fontFamily = styleConfig?.fontFamily ?? "font-sans";
  /* ****** Apply fontSize from styleConfig ****** */
  const fsMap = { small: "text-[10px]", medium: "text-xs", large: "text-sm" };
  const contentTextSize = compact
    ? "text-[9px]"
    : fsMap[styleConfig?.fontSize ?? "medium"];

  const orderedSections = getRenderableSectionOrder(data, sectionOrder);
  const leftSections = orderedSections.slice(
    0,
    Math.min(4, orderedSections.length),
  );
  const rightSections = orderedSections.slice(
    Math.min(4, orderedSections.length),
  );

  const pageClass = compact
    ? `w-full h-full overflow-hidden rounded-md border bg-background ${fontFamily}`
    : `bg-background max-w-[210mm] min-h-[297mm] mx-auto p-8 ${fontFamily}`;

  function renderSection(section: ResumeSectionKey) {
    switch (section) {
      case "summary":
        return (
          <section>
            <SectionTitle
              title="About Me"
              accentColor={accentColor}
              compact={compact}
            />
            <p
              className={`${contentTextSize} text-foreground leading-relaxed`}
              style={{
                borderLeft: `3px solid ${accentColor}30`,
                paddingLeft: compact ? "8px" : "12px",
              }}
            >
              {data.summary}
            </p>
          </section>
        );
      case "experience":
        return (
          <section>
            <SectionTitle
              title="Experience"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  className={compact ? "pl-2 space-y-0.5" : "pl-3 space-y-1"}
                  style={{ borderLeft: `2px solid ${accentColor}35` }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`${contentTextSize} font-bold text-foreground`}
                    >
                      {exp.role}
                    </h3>
                    <span
                      className={
                        compact
                          ? "text-[8px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded-full"
                          : "text-[10px] font-medium whitespace-nowrap px-2 py-0.5 rounded-full"
                      }
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p
                    className={`${contentTextSize} font-medium`}
                    style={{ color: accentColor }}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(" · ")}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul
                      className={`${contentTextSize} list-disc pl-4 space-y-0.5 text-foreground`}
                    >
                      {exp.achievements.map((ach, j) => (
                        <li key={j}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section>
            <SectionTitle
              title="Projects"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="space-y-2">
              {data.projects.map((proj, i) => (
                <div
                  key={i}
                  className={compact ? "p-1.5 rounded" : "p-2.5 rounded-md"}
                  style={{
                    backgroundColor: `${accentColor}08`,
                    border: `1px solid ${accentColor}20`,
                  }}
                >
                  <h3
                    className={`${contentTextSize} font-bold text-foreground`}
                  >
                    {proj.name}
                  </h3>
                  <p
                    className={`${contentTextSize} text-muted-foreground mt-0.5`}
                  >
                    {proj.description}
                  </p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech, j) => (
                        <span
                          key={j}
                          className="text-[8px] px-1 py-0.5 rounded"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            color: accentColor,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return (
          <section>
            <SectionTitle
              title="Skills"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className={
                    compact
                      ? "text-[8px] px-1.5 py-0.5 rounded-full"
                      : "text-[10px] px-2 py-0.5 rounded-full"
                  }
                  style={{
                    backgroundColor: accentColor,
                    color: "#ffffff",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );
      case "education":
        return (
          <section>
            <SectionTitle
              title="Education"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div
                  key={i}
                  className={compact ? "p-1 rounded" : "p-2 rounded"}
                  style={{ backgroundColor: `${accentColor}10` }}
                >
                  <p
                    className={`${contentTextSize} font-semibold text-foreground`}
                  >
                    {edu.degree} in {edu.field}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {edu.institution}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return (
          <section>
            <SectionTitle
              title="Certifications"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="space-y-1.5">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <p
                    className={`${contentTextSize} font-semibold text-foreground`}
                  >
                    {cert.name}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {cert.issuer} · {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "languages":
        return (
          <section>
            <SectionTitle
              title="Languages"
              accentColor={accentColor}
              compact={compact}
            />
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span
                    className={`${contentTextSize} font-medium text-foreground`}
                  >
                    {lang.name}
                  </span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      color: accentColor,
                    }}
                  >
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  }

  return (
    <article
      className={pageClass}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      <header className={compact ? "px-3 pt-3 pb-2" : "pb-5"}>
        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <h1
              className={
                compact
                  ? "text-base font-extrabold leading-tight"
                  : "text-3xl font-extrabold leading-tight"
              }
              style={{ color: accentColor }}
            >
              {data.profile.fullName}
            </h1>
          </div>

          <div
            className={
              compact
                ? "text-[8px] space-y-0.5 p-1.5 rounded "
                : "text-[10px] space-y-1 p-3 rounded-md "
            }
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <ContactDetailsList
              data={data}
              className="text-muted-foreground text-xs"
            />
          </div>
        </div>

        <div
          className={
            compact
              ? "h-0.5 w-full rounded-full mt-2"
              : "h-1 w-full rounded-full mt-4"
          }
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)`,
          }}
        />
      </header>

      <div className={compact ? "px-3 pb-3" : "space-y-5"}>
        <div
          className={
            compact ? "grid grid-cols-3 gap-3" : "grid grid-cols-3 gap-6"
          }
        >
          <div className="col-span-2 space-y-4">
            {leftSections.map((section) => (
              <div key={`left-${section}`}>{renderSection(section)}</div>
            ))}
          </div>

          <div className="col-span-1 space-y-4">
            {rightSections.map((section) => (
              <div key={`right-${section}`}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
