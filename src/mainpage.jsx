import { useEffect, useRef, useState, useCallback } from "react";

// ─── FONT INJECTION ───────────────────────────────────────────────
const FontInjector = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,800&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      :root {
        --black: #000000;
        --white: #ffffff;
        --off-white: #f5f5f0;
        --gray-100: #e8e8e3;
        --gray-300: #b0b0a8;
        --gray-500: #6e6e66;
        --gray-700: #2e2e2a;
        --gray-900: #111110;
        --f-display: 'Bricolage Grotesque', sans-serif;
        --f-serif: 'Cormorant Garamond', serif;
        --f-mono: 'DM Mono', monospace;
      }
      body { background: #000; color: #fff; font-family: var(--f-display); -webkit-font-smoothing: antialiased; }
      ::selection { background: #fff; color: #000; }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ─── HOOKS ────────────────────────────────────────────────────────
function useTypewriter(sequences, speed = 50) {
  const [display, setDisplay] = useState("");
  const [seqIdx, setSeqIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;
    const current = sequences[seqIdx];
    const delay = deleting ? speed * 0.4 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setWaiting(true);
          setTimeout(() => {
            setDeleting(true);
            setWaiting(false);
          }, 2200);
        } else setCharIdx((c) => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setSeqIdx((s) => (s + 1) % sequences.length);
          setCharIdx(0);
        } else setCharIdx((c) => c - 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, seqIdx, sequences, speed, waiting]);

  return display;
}

function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles, raf;

    const SYMBOLS = ["@", "@", "@", "✉", "·", "·", "·", "·"];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        alpha: 0.08 + Math.random() * 0.22,
        size: 10 + Math.random() * 8,
      };
    }

    function init() {
      resize();
      const count = Math.floor((W * H) / 14000);
      particles = Array.from({ length: count }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        // draw symbol
        ctx.font = `${p.size}px 'DM Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fillText(p.symbol, p.x, p.y);

        // connect nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const strength = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${strength})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // mouse repel
        const mdx = p.x - mx, mdy = p.y - my;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 100) {
          const force = (100 - md) / 100 * 0.8;
          p.x += (mdx / md) * force;
          p.y += (mdy / md) * force;
        }
      }
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ─── HERO COMPONENT ───────────────────────────────────────────────
export function Hero() {
  const typed = useTypewriter([
    "Your inbox has 47 unread emails.",
    "We found 6 that actually matter.",
    "Stop drowning. Start ranking.",
    "Built for students. Tuned for SOFTEC.",
  ], 55);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  const s = {
    section: {
      position: "relative", minHeight: "100vh", background: "#000",
      display: "flex", flexDirection: "column", justifyContent: "center",
      overflow: "hidden", padding: "0 6vw",
    },
    noise: {
      position: "absolute", inset: 0, opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "200px 200px", pointerEvents: "none",
    },
    gridLines: {
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    },
    topBar: {
      position: "absolute", top: 0, left: 0, right: 0,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "28px 6vw",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    },
    logo: {
      fontFamily: "var(--f-display)", fontWeight: 800, fontSize: 20,
      letterSpacing: "-0.03em", color: "#fff", textDecoration: "none",
    },
    navRight: { display: "flex", gap: 40, alignItems: "center" },
    navLink: {
      fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.12em",
      color: "rgba(255,255,255,0.4)", textDecoration: "none", textTransform: "uppercase",
      transition: "color 0.2s",
    },
    navCta: {
      fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em",
      color: "#000", background: "#fff", padding: "10px 22px",
      border: "none", cursor: "pointer", textTransform: "uppercase",
    },
    content: {
      position: "relative", zIndex: 2, maxWidth: 1100,
      paddingTop: 80,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "none" : "translateY(30px)",
      transition: "opacity 0.9s ease, transform 0.9s ease",
    },
    eyebrow: {
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em",
      color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
      marginBottom: 32,
    },
    eyebrowLine: {
      display: "inline-block", width: 32, height: 1, background: "rgba(255,255,255,0.3)",
    },
    h1: {
      fontFamily: "var(--f-display)", fontWeight: 800,
      fontSize: "clamp(52px, 8vw, 112px)",
      lineHeight: 0.95, letterSpacing: "-0.04em",
      color: "#fff", marginBottom: 0,
    },
    h1Serif: {
      fontFamily: "var(--f-serif)", fontStyle: "italic",
      fontWeight: 300, color: "rgba(255,255,255,0.7)",
      display: "block", marginLeft: "0.04em",
    },
    typewriterRow: {
      marginTop: 44, display: "flex", alignItems: "flex-start", gap: 20,
      maxWidth: 700,
    },
    typewriterNum: {
      fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.1em", paddingTop: 4, flexShrink: 0,
    },
    typewriterText: {
      fontFamily: "var(--f-serif)", fontSize: "clamp(18px, 2.2vw, 26px)",
      fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.4,
    },
    cursor: {
      display: "inline-block", width: 2, height: "0.9em",
      background: "#fff", verticalAlign: "middle", marginLeft: 3,
      animation: "blink 1s step-end infinite",
    },
    actions: { display: "flex", alignItems: "center", gap: 16, marginTop: 56 },
    btnPrimary: {
      fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 14,
      letterSpacing: "-0.01em", color: "#000", background: "#fff",
      border: "none", padding: "16px 40px", cursor: "pointer",
      transition: "transform 0.15s, background 0.15s",
      position: "relative", overflow: "hidden",
    },
    btnSecondary: {
      fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
      background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
      padding: "16px 32px", cursor: "pointer",
      transition: "border-color 0.2s, color 0.2s",
    },
    scrollHint: {
      position: "absolute", bottom: 36, left: "6vw",
      display: "flex", alignItems: "center", gap: 12,
      fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.15em",
      color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
      zIndex: 2,
    },
    scrollLine: {
      width: 40, height: 1, background: "rgba(255,255,255,0.2)",
      animation: "scrollPulse 2s ease-in-out infinite",
    },
    // right side floating cards
    floatArea: {
      position: "absolute", right: "6vw", top: "50%",
      transform: "translateY(-50%)", zIndex: 2,
      display: "flex", flexDirection: "column", gap: 12,
    },
  };

  const emailPreviews = [
    { rank: "01", priority: "CRITICAL", sender: "LUMS Career Services", subject: "Google Summer Internship — Deadline in 3 days", score: 94 },
    { rank: "02", priority: "HIGH", sender: "MIT EECS Dept.", subject: "Shortlisted: Research Fellowship 2025", score: 81 },
    { rank: "03", priority: "HIGH", sender: "NUST Innovation Hub", subject: "Startup Grant Applications Open", score: 76 },
  ];

  return (
    <section style={s.section}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        @keyframes cardIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:none} }
        .hero-card { animation: cardIn 0.7s ease both; }
        .hero-card:hover { border-color: rgba(255,255,255,0.25) !important; transform: translateX(-4px); }
        .btn-primary:hover { background: #e8e8e3 !important; transform: translateY(-2px) !important; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.4) !important; color: rgba(255,255,255,0.9) !important; }
        .nav-link:hover { color: #fff !important; }
      `}</style>

      <div style={s.noise} />
      <div style={s.gridLines} />
      <ParticleCanvas />

      {/* NAV */}
      <div style={s.topBar}>
        <span style={s.logo}>Inbox<span style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontWeight: 300 }}>IQ</span></span>
        <div style={s.navRight}>
          <a href="#features" style={s.navLink} className="nav-link">Features</a>
          <a href="#how" style={s.navLink} className="nav-link">How it works</a>
          <a href="#demo" style={s.navLink} className="nav-link">Demo</a>
          <button style={s.navCta}>Launch App →</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={s.content}>
        <div style={s.eyebrow}>
          <span style={s.eyebrowLine} />
          AI-Powered Email Intelligence
          <span style={s.eyebrowLine} />
        </div>

        <h1 style={s.h1}>
          Stop reading.
          <span style={s.h1Serif}>Start ranking.</span>
        </h1>

        <div style={s.typewriterRow}>
          <span style={s.typewriterNum}>— 01</span>
          <span style={s.typewriterText}>
            {typed}<span style={s.cursor} />
          </span>
        </div>

        <div style={s.actions}>
          <button style={s.btnPrimary} className="btn-primary">Analyze My Inbox</button>
          <button style={s.btnSecondary} className="btn-secondary">Watch Demo</button>
        </div>
      </div>

      {/* FLOATING CARDS */}
      <div style={s.floatArea}>
        {emailPreviews.map((e, i) => (
          <div
            key={i}
            className="hero-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px)",
              padding: "14px 18px",
              width: 320,
              transition: "border-color 0.2s, transform 0.2s",
              animationDelay: `${0.5 + i * 0.2}s`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                #{e.rank}
              </span>
              <span style={{
                fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.12em",
                padding: "2px 8px",
                background: e.priority === "CRITICAL" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                color: e.priority === "CRITICAL" ? "#fff" : "rgba(255,255,255,0.5)",
                border: `1px solid ${e.priority === "CRITICAL" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
              }}>
                {e.priority}
              </span>
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 3 }}>{e.sender}</div>
            <div style={{ fontFamily: "var(--f-serif)", fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>{e.subject}</div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ width: `${e.score}%`, height: "100%", background: "#fff", opacity: 0.5 }} />
              </div>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{e.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SCROLL HINT */}
      <div style={s.scrollHint}>
        <span style={s.scrollLine} />
        Scroll to explore
      </div>
    </section>
  );
}

// ─── DESCRIPTION COMPONENT ───────────────────────────────────────
function StatItem({ target, suffix = "", label, triggerCount }) {
  const value = useCountUp(target, 1800, triggerCount);
  return (
    <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 32 }}>
      <div style={{
        fontFamily: "var(--f-display)", fontWeight: 800,
        fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.04em",
        lineHeight: 1, color: "#fff",
      }}>
        {value.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  );
}

export function Description() {
  const [statsRef, statsInView] = useInView(0.4);

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

// ─── FOOTER COMPONENT ─────────────────────────────────────────────
export function Footer() {
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

// ─── DEFAULT EXPORT: FULL PAGE DEMO ─────────────────────────────
export default function Homepage() {
  return (
    <>
      <FontInjector />
      <Hero />
      <Description />
      <Footer />
    </>
  );
}