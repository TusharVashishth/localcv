/* ****** Clean Cover Letter Template — minimalist, white, left-aligned ****** */

import type { CoverLetterTemplateProps } from "../types";
import { getFontSizeValue, getLineHeightValue } from "../types";

export function CleanTemplate({ content, profile, styleConfig }: CoverLetterTemplateProps) {
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
            {/* Header — name + contact */}
            <header style={{ marginBottom: "32px" }}>
                <h1
                    style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: styleConfig.accentColor,
                        margin: "0 0 6px 0",
                        letterSpacing: "-0.3px",
                    }}
                >
                    {profile.fullName}
                </h1>
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

            {/* Thin accent divider */}
            <div
                style={{
                    height: "2px",
                    backgroundColor: styleConfig.accentColor,
                    marginBottom: "28px",
                    width: "48px",
                    borderRadius: "2px",
                }}
            />

            {/* Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ margin: 0 }}>{content.salutation}</p>
                <p style={{ margin: 0 }}>{content.openingParagraph}</p>
                {content.bodyParagraphs.map((para, i) => (
                    <p key={i} style={{ margin: 0 }}>{para}</p>
                ))}
                <p style={{ margin: 0 }}>{content.closingParagraph}</p>
            </div>

            {/* Signature */}
            <div style={{ marginTop: "32px" }}>
                {content.signature.split("\n").map((line, i) => (
                    <p
                        key={i}
                        style={{
                            margin: "0",
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
