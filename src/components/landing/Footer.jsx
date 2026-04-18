export  default function Footer() {
  const links = {
    Product: ["Features", "Demo Mode", "Pricing", "Changelog"],
    Resources: ["Documentation", "API Reference", "GitHub", "Status"],
    Company: ["About", "SOFTEC 2025", "Contact", "Privacy"],
  };

  return (
    <footer style={{
      background: "#000",
      borderTop: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* CTA BAND */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "80px 6vw",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap", gap: 32,
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--f-display)", fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.04em",
            lineHeight: 1.05, color: "#fff",
          }}>
            Ready to rank<br />
            <span style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
              your inbox?
            </span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{
            fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 14,
            color: "#000", background: "#fff", border: "none",
            padding: "16px 36px", cursor: "pointer",
            transition: "opacity 0.15s, transform 0.15s",
          }}
            onMouseEnter={e => { e.target.style.opacity = 0.85; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.opacity = 1; e.target.style.transform = "none"; }}
          >
            Start for free
          </button>
          <button style={{
            fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            padding: "16px 28px", cursor: "pointer",
            transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          >
            View Demo
          </button>
        </div>
      </div>

      {/* MAIN FOOTER GRID */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "64px 6vw 48px",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40,
      }}>
        {/* Brand col */}
        <div>
          <div style={{
            fontFamily: "var(--f-display)", fontWeight: 800, fontSize: 24,
            letterSpacing: "-0.04em", color: "#fff", marginBottom: 16,
          }}>
            Inbox<span style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontWeight: 300 }}>IQ</span>
          </div>
          <p style={{
            fontFamily: "var(--f-serif)", fontWeight: 300, fontSize: 14,
            color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 240, marginBottom: 32,
          }}>
            AI-powered email intelligence for students navigating opportunities, deadlines, and decisions.
          </p>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>
            BUILT FOR SOFTEC 2025
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(links).map(([group, items]) => (
          <div key={group}>
            <div style={{
              fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 24,
            }}>
              {group}
            </div>
            <ul style={{ listStyle: "none" }}>
              {items.map((item) => (
                <li key={item} style={{ marginBottom: 12 }}>
                  <a href="#" style={{
                    fontFamily: "var(--f-display)", fontWeight: 400, fontSize: 14,
                    color: "rgba(255,255,255,0.45)", textDecoration: "none",
                    letterSpacing: "-0.01em", transition: "color 0.15s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        maxWidth: 1100, margin: "0 auto", padding: "24px 6vw",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
        }}>
          © 2025 InboxIQ. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Terms", "Privacy", "Cookies"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.2)", textDecoration: "none",
              textTransform: "uppercase", transition: "color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.2)"}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}