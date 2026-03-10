/* ****** Photo Resume Template ****** */

import type {
  ResumeSectionKey,
  ResumeTemplateData,
  ResumeTemplateComponentProps,
} from "./index";
import type { ResumeStyleConfig } from "./types";
import { getRenderableSectionOrder } from "./section-order";

interface PhotoTemplateProps extends ResumeTemplateComponentProps {
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

function ContactDetailsInline({
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
      {parts.length > 0
        ? parts.reduce((prev, curr) => [prev, "  ·  ", curr] as never)
        : null}
    </p>
  );
}

export function PhotoTemplate({
  data,
  compact = false,
  styleConfig,
  sectionOrder,
}: PhotoTemplateProps) {
  const accentColor = styleConfig?.accentColor ?? "#2563eb";
  const fontFamily = styleConfig?.fontFamily ?? "font-sans";
  /* ****** Apply fontSize from styleConfig ****** */
  const fsMap = { small: "text-[10px]", medium: "text-xs", large: "text-sm" };
  const fsHeadingMap = {
    small: "text-[10px]",
    medium: "text-[11px]",
    large: "text-xs",
  };
  const contentTextSize = compact
    ? "text-[9px]"
    : fsMap[styleConfig?.fontSize ?? "medium"];
  const headingTextSize = compact
    ? "text-[9px]"
    : fsHeadingMap[styleConfig?.fontSize ?? "medium"];

  const initials = data.profile.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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
    : `bg-background max-w-[210mm] min-h-[297mm] mx-auto ${fontFamily}`;

  function sectionTitle(title: string) {
    return (
      <>
        <h2
          className={`${headingTextSize} font-bold uppercase tracking-wider`}
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <div
          className="h-0.5 w-8 rounded mb-1"
          style={{ backgroundColor: accentColor, opacity: 0.4 }}
        />
      </>
    );
  }

  function renderSection(section: ResumeSectionKey) {
    switch (section) {
      case "summary":
        return (
          <section className="space-y-1.5">
            {sectionTitle("Professional Summary")}
            <p className={`${contentTextSize} text-foreground leading-relaxed`}>
              {data.summary}
            </p>
          </section>
        );
      case "experience":
        return (
          <section className="space-y-3">
            {sectionTitle("Experience")}
            {data.experience.map((exp, i) => (
              <div
                key={i}
                className="space-y-1 pl-2 border-l-2"
                style={{ borderColor: `${accentColor}40` }}
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
              </div>
            ))}
          </section>
        );
      case "projects":
        return (
          <section className="space-y-2">
            {sectionTitle("Projects")}
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
      case "education":
        return (
          <section className="space-y-2">
            {sectionTitle("Education")}
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
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </section>
        );
      case "skills":
        return (
          <section className="space-y-2">
            {sectionTitle("Skills")}
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
                    borderColor: `${accentColor}50`,
                    color: accentColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return (
          <section className="space-y-1.5">
            {sectionTitle("Certifications")}
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
      case "languages":
        return (
          <section className="space-y-1.5">
            {sectionTitle("Languages")}
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
      default:
        return null;
    }
  }

  return (
    <article
      className={pageClass}
      style={{ fontFamily: styleConfig?.fontFamilyValue }}
    >
      <header
        className={
          compact
            ? "px-4 py-3 flex items-center gap-3"
            : "px-8 py-6 flex items-center gap-6"
        }
        style={{ backgroundColor: accentColor }}
      >
        <div
          className={
            compact
              ? "w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-sm border-2 border-white/40 overflow-hidden"
              : "w-20 h-20 rounded-full shrink-0 flex items-center justify-center font-bold text-2xl border-4 border-white/40 overflow-hidden"
          }
          style={
            !data.profile.photo
              ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }
              : undefined
          }
        >
          {data.profile.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.profile.photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

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
          <ContactDetailsInline
            data={data}
            className={
              compact
                ? "text-[8px] text-white/70 mt-0.5"
                : "text-xs text-white/70 mt-1.5 leading-relaxed"
            }
          />
        </div>
      </header>

      <div className={compact ? "flex gap-0 p-3" : "flex gap-0 p-0"}>
        <div
          className={
            compact ? "flex-1 pr-3 space-y-3" : "flex-1 px-8 py-5 space-y-5"
          }
        >
          {leftSections.map((section) => (
            <div key={`left-${section}`}>{renderSection(section)}</div>
          ))}
        </div>

        <div
          className={
            compact
              ? "w-[32%] pl-3 space-y-3 border-l"
              : "w-[30%] px-5 py-5 space-y-5 border-l"
          }
          style={{ borderColor: `${accentColor}30` }}
        >
          {rightSections.map((section) => (
            <div key={`right-${section}`}>{renderSection(section)}</div>
          ))}
        </div>
      </div>
    </article>
  );
}
