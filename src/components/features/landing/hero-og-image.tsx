export function HeroOgImage() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#020617", // slate-950
        backgroundImage: "linear-gradient(135deg, #020617 0%, #064e3b 100%)",
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glows via SVG for Satori compatibility */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </radialGradient>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22c55e" strokeOpacity="0.1" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#gridPattern)" />
        <circle cx="100" cy="100" r="500" fill="url(#glow1)" />
        <circle cx="1100" cy="600" r="600" fill="url(#glow2)" />
      </svg>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "70px 80px",
          position: "relative",
        }}
      >
        {/* Left Content */}
        <div style={{ display: "flex", flexDirection: "column", width: "55%", justifyContent: "center" }}>
          {/* Logo / Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                backgroundColor: "#22c55e",
                borderRadius: "16px",
                boxShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: "42px", fontWeight: "bolder", color: "#ffffff", letterSpacing: "-0.05em" }}>
              localCV
            </div>
          </div>

          {/* Heading */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
            <div style={{ display: "flex", fontSize: "64px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              The AI Resume Maker
            </div>
            <div style={{ display: "flex", fontSize: "64px", fontWeight: 900, color: "#4ade80", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              That Protects Privacy
            </div>
          </div>

          {/* Body */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "40px" }}>
            <div style={{ display: "flex", fontSize: "20px", color: "#94a3b8", fontWeight: 500, lineHeight: 1.4 }}>
              Local-first. Open source. No signups.
            </div>
            <div style={{ display: "flex", fontSize: "20px", color: "#94a3b8", fontWeight: 500, lineHeight: 1.4 }}>
              Build ATS-ready resumes magically on your device.
            </div>
          </div>

          {/* Pills */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ display: "flex", padding: "12px 24px", backgroundColor: "rgba(34,197,94,0.15)", borderRadius: "100px", border: "1px solid rgba(34,197,94,0.3)" }}>
              <span style={{ color: "#4ade80", fontSize: "24px", fontWeight: 700 }}>100% Free</span>
            </div>
            <div style={{ display: "flex", padding: "12px 24px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ color: "#e2e8f0", fontSize: "24px", fontWeight: 600 }}>ATS-Optimized</span>
            </div>
          </div>
        </div>

        {/* Right Content - Mockups */}
        <div style={{ display: "flex", width: "45%", position: "relative", alignItems: "center", justifyContent: "flex-end" }}>
          {/* Back Dark Card */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "40px",
              width: "420px",
              height: "540px",
              backgroundColor: "rgba(30,41,59,0.8)",
              borderRadius: "24px",
              border: "1px solid rgba(52,211,153,0.3)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              transform: "rotate(-4deg)",
              display: "flex",
            }}
          />

          {/* Front Light Card */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "10px",
              width: "420px",
              height: "540px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              transform: "rotate(3deg)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top Bar */}
            <div style={{ display: "flex", alignItems: "center", padding: "0 20px", height: "48px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              </div>
            </div>

            {/* Resume Content Skeleton */}
            <div style={{ display: "flex", flexDirection: "column", padding: "32px", gap: "24px" }}>
              {/* Profile Block */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "36px", backgroundColor: "#e2e8f0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ width: "160px", height: "24px", borderRadius: "6px", backgroundColor: "#334155" }} />
                  <div style={{ width: "100px", height: "16px", borderRadius: "4px", backgroundColor: "#94a3b8" }} />
                </div>
              </div>

              {/* Separator */}
              <div style={{ width: "100%", height: "2px", backgroundColor: "#f1f5f9" }} />

              {/* Work Exp 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ width: "140px", height: "20px", borderRadius: "6px", backgroundColor: "#22c55e" }} />
                <div style={{ width: "100%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
                <div style={{ width: "90%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
                <div style={{ width: "95%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
              </div>

              {/* Work Exp 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                <div style={{ width: "120px", height: "20px", borderRadius: "6px", backgroundColor: "#22c55e" }} />
                <div style={{ width: "100%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
                <div style={{ width: "85%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
                <div style={{ width: "40%", height: "12px", borderRadius: "4px", backgroundColor: "#cbd5e1" }} />
              </div>
            </div>

            {/* Floating Sparkle Icon */}
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                right: "32px",
                width: "56px",
                height: "56px",
                borderRadius: "28px",
                backgroundColor: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(34,197,94,0.4)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

