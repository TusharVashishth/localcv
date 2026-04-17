/* ****** Professional Cover Letter Template — accent header bar, formal layout ****** */

import type { CoverLetterTemplateProps } from "../types";
import { getFontSizeValue, getLineHeightValue } from "../types";

export function ProfessionalTemplate({ content, profile, styleConfig }: CoverLetterTemplateProps) {
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
                maxWidth: "780px",
                margin: "0 auto",
                overflow: "hidden",
            }}
        >
            {/* Accent header band */}
            <header
                style={{
                    backgroundColor: styleConfig.accentColor,
                    padding: "28px 48px 24px",
                    color: "#ffffff",
                }}
            >
                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        margin: "0 0 6px 0",
                        letterSpacing: "-0.3px",
                    }}
                >
                    {profile.fullName}
                </h1>
                <p style={{ margin: "0", fontSize: "12px", opacity: 0.85 }}>
                    {[profile.email, profile.phone, profile.location]
                        .filter(Boolean)
                        .join("  ·  ")}
                </p>
                {(profile.linkedin || profile.website) && (
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", opacity: 0.75 }}>
                        {[profile.linkedin, profile.website].filter(Boolean).join("  ·  ")}
                    </p>
                )}
            </header>

            {/* Body */}
            <div style={{ padding: "36px 48px 44px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p style={{ margin: 0, fontWeight: "600" }}>{content.salutation}</p>
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
                            }}
                        >
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
