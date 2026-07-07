import { Fragment, useMemo } from "react";

export function parseInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isSafeHref = /^(https?:\/\/|mailto:)/i.test(href);

      return isSafeHref ? (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4"
        >
          {label}
        </a>
      ) : (
        <Fragment key={index}>{label}</Fragment>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function renderMarkdownBlock(block: string, blockKey: string | number): React.ReactNode {
  const lines = block.split("\n");
  const firstLine = lines[0] ?? "";

  if (firstLine.startsWith("### ")) {
    return (
      <Fragment key={blockKey}>
        <h4 className="text-sm font-semibold">
          {parseInlineMarkdown(firstLine.replace(/^###\s+/, ""))}
        </h4>
        {lines.length > 1 && renderMarkdownBlock(lines.slice(1).join("\n"), `${blockKey}-rest`)}
      </Fragment>
    );
  }

  if (firstLine.startsWith("## ")) {
    return (
      <Fragment key={blockKey}>
        <h3 className="text-base font-semibold">
          {parseInlineMarkdown(firstLine.replace(/^##\s+/, ""))}
        </h3>
        {lines.length > 1 && renderMarkdownBlock(lines.slice(1).join("\n"), `${blockKey}-rest`)}
      </Fragment>
    );
  }

  if (firstLine.startsWith("# ")) {
    return (
      <Fragment key={blockKey}>
        <h2 className="text-lg font-semibold">
          {parseInlineMarkdown(firstLine.replace(/^#\s+/, ""))}
        </h2>
        {lines.length > 1 && renderMarkdownBlock(lines.slice(1).join("\n"), `${blockKey}-rest`)}
      </Fragment>
    );
  }

  if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
    return (
      <ul key={blockKey} className="flex list-disc flex-col gap-1 pl-5">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{parseInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
    return (
      <ol key={blockKey} className="flex list-decimal flex-col gap-1 pl-5">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{parseInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>
        ))}
      </ol>
    );
  }

  if (lines.every((line) => /^>\s?/.test(line.trim()))) {
    return (
      <blockquote key={blockKey} className="border-l-2 pl-3 text-muted-foreground">
        {lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {parseInlineMarkdown(line.replace(/^>\s?/, ""))}
            {lineIndex < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </blockquote>
    );
  }

  return (
    <p key={blockKey}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {parseInlineMarkdown(line)}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  );
}

export function MarkdownRenderer({ value, className }: { value: string; className?: string }) {
  const blocks = useMemo(() => value.trim().split(/\n{2,}/), [value]);

  if (!value.trim()) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        {blocks.map((block, blockIndex) => renderMarkdownBlock(block, blockIndex))}
      </div>
    </div>
  );
}
