import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState, useCallback } from "react";


export default function Description() {
  const [statsRef, statsInView] = useInView(0.4);
  const { ref: statsRef, inView: statsInView } = useInView({
  threshold: 0.4,
});


  const features = [
    {
      num: "01",
      title: "Paste & Parse",
      titleItalic: "any format.",
      body: "Drop raw email text, forwarded threads, or newsletter dumps. Our parser handles it all — extracting sender, subject, deadline, and context without configuration.",
      tag: "Zero setup",
    },
    {
      num: "02",
      title: "Scored on",
      titleItalic: "five dimensions.",
      body: "Every email is ranked across Deadline Urgency, Profile Fit, Institutional Prestige, Completeness, and your personal Preference Match — surfacing what genuinely matters.",
      tag: "Intelligent scoring",
    },
    {
      num: "03",
      title: "Act before",
      titleItalic: "the deadline.",
      body: "Critical opportunities bubble up with live countdowns. Export your ranked action sheet to PDF. Share your results link. Never miss a LUMS deadline again.",
      tag: "Actionable output",
    },
  ];

  return (
    <section id="how" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        .feat-card:hover .feat-num { color: #fff !important; }
        .feat-card:hover { border-color: rgba(255,255,255,0.15) !important; }
      `}</style>

      {/* ── TOP INTRO BAND ── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "100px 6vw 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 28,
          }}>
            — What it does
          </div>
          <h2 style={{
            fontFamily: "var(--f-display)", fontWeight: 800,
            fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-0.04em",
            lineHeight: 1.05, color: "#fff",
          }}>
            Intelligence<br />
            <span style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
              for the inbox
            </span>
          </h2>
        </div>
        <div>
          <p style={{
            fontFamily: "var(--f-serif)", fontSize: "clamp(17px, 2vw, 22px)",
            fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.65,
          }}>
            Pakistani students receive hundreds of emails about internships, grants, fellowships, and deadlines.
            InboxIQ cuts through the noise — ranking what demands your attention right now.
          </p>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div
        ref={statsRef}
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "52px 6vw",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
        }}>
          <StatItem target={94} suffix="%" label="Accuracy rate" triggerCount={statsInView} />
          <StatItem target={12000} suffix="+" label="Emails ranked" triggerCount={statsInView} />
          <StatItem target={8} suffix="s" label="Avg. analysis time" triggerCount={statsInView} />
          <StatItem target={5} suffix="×" label="Time saved vs. manual" triggerCount={statsInView} />
        </div>
      </div>

      {/* ── THREE FEATURES ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 6vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.07)" }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feat-card"
              style={{
                background: "#000",
                padding: "48px 36px",
                border: "none",
                borderColor: "rgba(255,255,255,0.07)",
                transition: "border-color 0.2s",
                animation: `fadeUp 0.7s ease ${0.1 * i}s both`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
                <span className="feat-num" style={{
                  fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.2)", transition: "color 0.2s",
                }}>
                  {f.num}
                </span>
                <span style={{
                  fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "4px 10px",
                  border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)",
                }}>
                  {f.tag}
                </span>
              </div>

              <h3 style={{
                fontFamily: "var(--f-display)", fontWeight: 800,
                fontSize: "clamp(22px, 2.5vw, 30px)", letterSpacing: "-0.03em",
                lineHeight: 1.1, color: "#fff", marginBottom: 6,
              }}>
                {f.title}
              </h3>
              <h3 style={{
                fontFamily: "var(--f-serif)", fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(20px, 2.3vw, 28px)", color: "rgba(255,255,255,0.45)",
                letterSpacing: "-0.01em", marginBottom: 24, lineHeight: 1.1,
              }}>
                {f.titleItalic}
              </h3>

              <p style={{
                fontFamily: "var(--f-serif)", fontWeight: 300, fontSize: 15,
                color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEFORE / AFTER STRIP ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        maxWidth: 1100, margin: "0 auto", padding: "80px 6vw",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
        background: "rgba(255,255,255,0)",
      }}>
        {/* Before */}
        <div style={{ padding: "40px 40px 40px 0", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", marginBottom: 24, textTransform: "uppercase" }}>Before — Chaos</div>
          {["Google Internship deadline tmrw??", "FWD: FWD: Newsletter Vol. 93", "RE: RE: RE: Can we meet?", "Scholarship application — last reminder", "Your Amazon order has shipped", "LUMS thesis submission form", "Promo: 50% off pizza this weekend"].map((s, i) => (
            <div key={i} style={{
              padding: "10px 14px", marginBottom: 4,
              background: "rgba(255,255,255,0.03)",
              fontFamily: "var(--f-serif)", fontSize: 14, color: "rgba(255,255,255,0.35)",
              borderLeft: "2px solid rgba(255,255,255,0.07)",
              transition: "all 0.2s",
            }}>
              {s}
            </div>
          ))}
        </div>

        {/* After */}
        <div style={{ padding: "40px 0 40px 40px" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", marginBottom: 24, textTransform: "uppercase" }}>After — Clarity</div>
          {[
            { t: "Google Internship — Apply NOW", p: "CRITICAL", s: 94 },
            { t: "LUMS thesis submission form", p: "HIGH", s: 81 },
            { t: "Scholarship — last reminder", p: "HIGH", s: 76 },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "14px 18px", marginBottom: 6,
              background: "rgba(255,255,255,0.04)",
              borderLeft: `2px solid ${i === 0 ? "#fff" : "rgba(255,255,255,0.3)"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 13, color: "#fff" }}>{item.t}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>{item.s}/100</span>
              </div>
              <span style={{
                fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.12em",
                padding: "2px 8px",
                background: i === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {item.p}
              </span>
            </div>
          ))}
          <div style={{
            marginTop: 20, padding: "12px 18px",
            border: "1px solid rgba(255,255,255,0.07)",
            fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em",
          }}>
            + 4 low-priority archived automatically
          </div>
        </div>
      </div>
    </section>
  );
}
