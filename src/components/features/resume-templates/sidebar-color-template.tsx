/* ****** Sidebar Color Resume Template ****** */

import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";

interface SidebarColorTemplateProps {
  data: ResumeTemplateData;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
}

function joinContact(data: ResumeTemplateData) {
  return [
    data.profile.email,
    data.profile.phone,
    data.profile.location,
    data.profile.website,
    data.profile.linkedin,
    data.profile.github,
  ].filter(Boolean);
}

export function SidebarColorTemplate({
  data,
  compact = false,
  styleConfig,
}: SidebarColorTemplateProps) {
  const sidebarBg = styleConfig?.accentColor ?? "#0f4c81";
  const fontFamily = styleConfig?.fontFamily ?? "font-sans";
  const contentTextSize = compact ? "text-[9px]" : "text-xs";
  const headingTextSize = compact ? "text-[9px]" : "text-[11px]";

  const pageClass = compact
    ? `flex w-full h-full overflow-hidden rounded-md border ${fontFamily}`
    : `flex min-h-[297mm] max-w-[210mm] mx-auto ${fontFamily}`;

  return (
    <article
      className={pageClass}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      {/* ****** Left Sidebar ****** */}
      <aside
        className={
          compact
            ? "w-[35%] p-3 flex flex-col gap-3"
            : "w-[32%] p-6 flex flex-col gap-5"
        }
        style={{ backgroundColor: sidebarBg, color: "#ffffff" }}
      >
        {/* Name & headline in sidebar */}
        <div>
          {/* Profile photo placeholder (initials circle) */}
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
          {data.profile.headline && (
            <p
              className={
                compact
                  ? "text-[9px] mt-0.5 opacity-80"
                  : "text-xs mt-1 opacity-80"
              }
            >
              {data.profile.headline}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-1">
          <h2
            className={`${headingTextSize} font-semibold uppercase tracking-wider opacity-60 border-b pb-1`}
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Contact
          </h2>
          {joinContact(data).map((item, i) => (
            <p key={i} className={`${contentTextSize} opacity-90 break-all`}>
              {item}
            </p>
          ))}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
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
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
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
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
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
        )}
      </aside>

      {/* ****** Right Main Content ****** */}
      <main
        className={
          compact
            ? "flex-1 p-3 space-y-3 bg-background"
            : "flex-1 p-6 space-y-5 bg-background"
        }
      >
        {/* Summary */}
        {data.summary && (
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
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
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
                    {exp.startDate} – {exp.endDate}
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
        )}

        {/* Education */}
        {data.education.length > 0 && (
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
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <p className={`${contentTextSize} text-muted-foreground`}>
                  {edu.institution}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
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
        )}
      </main>
    </article>
  );
}
