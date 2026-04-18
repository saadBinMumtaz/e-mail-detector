// ──────────────────────────────────────────────────────
//  components/landing/Hero.jsx
//  "Analyze My Inbox" → navigates to /analyze
//  "Watch Demo"       → scrolls to #how section
// ──────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Particle canvas ────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let W, H, particles, raf

    const SYMBOLS = ['@', '@', '@', '✉', '·', '·', '·', '·']

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function makeParticle() {
      return {
        x:      Math.random() * W,
        y:      Math.random() * H,
        vx:     (Math.random() - 0.5) * 0.32,
        vy:     (Math.random() - 0.5) * 0.32,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        alpha:  0.07 + Math.random() * 0.18,
        size:   9 + Math.random() * 8,
      }
    }

    function init() {
      resize()
      const count = Math.floor((W * H) / 13000)
      particles = Array.from({ length: count }, makeParticle)
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const { x: mx, y: my } = mouseRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20) p.y = H + 20
        if (p.y > H + 20) p.y = -20

        ctx.font          = `${p.size}px 'DM Mono', monospace`
        ctx.textAlign     = 'center'
        ctx.textBaseline  = 'middle'
        ctx.fillStyle     = `rgba(255,255,255,${p.alpha})`
        ctx.fillText(p.symbol, p.x, p.y)

        // connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q  = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 120) * 0.09})`
            ctx.lineWidth   = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        // mouse repel
        const rdx = p.x - mx
        const rdy = p.y - my
        const rd  = Math.sqrt(rdx * rdx + rdy * rdy)
        if (rd < 100) {
          const force = ((100 - rd) / 100) * 0.85
          p.x += (rdx / rd) * force
          p.y += (rdy / rd) * force
        }
      }
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()

    const onMouseMove = (e) => {
      const rect    = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

// ── Typewriter hook ────────────────────────────────────
function useTypewriter(sequences, speed = 52) {
  const [display, setDisplay] = useState('')
  const [seqIdx,  setSeqIdx]  = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [waiting,  setWaiting]  = useState(false)

  useEffect(() => {
    if (waiting) return
    const current = sequences[seqIdx]
    const delay   = deleting ? 26 : speed

    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setWaiting(true)
          setTimeout(() => { setDeleting(true); setWaiting(false) }, 2200)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setSeqIdx(s => (s + 1) % sequences.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, delay)

    return () => clearTimeout(t)
  }, [charIdx, deleting, seqIdx, sequences, speed, waiting])

  return display
}

// ── Email rank cards data ─────────────────────────────
const CARDS = [
  { rank: '01', priority: 'CRITICAL', sender: 'LUMS Career Services', subject: 'Google Summer Internship — Deadline in 3 days', score: 94 },
  { rank: '02', priority: 'HIGH',     sender: 'MIT EECS Dept.',        subject: 'Shortlisted: Research Fellowship 2025',          score: 81 },
  { rank: '03', priority: 'HIGH',     sender: 'NUST Innovation Hub',   subject: 'Startup Grant Applications Open',                 score: 76 },
  { rank: '04', priority: 'MEDIUM',   sender: 'HEC Pakistan',          subject: 'Overseas Scholarship Batch 2025 — Open',         score: 63 },
]

// ── Hero component ─────────────────────────────────────
export default function Hero() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const typed = useTypewriter([
    'Your inbox has 47 unread emails.',
    'We found 6 that actually matter.',
    'Stop drowning. Start ranking.',
    'Built for students. Tuned for SOFTEC.',
  ])

  return (
    <section style={styles.section}>
      <style>{css}</style>

      <div style={styles.noise} />
      <div style={styles.gridLines} />
      <ParticleCanvas />

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <span style={styles.logo}>
          Inbox<em style={styles.logoEm}>IQ</em>
        </span>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink} className="nav-link">Features</a>
          <a href="#how"      style={styles.navLink} className="nav-link">How it works</a>
          <a href="#demo"     style={styles.navLink} className="nav-link">Demo</a>
          {/* ── PRIMARY NAV CTA ── navigates to /analyze ── */}
          <button
            style={styles.navCta}
            onClick={() => navigate('/analyze')}
            className="nav-cta"
          >
            Launch App →
          </button>
        </div>
      </nav>

      {/* ── TWO-COLUMN HERO BODY ── */}
      <div style={styles.heroBody}>

        {/* LEFT: headline + typewriter + CTAs */}
        <div
          style={{
            ...styles.heroLeft,
            opacity:   mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(22px)',
            transition: 'opacity .8s ease, transform .8s ease',
          }}
        >
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowLine} />
            AI-Powered Email Intelligence
            <span style={styles.eyebrowLine} />
          </div>

          <h1 style={styles.h1}>
            Stop reading.
            <span style={styles.h1Serif}>Start ranking.</span>
          </h1>

          <div style={styles.twRow}>
            <span style={styles.twNum}>— 01</span>
            <span style={styles.twText}>
              {typed}
              <span style={styles.cursor} />
            </span>
          </div>

          <div style={styles.actions}>
            {/* ── MAIN CTA — navigates to /analyze ── */}
            <button
              style={styles.btnPrimary}
              className="btn-primary"
              onClick={() => navigate('/analyze')}
            >
              Analyze My Inbox
            </button>

            <button
              style={styles.btnSecondary}
              className="btn-secondary"
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* RIGHT: email rank cards */}
        <div style={styles.heroRight}>
          <div style={styles.cardsLabel}>Top opportunities — ranked</div>
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="fcard"
              style={{ ...styles.fcard, animationDelay: `${0.5 + i * 0.22}s` }}
            >
              <div style={styles.fcardTop}>
                <span style={styles.fcardRank}>#{card.rank}</span>
                <span style={{
                  ...styles.fcardBadge,
                  ...(card.priority === 'CRITICAL' ? styles.fcardBadgeCrit : {}),
                }}>
                  {card.priority}
                </span>
              </div>
              <div style={styles.fcardSender}>{card.sender}</div>
              <div style={styles.fcardSub}>{card.subject}</div>
              <div style={styles.fcardBar}>
                <div style={styles.fcardTrack}>
                  <div style={{ ...styles.fcardFill, width: `${card.score}%` }} />
                </div>
                <span style={styles.fcardScore}>{card.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCROLL HINT ── */}
      <div style={styles.scrollHint}>
        <span style={styles.scrollLine} />
        Scroll to explore
      </div>
    </section>
  )
}

// ── Inline styles ─────────────────────────────────────
const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    overflow: 'hidden',
  },
  noise: {
    position: 'absolute', inset: 0, opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '200px', pointerEvents: 'none',
  },
  gridLines: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)`,
    backgroundSize: '72px 72px',
  },
  nav: {
    position: 'relative', zIndex: 10,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(20px)',
  },
  logo: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 800, fontSize: 19, letterSpacing: '-0.04em', color: '#fff',
  },
  logoEm: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic', fontWeight: 300,
  },
  navLinks: { display: 'flex', gap: 32, alignItems: 'center' },
  navLink: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.35)', textDecoration: 'none', transition: 'color .2s',
  },
  navCta: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 600, fontSize: 12, letterSpacing: '-.01em',
    color: '#000', background: '#fff', border: 'none',
    padding: '9px 20px', cursor: 'pointer', transition: 'opacity .15s, transform .15s',
  },
  heroBody: {
    flex: 1,
    position: 'relative', zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    columnGap: 48,
    alignItems: 'center',
    padding: '0 48px',
  },
  heroLeft: { padding: '72px 0' },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.32)', marginBottom: 26,
  },
  eyebrowLine: {
    display: 'inline-block', width: 24, height: 1,
    background: 'rgba(255,255,255,.22)',
  },
  h1: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 800, fontSize: 'clamp(42px, 5.5vw, 76px)',
    letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff',
  },
  h1Serif: {
    display: 'block',
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic', fontWeight: 300,
    color: 'rgba(255,255,255,.55)', letterSpacing: '-.02em', marginTop: 6,
  },
  twRow: {
    display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 36,
  },
  twNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: '.1em', color: 'rgba(255,255,255,.22)',
    paddingTop: 4, flexShrink: 0,
  },
  twText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(16px, 1.8vw, 21px)', fontWeight: 300,
    color: 'rgba(255,255,255,.55)', lineHeight: 1.45, minHeight: '1.45em',
  },
  cursor: {
    display: 'inline-block', width: 2, height: '0.85em',
    background: '#fff', verticalAlign: 'middle', marginLeft: 3,
    animation: 'blink 1s step-end infinite',
  },
  actions: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 44 },
  btnPrimary: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 600, fontSize: 13, letterSpacing: '-.01em',
    color: '#000', background: '#fff', border: 'none',
    padding: '13px 32px', cursor: 'pointer',
    transition: 'opacity .15s, transform .15s',
  },
  btnSecondary: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.42)', background: 'transparent',
    border: '1px solid rgba(255,255,255,.13)',
    padding: '13px 24px', cursor: 'pointer',
    transition: 'color .2s, border-color .2s',
  },
  heroRight: {
    display: 'flex', flexDirection: 'column', gap: 10,
    padding: '72px 0', position: 'relative', zIndex: 2,
  },
  cardsLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.2)',
    marginBottom: 6, paddingBottom: 10,
    borderBottom: '1px solid rgba(255,255,255,.06)',
  },
  fcard: {
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.08)',
    backdropFilter: 'blur(20px)',
    padding: '14px 16px', width: '100%',
    opacity: 0, animation: 'cardIn .7s ease both',
    transition: 'border-color .2s, transform .2s',
  },
  fcardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  fcardRank: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: '.1em',
  },
  fcardBadge: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9, letterSpacing: '.1em',
    padding: '2px 8px',
    border: '1px solid rgba(255,255,255,.1)',
    color: 'rgba(255,255,255,.38)',
  },
  fcardBadgeCrit: {
    background: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.2)',
    color: '#fff',
  },
  fcardSender: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 3,
  },
  fcardSub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic', fontSize: 13,
    color: 'rgba(255,255,255,.42)', lineHeight: 1.4,
  },
  fcardBar: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 },
  fcardTrack: { flex: 1, height: 1, background: 'rgba(255,255,255,.08)' },
  fcardFill: { height: '100%', background: 'rgba(255,255,255,.45)' },
  fcardScore: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, color: 'rgba(255,255,255,.35)', flexShrink: 0,
  },
  scrollHint: {
    position: 'relative', zIndex: 2,
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 48px 28px',
    fontFamily: "'DM Mono', monospace",
    fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,.2)',
  },
  scrollLine: {
    width: 32, height: 1, background: 'rgba(255,255,255,.16)',
    animation: 'scrollPulse 2s ease-in-out infinite',
  },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Mono:wght@400&display=swap');
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes cardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes scrollPulse { 0%,100%{opacity:.2} 50%{opacity:.6} }
  .nav-link:hover { color: #fff !important; }
  .nav-cta:hover  { opacity: .85 !important; transform: translateY(-1px) !important; }
  .btn-primary:hover   { opacity: .85 !important; transform: translateY(-2px) !important; }
  .btn-secondary:hover { color: #fff !important; border-color: rgba(255,255,255,.36) !important; }
  .fcard:hover { border-color: rgba(255,255,255,.2) !important; transform: translateX(-4px) !important; }
`