/* ****** Sidebar Color Resume Template ****** */

import type {
  ResumeSectionKey,
  ResumeTemplateData,
  ResumeTemplateComponentProps,
} from "./index";
import type { ResumeStyleConfig } from "./types";
import { getRenderableSectionOrder } from "./section-order";

interface SidebarColorTemplateProps extends ResumeTemplateComponentProps {
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

function ContactDetailsSidebar({
  data,
  className,
}: {
  data: ResumeTemplateData;
  className: string;
}) {
  return (
    <>
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
    </>
  );
}

export function SidebarColorTemplate({
  data,
  compact = false,
  styleConfig,
  sectionOrder,
}: SidebarColorTemplateProps) {
  const sidebarBg = styleConfig?.accentColor ?? "#0f4c81";
  const fontFamily = styleConfig?.fontFamily ?? "font-sans";
  const contentTextSize = compact ? "text-[9px]" : "text-xs";
  const headingTextSize = compact ? "text-[9px]" : "text-[11px]";

  const orderedSections = getRenderableSectionOrder(data, sectionOrder);
  const sidebarSections = orderedSections.slice(
    0,
    Math.min(3, orderedSections.length),
  );
  const mainSections = orderedSections.slice(
    Math.min(3, orderedSections.length),
  );

  const pageClass = compact
    ? `flex w-full h-full overflow-hidden rounded-md border ${fontFamily}`
    : `flex min-h-[297mm] max-w-[210mm] mx-auto ${fontFamily}`;

  function renderSidebarSection(section: ResumeSectionKey) {
    switch (section) {
      case "summary":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Professional Summary
            </h2>
            <p className={`${contentTextSize} opacity-90 leading-relaxed`}>
              {data.summary}
            </p>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-1.5">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className={
                    compact
                      ? "text-[8px] px-1.5 py-0.5 rounded"
                      : "text-[10px] px-2 py-0.5 rounded"
                  }
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case "languages":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Languages
            </h2>
            {data.languages.map((lang, i) => (
              <p key={i} className={contentTextSize}>
                <span className="font-medium">{lang.name}</span>
                <span className="opacity-70"> · {lang.proficiency}</span>
              </p>
            ))}
          </div>
        );
      case "certifications":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Certifications
            </h2>
            {data.certifications.map((cert, i) => (
              <div key={i}>
                <p className={`${contentTextSize} font-medium`}>{cert.name}</p>
                <p className={`${contentTextSize} opacity-70`}>
                  {cert.issuer} · {cert.issueDate}
                </p>
              </div>
            ))}
          </div>
        );
      case "experience":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-0.5">
                <p className={`${contentTextSize} font-medium`}>{exp.role}</p>
                <p className={`${contentTextSize} opacity-70`}>{exp.company}</p>
                <p className={`${contentTextSize} opacity-70`}>
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
            ))}
          </div>
        );
      case "education":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="space-y-0.5">
                <p className={`${contentTextSize} font-medium`}>
                  {edu.degree} in {edu.field}
                </p>
                <p className={`${contentTextSize} opacity-70`}>
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="space-y-1">
            <h2
              className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Projects
            </h2>
            {data.projects.map((proj, i) => (
              <div key={i}>
                <p className={`${contentTextSize} font-medium`}>{proj.name}</p>
                <p className={`${contentTextSize} opacity-80`}>
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  function renderMainSection(section: ResumeSectionKey) {
    switch (section) {
      case "summary":
        return (
          <section className="space-y-1">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Professional Summary
            </h2>
            <p className={`${contentTextSize} leading-relaxed text-foreground`}>
              {data.summary}
            </p>
          </section>
        );
      case "experience":
        return (
          <section className="space-y-3">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className={`${contentTextSize} font-semibold text-foreground`}
                  >
                    {exp.role}
                  </h3>
                  <span
                    className={`${contentTextSize} text-muted-foreground whitespace-nowrap`}
                  >
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className={`${contentTextSize} text-muted-foreground`}>
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
                {exp.achievements.length === 0 && exp.description && (
                  <p className={`${contentTextSize} text-foreground`}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        );
      case "education":
        return (
          <section className="space-y-2">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className={`${contentTextSize} font-semibold text-foreground`}
                  >
                    {edu.degree} in {edu.field}
                  </h3>
                  <span
                    className={`${contentTextSize} text-muted-foreground whitespace-nowrap`}
                  >
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className={`${contentTextSize} text-muted-foreground`}>
                  {edu.institution}
                </p>
              </div>
            ))}
          </section>
        );
      case "projects":
        return (
          <section className="space-y-2">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Projects
            </h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="space-y-0.5">
                <h3
                  className={`${contentTextSize} font-semibold text-foreground`}
                >
                  {proj.name}
                </h3>
                <p className={`${contentTextSize} text-foreground`}>
                  {proj.description}
                </p>
              </div>
            ))}
          </section>
        );
      case "skills":
        return (
          <section className="space-y-2">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Skills
            </h2>
            <p className={`${contentTextSize} text-foreground`}>
              {data.skills.join(" · ")}
            </p>
          </section>
        );
      case "languages":
        return (
          <section className="space-y-1">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Languages
            </h2>
            {data.languages.map((lang, i) => (
              <p key={i} className={contentTextSize}>
                <span className="font-medium text-foreground">{lang.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {lang.proficiency}
                </span>
              </p>
            ))}
          </section>
        );
      case "certifications":
        return (
          <section className="space-y-1">
            <h2
              className={`${headingTextSize} font-bold uppercase tracking-wide pb-1 border-b`}
              style={{ borderColor: sidebarBg, color: sidebarBg }}
            >
              Certifications
            </h2>
            {data.certifications.map((cert, i) => (
              <div key={i}>
                <p className={`${contentTextSize} font-medium text-foreground`}>
                  {cert.name}
                </p>
                <p className={`${contentTextSize} text-muted-foreground`}>
                  {cert.issuer} · {cert.issueDate}
                </p>
              </div>
            ))}
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
      <aside
        className={
          compact
            ? "w-[35%] p-3 flex flex-col gap-3"
            : "w-[32%] p-6 flex flex-col gap-5"
        }
        style={{ backgroundColor: sidebarBg, color: "#ffffff" }}
      >
        <div>
          <div
            className={
              compact
                ? "w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold"
                : "w-16 h-16 rounded-full flex items-center justify-center mb-3 text-xl font-bold"
            }
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            {data.profile.fullName
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <h1
            className={
              compact
                ? "text-xs font-bold leading-tight"
                : "text-lg font-bold leading-tight"
            }
            style={{ color: "#ffffff" }}
          >
            {data.profile.fullName}
          </h1>
        </div>

        <div className="space-y-1">
          <h2
            className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Contact
          </h2>
          <ContactDetailsSidebar
            data={data}
            className={`${contentTextSize} opacity-90 break-all`}
          />
        </div>

        {sidebarSections.map((section) => (
          <div key={`sidebar-${section}`}>{renderSidebarSection(section)}</div>
        ))}
      </aside>

      <main
        className={
          compact
            ? "flex-1 p-3 space-y-3 bg-background"
            : "flex-1 p-6 space-y-5 bg-background"
        }
      >
        {mainSections.map((section) => (
          <div key={`main-${section}`}>{renderMainSection(section)}</div>
        ))}
      </main>
    </article>
  );
}
