const containerStyle = {
  position: "relative" as const,
  display: "flex",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: "linear-gradient(135deg, #f8fffb 0%, #eefcf4 48%, #e4f7ea 100%)",
  color: "#06281b",
  fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
};

const gridStyle = {
  position: "absolute" as const,
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  opacity: 0.7,
};

const glowStyle = {
  position: "absolute" as const,
  inset: 0,
  background:
    "radial-gradient(circle at 50% 100%, rgba(34,197,94,0.28), transparent 56%), radial-gradient(circle at 15% 20%, rgba(16,185,129,0.12), transparent 35%)",
};

const panelStyle = {
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between" as const,
  width: "100%",
  padding: "58px 64px 50px",
};

const badgeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  alignSelf: "flex-start" as const,
  padding: "12px 18px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(22,163,74,0.16)",
  boxShadow: "0 16px 40px rgba(6, 40, 27, 0.08)",
  color: "#14532d",
  fontSize: 24,
  fontWeight: 700,
};

const badgeDotStyle = {
  display: "flex",
  width: 12,
  height: 12,
  borderRadius: 999,
  backgroundColor: "#22c55e",
  boxShadow: "0 0 0 6px rgba(34, 197, 94, 0.15)",
};

const headlineStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  maxWidth: 880,
  fontSize: 72,
  lineHeight: 1.02,
  letterSpacing: "-0.05em",
  fontWeight: 800,
};

const brandTextStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  color: "#16a34a",
};

const sparkleStyle = {
  display: "flex",
  width: 18,
  height: 18,
  transform: "rotate(45deg)",
  borderRadius: 4,
  background: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)",
  boxShadow: "0 0 0 8px rgba(34, 197, 94, 0.12)",
};

const descriptionStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  alignItems: "center",
  gap: "10px",
  maxWidth: 930,
  marginTop: "22px",
  color: "#3f5f4d",
  fontSize: 28,
  lineHeight: 1.5,
  fontWeight: 500,
};

const pillRowStyle = {
  display: "flex",
  gap: "14px",
  marginTop: "30px",
};

const footerStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginTop: "20px",
};

const statCardStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
  padding: "18px 22px",
  borderRadius: 24,
  backgroundColor: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(22,163,74,0.14)",
  boxShadow: "0 18px 44px rgba(6, 40, 27, 0.08)",
};

type HighlightPillProps = {
  label: string;
  background: string;
  color: string;
};

function HighlightPill({ label, background, color }: HighlightPillProps) {
  return (
    <div
      style={{
        display: "flex",
        padding: "12px 18px",
        borderRadius: 999,
        background,
        color,
        fontSize: 24,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

export function HeroOgImage() {
  return (
    <div style={containerStyle}>
      <div style={gridStyle} />
      <div style={glowStyle} />
      <div
        style={{
          position: "absolute",
          top: -110,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: 999,
          background: "rgba(22, 163, 74, 0.12)",
          border: "1px solid rgba(22, 163, 74, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: 999,
          background: "rgba(74, 222, 128, 0.14)",
        }}
      />

      <div style={panelStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "34px" }}>
          <div style={badgeStyle}>
            <div style={badgeDotStyle} />
            Open source, privacy-first resume builder
          </div>

          <div style={headlineStyle}>
            <div style={{ display: "flex" }}>Build ATS-Ready Resumes With</div>
            <div style={brandTextStyle}>
              <div style={sparkleStyle} />
              <div>Local CV</div>
            </div>
          </div>

          <div style={descriptionStyle}>
            <div>The open source way to craft a standout resume</div>
            <div style={{ fontWeight: 700, color: "#854d0e" }}>
              completely free
            </div>
            <div>with</div>
            <div style={{ fontWeight: 700, color: "#1d4ed8" }}>
              no signup and no paywall
            </div>
            <div>while you build with</div>
            <div style={{ fontWeight: 700, color: "#166534" }}>
              ATS-ready templates
            </div>
            <div>and AI-powered refinements.</div>
          </div>

          <div style={pillRowStyle}>
            <HighlightPill
              label="Completely free"
              background="rgba(254, 240, 138, 0.75)"
              color="#713f12"
            />
            <HighlightPill
              label="No signup"
              background="rgba(191, 219, 254, 0.78)"
              color="#1d4ed8"
            />
            <HighlightPill
              label="ATS-ready templates"
              background="rgba(187, 247, 208, 0.82)"
              color="#166534"
            />
          </div>
        </div>

        <div style={footerStyle}>
          <div style={{ display: "flex", gap: "18px" }}>
            <div style={statCardStyle}>
              <div style={{ fontSize: 20, color: "#4b6356", fontWeight: 600 }}>
                Privacy-first
              </div>
              <div style={{ fontSize: 28, color: "#06281b", fontWeight: 800 }}>
                Your resume data stays on your device
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={{ fontSize: 20, color: "#4b6356", fontWeight: 600 }}>
                Share-ready preview
              </div>
              <div style={{ fontSize: 28, color: "#06281b", fontWeight: 800 }}>
                Built from the homepage hero design
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: 22,
              backgroundColor: "#06281b",
              color: "#f0fdf4",
              boxShadow: "0 18px 40px rgba(6, 40, 27, 0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                backgroundColor: "#16a34a",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              CV
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: "rgba(240, 253, 244, 0.76)",
                  fontWeight: 600,
                }}
              >
                localCV
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>
                ATS-optimized resumes in minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
