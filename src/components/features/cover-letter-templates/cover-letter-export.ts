/* ****** Cover Letter Export Helpers (HTML · Markdown) ****** */

import type { CoverLetterContent, ResumeProfile } from "@/lib/db/schema";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function exportCoverLetterToHtml(
    content: CoverLetterContent,
    profile: ResumeProfile,
    companyName: string,
): string {
    const contactLine = [profile.email, profile.phone, profile.location]
        .filter(Boolean)
        .map(escapeHtml)
        .join(" · ");

    const bodyParasHtml = content.bodyParagraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("\n    ");

    const signatureHtml = content.signature
        .split("\n")
        .map((line) => `<p style="margin:0">${escapeHtml(line)}</p>`)
        .join("\n    ");

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cover Letter — ${escapeHtml(profile.fullName)} — ${escapeHtml(companyName)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1a1a1a; max-width: 760px; margin: 0 auto; padding: 48px 40px; line-height: 1.65; }
      h1 { margin: 0 0 4px; font-size: 22px; }
      .contact { font-size: 12px; color: #6b7280; margin: 0 0 24px; }
      p { margin: 0 0 14px; font-size: 14.5px; }
      .signature { margin-top: 28px; }
      @media print { body { max-width: 100%; padding: 0; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(profile.fullName)}</h1>
    <p class="contact">${contactLine}</p>

    <p>${escapeHtml(content.salutation)}</p>
    <p>${escapeHtml(content.openingParagraph)}</p>
    ${bodyParasHtml}
    <p>${escapeHtml(content.closingParagraph)}</p>

    <div class="signature">
      ${signatureHtml}
    </div>
  </body>
</html>`.trim();
}

export function exportCoverLetterToMarkdown(
    content: CoverLetterContent,
    profile: ResumeProfile,
    companyName: string,
): string {
    const lines: string[] = [];

    lines.push(`# Cover Letter — ${companyName}`);
    lines.push("");
    lines.push(`**${profile.fullName}**`);

    const contacts = [profile.email, profile.phone, profile.location, profile.linkedin, profile.website].filter(Boolean);
    if (contacts.length > 0) {
        lines.push(contacts.join(" | "));
    }

    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(content.salutation);
    lines.push("");
    lines.push(content.openingParagraph);
    lines.push("");

    content.bodyParagraphs.forEach((para) => {
        lines.push(para);
        lines.push("");
    });

    lines.push(content.closingParagraph);
    lines.push("");
    lines.push(content.signature.replace("\n", "  \n"));

    return lines.join("\n").trim();
}
