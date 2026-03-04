/* ****** Photo Resume Template ****** */

import type { ResumeTemplateData } from "./index";
import type { ResumeStyleConfig } from "./types";

interface PhotoTemplateProps {
  data: ResumeTemplateData;
  compact?: boolean;
  styleConfig?: ResumeStyleConfig;
}

function joinContactInline(data: ResumeTemplateData) {
  return [
    data.profile.email,
    data.profile.phone,
    data.profile.location,
    data.profile.linkedin,
    data.profile.github,
  ]
    .filter(Boolean)
    .join("  ·  ");
}

export function PhotoTemplate({
  data,
  compact = false,
  styleConfig,
}: PhotoTemplateProps) {
  const accentColor = styleConfig?.accentColor ?? "#2563eb";
  const fontFamily = styleConfig?.fontFamily ?? "font-sans";
  const contentTextSize = compact ? "text-[9px]" : "text-xs";
  const headingTextSize = compact ? "text-[9px]" : "text-[11px]";

  const initials = data.profile.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const pageClass = compact
    ? `w-full h-full overflow-hidden rounded-md border bg-background ${fontFamily}`
    : `bg-background max-w-[210mm] min-h-[297mm] mx-auto ${fontFamily}`;

  return (
    <article
      className={pageClass}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      {/* ****** Colored Header Band ****** */}
      <header
        className={
          compact
            ? "px-4 py-3 flex items-center gap-3"
            : "px-8 py-6 flex items-center gap-6"
        }
        style={{ backgroundColor: accentColor }}
      >
        {/* Photo circle */}
        <div
          className={
            compact
              ? "w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-sm border-2 border-white/40"
              : "w-20 h-20 rounded-full shrink-0 flex items-center justify-center font-bold text-2xl border-4 border-white/40"
          }
          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
        >
          {initials}
        </div>

        {/* Name / headline */}
        <div className="flex-1 min-w-0">
          <h1
            className={
              compact
                ? "text-sm font-bold text-white leading-tight"
                : "text-2xl font-bold text-white leading-tight"
            }
          >
            {data.profile.fullName}
          </h1>
          {data.profile.headline && (
            <p
              className={
                compact
                  ? "text-[9px] text-white/80 mt-0.5"
                  : "text-sm text-white/80 mt-1"
              }
            >
              {data.profile.headline}
            </p>
          )}
          <p
            className={
              compact
                ? "text-[8px] text-white/70 mt-0.5"
                : "text-xs text-white/70 mt-1.5 leading-relaxed"
            }
          >
            {joinContactInline(data)}
          </p>
        </div>
      </header>

      {/* ****** Body: two columns ****** */}
      <div className={compact ? "flex gap-0 p-3" : "flex gap-0 p-0"}>
        {/* Left column */}
        <div
          className={
            compact ? "flex-1 pr-3 space-y-3" : "flex-1 px-8 py-5 space-y-5"
          }
        >
          {data.summary && (
            <section className="space-y-1.5">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Professional Summary
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-2"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              <p
                className={`${contentTextSize} text-foreground leading-relaxed`}
              >
                {data.summary}
              </p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="space-y-3">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Experience
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  className="space-y-1 pl-2 border-l-2"
                  style={{ borderColor: accentColor + "40" }}
                >
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
                </div>
              ))}
            </section>
          )}

          {data.projects.length > 0 && (
            <section className="space-y-2">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Projects
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
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
        </div>

        {/* Right column */}
        <div
          className={
            compact
              ? "w-[32%] pl-3 space-y-3 border-l"
              : "w-[30%] px-5 py-5 space-y-5 border-l"
          }
          style={{ borderColor: accentColor + "30" }}
        >
          {data.education.length > 0 && (
            <section className="space-y-2">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Education
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              {data.education.map((edu, i) => (
                <div key={i} className="space-y-0.5">
                  <p
                    className={`${contentTextSize} font-semibold text-foreground`}
                  >
                    {edu.degree} in {edu.field}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {edu.institution}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {edu.startDate} – {edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="space-y-2">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Skills
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={
                      compact
                        ? "text-[8px] px-1.5 py-0.5 rounded border"
                        : "text-[10px] px-2 py-0.5 rounded border"
                    }
                    style={{
                      borderColor: accentColor + "50",
                      color: accentColor,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section className="space-y-1.5">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Certifications
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <p
                    className={`${contentTextSize} font-medium text-foreground`}
                  >
                    {cert.name}
                  </p>
                  <p className={`${contentTextSize} text-muted-foreground`}>
                    {cert.issuer} · {cert.issueDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {data.languages.length > 0 && (
            <section className="space-y-1.5">
              <h2
                className={`${headingTextSize} font-bold uppercase tracking-wider`}
                style={{ color: accentColor }}
              >
                Languages
              </h2>
              <div
                className="h-0.5 w-8 rounded mb-1"
                style={{ backgroundColor: accentColor, opacity: 0.4 }}
              />
              {data.languages.map((lang, i) => (
                <p key={i} className={contentTextSize}>
                  <span className="font-medium text-foreground">
                    {lang.name}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {lang.proficiency}
                  </span>
                </p>
              ))}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
