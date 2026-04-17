/* ****** Bold Cover Letter Template — strong left accent border, modern typography ****** */

import type { CoverLetterTemplateProps } from "../types";
import { getFontSizeValue, getLineHeightValue } from "../types";

export function BoldTemplate({ content, profile, styleConfig }: CoverLetterTemplateProps) {
    const fontSize = getFontSizeValue(styleConfig.fontSize);
    const lineHeight = getLineHeightValue(styleConfig.fontSize);

    return (
        <div
            style={{
                fontFamily: styleConfig.fontFamilyValue ?? "ui-sans-serif, system-ui, sans-serif",
                fontSize,
                lineHeight,
                color: styleConfig.textColor,
                backgroundColor: "#ffffff",
                padding: "48px 56px",
                maxWidth: "780px",
                margin: "0 auto",
            }}
        >
            {/* Header — large name with accent underline */}
            <header style={{ marginBottom: "36px" }}>
                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: "#111827",
                        margin: "0 0 4px 0",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {profile.fullName}
                </h1>
                {/* Thick accent underline bar */}
                <div
                    style={{
                        height: "4px",
                        width: "56px",
                        backgroundColor: styleConfig.accentColor,
                        borderRadius: "2px",
                        margin: "10px 0 14px 0",
                    }}
                />
                <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>
                    {[profile.email, profile.phone, profile.location]
                        .filter(Boolean)
                        .join("  ·  ")}
                </p>
                {(profile.linkedin || profile.website) && (
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                        {[profile.linkedin, profile.website].filter(Boolean).join("  ·  ")}
                    </p>
                )}
            </header>

            {/* Body with left accent border */}
            <div
                style={{
                    borderLeft: `3px solid ${styleConfig.accentColor}`,
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{content.salutation}</p>
                <p style={{ margin: 0 }}>{content.openingParagraph}</p>
                {content.bodyParagraphs.map((para, i) => (
                    <p key={i} style={{ margin: 0 }}>{para}</p>
                ))}
                <p style={{ margin: 0 }}>{content.closingParagraph}</p>
            </div>

            {/* Signature */}
            <div style={{ marginTop: "36px", paddingLeft: "23px" }}>
                {content.signature.split("\n").map((line, i) => (
                    <p
                        key={i}
                        style={{
                            margin: "0",
                            fontWeight: i === 1 ? "700" : "400",
                            fontSize: i === 1 ? "15px" : fontSize,
                            color: i === 1 ? "#111827" : styleConfig.textColor,
                        }}
                    >
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}
