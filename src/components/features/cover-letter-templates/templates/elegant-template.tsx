/* ****** Elegant Cover Letter Template — centered header, refined spacing, accent rule ****** */

import type { CoverLetterTemplateProps } from "../types";
import { getFontSizeValue, getLineHeightValue } from "../types";

export function ElegantTemplate({ content, profile, styleConfig }: CoverLetterTemplateProps) {
    const fontSize = getFontSizeValue(styleConfig.fontSize);
    const lineHeight = getLineHeightValue(styleConfig.fontSize);

    return (
        <div
            style={{
                fontFamily: styleConfig.fontFamilyValue ?? "Georgia, 'Times New Roman', serif",
                fontSize,
                lineHeight,
                color: styleConfig.textColor,
                backgroundColor: "#ffffff",
                padding: "52px 64px",
                maxWidth: "780px",
                margin: "0 auto",
            }}
        >
            {/* Centered header */}
            <header style={{ textAlign: "center", marginBottom: "36px" }}>
                <h1
                    style={{
                        fontSize: "26px",
                        fontWeight: "700",
                        color: styleConfig.accentColor,
                        margin: "0 0 8px 0",
                        letterSpacing: "0.5px",
                    }}
                >
                    {profile.fullName}
                </h1>
                <p style={{ margin: "0", fontSize: "12px", color: "#6b7280", letterSpacing: "0.3px" }}>
                    {[profile.email, profile.phone, profile.location]
                        .filter(Boolean)
                        .join("  ·  ")}
                </p>
                {(profile.linkedin || profile.website) && (
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                        {[profile.linkedin, profile.website].filter(Boolean).join("  ·  ")}
                    </p>
                )}

                {/* Decorative rule */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0 0" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                    <div
                        style={{
                            width: "6px",
                            height: "6px",
                            backgroundColor: styleConfig.accentColor,
                            borderRadius: "50%",
                        }}
                    />
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                </div>
            </header>

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <p style={{ margin: 0, fontStyle: "italic" }}>{content.salutation}</p>
                <p style={{ margin: 0 }}>{content.openingParagraph}</p>
                {content.bodyParagraphs.map((para, i) => (
                    <p key={i} style={{ margin: 0 }}>{para}</p>
                ))}
                <p style={{ margin: 0 }}>{content.closingParagraph}</p>
            </div>

            {/* Signature */}
            <div style={{ marginTop: "36px" }}>
                {content.signature.split("\n").map((line, i) => (
                    <p
                        key={i}
                        style={{
                            margin: "0",
                            fontStyle: i === 0 ? "italic" : "normal",
                            fontWeight: i === 1 ? "600" : "400",
                            color: i === 1 ? styleConfig.accentColor : styleConfig.textColor,
                        }}
                    >
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}
