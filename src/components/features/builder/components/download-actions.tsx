"use client";

/* ****** Resume Download Actions (HTML | Markdown | PDF) ****** */

import { Download, FileCode2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exportResumeToHtml,
  exportResumeToMarkdown,
  type ResumeTemplateData,
} from "@/components/features/resume-templates";
import { toast } from "sonner";

interface DownloadActionsProps {
  data: ResumeTemplateData;
  templateId: string;
  previewElementId: string;
}

function triggerDownload(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function DownloadActions({
  data,
  templateId,
  previewElementId,
}: DownloadActionsProps) {
  const baseName = `${data.profile.fullName || "resume"}-${templateId}`;

  function handleDownloadHtml() {
    const html = exportResumeToHtml(data);
    triggerDownload(html, `${baseName}.html`, "text/html;charset=utf-8");
    toast.success("HTML resume downloaded");
  }

  function handleDownloadMarkdown() {
    const md = exportResumeToMarkdown(data);
    triggerDownload(md, `${baseName}.md`, "text/markdown;charset=utf-8");
    toast.success("Markdown resume downloaded");
  }

  function handleDownloadPdf() {
    const element = document.getElementById(previewElementId);
    if (!element) {
      toast.error("Preview element not found");
      return;
    }

    /* ****** Collect all <style> and <link stylesheet> tags from current doc ****** */
    const styleTagsHtml = Array.from(document.querySelectorAll("style"))
      .map((s) => s.outerHTML)
      .join("\n");

    const linkTagsHtml = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    )
      .map((l) => l.outerHTML)
      .join("\n");

    /* ****** Carry over CSS variable class on <html> (dark/light mode) ****** */
    const htmlClass = document.documentElement.className;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Popup blocked — please allow popups and try again.");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html class="${htmlClass}">
<head>
  <meta charset="utf-8" />
  <title>${baseName}</title>
  ${linkTagsHtml}
  ${styleTagsHtml}
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body { margin: 0; background: white; }
    @page { margin: 0; size: A4 portrait; }
  </style>
</head>
<body>
  ${element.outerHTML}
  <script>
    window.addEventListener('load', function () {
      /* small delay so fonts/images settle */
      setTimeout(function () { window.print(); window.close(); }, 600);
    });
  <\/script>
</body>
</html>`);

    printWindow.document.close();
    toast.success('Print dialog opened — choose "Save as PDF" to download');
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button
        className="h-auto min-h-28 justify-start rounded-2xl border border-primary/20 bg-linear-to-br from-primary to-emerald-500 px-4 py-4 text-left text-primary-foreground shadow-xl shadow-primary/20 hover:from-primary/90 hover:to-emerald-500/90"
        onClick={handleDownloadPdf}
      >
        <div className="flex w-full items-start gap-3">
          <div className="rounded-xl bg-white/15 p-2">
            <Download className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Download PDF</p>
            <p className="mt-1 text-xs text-primary-foreground/85">
              Best for applications and sharing.
            </p>
          </div>
        </div>
      </Button>

      <Button
        className="h-auto min-h-28 justify-start rounded-2xl border border-sky-500/20 bg-linear-to-br from-sky-500 to-cyan-500 px-4 py-4 text-left text-white shadow-xl shadow-sky-500/20 hover:from-sky-500/90 hover:to-cyan-500/90"
        onClick={handleDownloadHtml}
      >
        <div className="flex w-full items-start gap-3">
          <div className="rounded-xl bg-white/15 p-2">
            <FileCode2 className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Download HTML</p>
            <p className="mt-1 text-xs text-white/85">
              Useful for personal hosting and edits.
            </p>
          </div>
        </div>
      </Button>

      <Button
        className="h-auto min-h-28 justify-start rounded-2xl border border-fuchsia-500/20 bg-linear-to-br from-fuchsia-500 to-rose-500 px-4 py-4 text-left text-white shadow-xl shadow-fuchsia-500/20 hover:from-fuchsia-500/90 hover:to-rose-500/90"
        onClick={handleDownloadMarkdown}
      >
        <div className="flex w-full items-start gap-3">
          <div className="rounded-xl bg-white/15 p-2">
            <FileText className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Download Markdown</p>
            <p className="mt-1 text-xs text-white/85">
              Great for versioning and quick reuse.
            </p>
          </div>
        </div>
      </Button>
    </div>
  );
}
