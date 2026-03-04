/* ****** Resume Export Helpers ****** */

import type { ResumeTemplateData } from "./index";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function listToHtml(items: string[]) {
    if (items.length === 0) {
        return "";
    }

    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function exportResumeToHtml(data: ResumeTemplateData) {
    const contact = [
        data.profile.email,
        data.profile.phone,
        data.profile.location,
        data.profile.website,
        data.profile.linkedin,
        data.profile.github,
    ]
        .filter((item): item is string => Boolean(item))
        .map((item) => escapeHtml(item))
        .join(" · ");

    const experienceHtml = data.experience
        .map(
            (item) => `
        <article>
          <h3>${escapeHtml(item.role)} · ${escapeHtml(item.company)}</h3>
          <p>${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</p>
          ${listToHtml(item.achievements)}
        </article>
      `,
        )
        .join("");

    const educationHtml = data.education
        .map(
            (item) => `
        <article>
          <h3>${escapeHtml(item.degree)} in ${escapeHtml(item.field)}</h3>
          <p>${escapeHtml(item.institution)} · ${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)}</p>
        </article>
      `,
        )
        .join("");

    const projectHtml = data.projects
        .map(
            (item) => `
        <article>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${listToHtml(item.highlights)}
        </article>
      `,
        )
        .join("");

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.profile.fullName)} Resume</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111; max-width: 840px; margin: 0 auto; padding: 24px; }
      h1 { margin-bottom: 4px; }
      h2 { margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
      h3 { margin-bottom: 4px; }
      p, li { font-size: 14px; line-height: 1.45; }
      ul { margin-top: 4px; }
      @media print { body { max-width: 100%; padding: 0; } }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(data.profile.fullName)}</h1>
      <p>${escapeHtml(data.profile.headline)}</p>
      <p>${contact}</p>
    </header>

    <section>
      <h2>Professional Summary</h2>
      <p>${escapeHtml(data.summary)}</p>
    </section>

    <section>
      <h2>Experience</h2>
      ${experienceHtml}
    </section>

    <section>
      <h2>Education</h2>
      ${educationHtml}
    </section>

    <section>
      <h2>Skills</h2>
      <p>${data.skills.map((skill) => escapeHtml(skill)).join(" · ")}</p>
    </section>

    <section>
      <h2>Projects</h2>
      ${projectHtml}
    </section>
  </body>
</html>
  `.trim();
}

export function exportResumeToMarkdown(data: ResumeTemplateData) {
    const lines: string[] = [];

    lines.push(`# ${data.profile.fullName}`);
    lines.push(`${data.profile.headline}`);
    lines.push("");

    const contacts = [
        data.profile.email,
        data.profile.phone,
        data.profile.location,
        data.profile.website,
        data.profile.linkedin,
        data.profile.github,
    ].filter((item): item is string => Boolean(item));

    lines.push(contacts.join(" | "));
    lines.push("");

    lines.push("## Professional Summary");
    lines.push(data.summary);
    lines.push("");

    if (data.experience.length > 0) {
        lines.push("## Experience");
        data.experience.forEach((item) => {
            lines.push(`### ${item.role} — ${item.company}`);
            lines.push(`${item.startDate} - ${item.endDate}`);
            item.achievements.forEach((point) => lines.push(`- ${point}`));
            lines.push("");
        });
    }

    if (data.education.length > 0) {
        lines.push("## Education");
        data.education.forEach((item) => {
            lines.push(`- **${item.degree} in ${item.field}** · ${item.institution} (${item.startDate} - ${item.endDate})`);
        });
        lines.push("");
    }

    if (data.skills.length > 0) {
        lines.push("## Skills");
        lines.push(data.skills.join(", "));
        lines.push("");
    }

    if (data.projects.length > 0) {
        lines.push("## Projects");
        data.projects.forEach((item) => {
            lines.push(`### ${item.name}`);
            lines.push(item.description);
            item.highlights.forEach((highlight) => lines.push(`- ${highlight}`));
            lines.push("");
        });
    }

    return lines.join("\n").trim();
}
