// ──────────────────────────────────────────────────────
//  ExportPDF.jsx
//  Generates a stunning black/white mission briefing PDF
//  using jsPDF (client-side, no backend needed).
//
//  INSTALL:
//    npm install jspdf
//
//  USAGE:
//    import ExportPDF from './ExportPDF.jsx'
//    <ExportPDF results={results} profile={profile} />
// ──────────────────────────────────────────────────────

import { useState }       from 'react'
import { motion }         from 'framer-motion'
import { jsPDF }          from 'jspdf'

// ── Helpers ────────────────────────────────────────────
const W  = 210   // A4 width  mm
const H  = 297   // A4 height mm
const ML = 18    // margin left
const MR = 18    // margin right
const CW = W - ML - MR  // content width

function priorityOpacity(p) {
  return p === 'high' ? 1 : p === 'medium' ? 0.55 : 0.3
}

function scoreBarWidth(score) {
  return (score / 100) * CW
}

// Draw a thin horizontal rule
function rule(doc, y, opacity = 0.12) {
  doc.setDrawColor(0)
  doc.setGState(new doc.GState({ opacity }))
  doc.setLineWidth(0.2)
  doc.line(ML, y, W - MR, y)
  doc.setGState(new doc.GState({ opacity: 1 }))
  return y
}

// Wrapped text helper — returns new Y after drawing
function wrappedText(doc, text, x, y, maxW, lineH) {
  const lines = doc.splitTextToSize(text, maxW)
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

// Checkbox row
function checkbox(doc, x, y, text, maxW) {
  // Draw box
  doc.setDrawColor(0)
  doc.setFillColor(255)
  doc.setLineWidth(0.3)
  doc.rect(x, y - 2.8, 3, 3, 'S')
  // Text
  doc.text(doc.splitTextToSize(text, maxW - 6), x + 5, y)
  const lines = doc.splitTextToSize(text, maxW - 6)
  return y + lines.length * 4.5
}

// ── Main PDF generator ─────────────────────────────────
function generatePDF(results, profile) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const opportunities = results?.opportunities || []
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })

  // ── PAGE 1: COVER ──────────────────────────────────
  doc.setFillColor(0)
  doc.rect(0, 0, W, H, 'F')

  // Grid pattern (subtle dots)
  doc.setFillColor(40)
  for (let gx = 10; gx < W; gx += 12) {
    for (let gy = 10; gy < H; gy += 12) {
      doc.circle(gx, gy, 0.25, 'F')
    }
  }

  // Top classification bar
  doc.setFillColor(255)
  doc.rect(0, 0, W, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(0)
  doc.text('INBOXIQ · OPPORTUNITY INTELLIGENCE REPORT · CLASSIFIED', W / 2, 5.2, { align: 'center' })

  // Logo area
  doc.setTextColor(255)
  doc.setFont('helvetica', 'thin')
  doc.setFontSize(52)
  doc.text('Inbox', ML, 80)
  doc.setFont('helvetica', 'bolditalic')
  doc.text('IQ', ML + 76, 80)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text('AI-POWERED OPPORTUNITY INTELLIGENCE', ML, 90)

  // Horizontal rule
  doc.setDrawColor(255)
  doc.setGState(new doc.GState({ opacity: 0.15 }))
  doc.setLineWidth(0.3)
  doc.line(ML, 98, W - MR, 98)
  doc.setGState(new doc.GState({ opacity: 1 }))

  // Report metadata
  const metaY = 110
  const metaItems = [
    ['REPORT DATE',    dateStr],
    ['GENERATED AT',   timeStr],
    ['TOTAL FOUND',    `${opportunities.length} Opportunities`],
    ['HIGH PRIORITY',  `${opportunities.filter(o => o.priority === 'high').length} Flagged`],
    ['SUBJECT',        profile.degree || 'Not specified'],
    ['CGPA',           profile.cgpa   || 'Not specified'],
  ]

  doc.setFontSize(7)
  metaItems.forEach(([label, value], i) => {
    const col  = i % 2 === 0 ? ML : W / 2 + 4
    const row  = metaY + Math.floor(i / 2) * 14
    doc.setTextColor(90)
    doc.setFont('helvetica', 'bold')
    doc.text(label, col, row)
    doc.setTextColor(220)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(value, col, row + 5.5)
    doc.setFontSize(7)
  })

  // Vertical accent line
  doc.setDrawColor(255)
  doc.setGState(new doc.GState({ opacity: 0.08 }))
  doc.setLineWidth(0.3)
  doc.line(W / 2, metaY - 4, W / 2, metaY + 42)
  doc.setGState(new doc.GState({ opacity: 1 }))

  // Skills strip
  if (profile.skills) {
    const skillY = metaY + 56
    doc.setTextColor(60)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.text('SKILLS & INTERESTS', ML, skillY)
    doc.setTextColor(180)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(profile.skills, ML, skillY + 5)
  }

  // Score summary bar chart
  const chartY = 195
  doc.setTextColor(60)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.text('OPPORTUNITY SCORE OVERVIEW', ML, chartY)

  const maxBars = Math.min(opportunities.length, 6)
  const barH    = 4
  const barGap  = 8
  opportunities.slice(0, maxBars).forEach((opp, i) => {
    const by    = chartY + 6 + i * barGap
    const bw    = (opp.score / 100) * (CW - 30)
    // Label
    doc.setTextColor(100)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.5)
    const label = opp.title.length > 28 ? opp.title.slice(0, 28) + '…' : opp.title
    doc.text(label, ML, by + barH - 1)
    // Track
    doc.setFillColor(30)
    doc.roundedRect(ML + 72, by, CW - 30 - 72 + 30, barH, 0.5, 0.5, 'F')
    // Fill
    doc.setFillColor(opp.priority === 'high' ? 240 : opp.priority === 'medium' ? 160 : 90)
    doc.roundedRect(ML + 72, by, bw - 42, barH, 0.5, 0.5, 'F')
    // Score number
    doc.setTextColor(120)
    doc.setFontSize(5.5)
    doc.text(`${opp.score}`, W - MR, by + barH - 1, { align: 'right' })
  })

  // Bottom classification bar
  doc.setFillColor(255)
  doc.setGState(new doc.GState({ opacity: 0.07 }))
  doc.rect(0, H - 12, W, 12, 'F')
  doc.setGState(new doc.GState({ opacity: 1 }))
  doc.setTextColor(60)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.5)
  doc.text(`InboxIQ Intelligence Report · ${dateStr} · Page 1 of ${opportunities.length + 1}`, W / 2, H - 5, { align: 'center' })

  // ── PAGES 2+: ONE OPPORTUNITY PER PAGE ────────────
  opportunities.forEach((opp, pageIdx) => {
    doc.addPage()

    // White page background
    doc.setFillColor(255)
    doc.rect(0, 0, W, H, 'F')

    let y = 0

    // ── Header band ──
    doc.setFillColor(0)
    doc.rect(0, 0, W, 22, 'F')

    // Rank badge
    doc.setFillColor(255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(0)
    doc.roundedRect(ML, 6, 10, 10, 1, 1, 'F')
    doc.text(`#${opp.rank}`, ML + 5, 12.5, { align: 'center' })

    // Title
    doc.setTextColor(255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    const titleX = ML + 14
    const titleMaxW = CW - 40
    const titleLines = doc.splitTextToSize(opp.title, titleMaxW)
    doc.text(titleLines, titleX, 10.5)

    // Priority badge top-right
    const priLabel = opp.priority.toUpperCase()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(opp.priority === 'high' ? 0 : 180)
    doc.setFillColor(opp.priority === 'high' ? 255 : 60)
    const priW = 18
    doc.roundedRect(W - MR - priW, 7, priW, 8, 1, 1, 'F')
    doc.text(priLabel, W - MR - priW / 2, 12.2, { align: 'center' })

    // Score arc label
    doc.setTextColor(140)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.5)
    doc.text(`${opp.score}/100`, W - MR - priW - 6, 13, { align: 'right' })

    y = 28

    // ── Score progress bar ──
    doc.setFillColor(230)
    doc.rect(ML, y, CW, 2, 'F')
    doc.setFillColor(0)
    doc.rect(ML, y, scoreBarWidth(opp.score), 2, 'F')
    y += 8

    // ── Meta row ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(80)

    const metaCols = []
    if (opp.deadline)      metaCols.push(['DEADLINE', opp.deadline])
    if (opp.organization)  metaCols.push(['ORGANIZATION', opp.organization])
    if (opp.type)          metaCols.push(['TYPE', opp.type])

    const colW = CW / Math.max(metaCols.length, 1)
    metaCols.forEach(([label, val], ci) => {
      const cx = ML + ci * colW
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(5.5)
      doc.setTextColor(140)
      doc.text(label, cx, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(20)
      doc.text(String(val), cx, y + 5)
    })

    y += 16
    rule(doc, y, 0.1)
    y += 6

    // ── Link ──
    if (opp.contact_or_link) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.setTextColor(80)
      doc.text('LINK / CONTACT', ML, y)
      y += 4
      doc.setTextColor(30)
      doc.setFontSize(7.5)
      const linkTxt = opp.contact_or_link.length > 80
        ? opp.contact_or_link.slice(0, 80) + '…'
        : opp.contact_or_link
      doc.text(linkTxt, ML, y)
      y += 8
      rule(doc, y, 0.08)
      y += 6
    }

    // ── Why Relevant ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(100)
    doc.text('WHY THIS IS RELEVANT FOR YOU', ML, y)
    y += 5

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(40)
    y = wrappedText(doc, opp.why_relevant || '', ML, y, CW, 5)
    y += 6

    rule(doc, y, 0.1)
    y += 7

    // ── Two column: Eligibility + Required Docs ──
    const halfW = (CW - 8) / 2

    // Left: Eligibility
    if (opp.eligibility?.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(100)
      doc.text('ELIGIBILITY', ML, y)
      let ely = y + 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(30)
      opp.eligibility.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, halfW)
        doc.text(lines, ML, ely)
        ely += lines.length * 4.2 + 1
      })
    }

    // Right: Required Docs
    if (opp.required_docs?.length > 0) {
      const rx = ML + halfW + 8
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(100)
      doc.text('REQUIRED DOCUMENTS', rx, y)
      let rdy = y + 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(30)
      opp.required_docs.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, halfW)
        doc.text(lines, rx, rdy)
        rdy += lines.length * 4.2 + 1
      })
    }

    // Advance y past both columns
    const eligH = opp.eligibility?.length
      ? opp.eligibility.reduce((acc, item) => {
          return acc + doc.splitTextToSize(`• ${item}`, halfW).length * 4.2 + 1
        }, 5) : 0
    const docsH = opp.required_docs?.length
      ? opp.required_docs.reduce((acc, item) => {
          return acc + doc.splitTextToSize(`• ${item}`, halfW).length * 4.2 + 1
        }, 5) : 0
    y += Math.max(eligH, docsH) + 8

    rule(doc, y, 0.1)
    y += 7

    // ── Action Checklist ──
    if (opp.action_checklist?.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(100)
      doc.text('ACTION CHECKLIST', ML, y)
      y += 6

      opp.action_checklist.forEach((step, si) => {
        // Step number
        doc.setFillColor(0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6)
        doc.setTextColor(255)
        doc.roundedRect(ML, y - 3, 5, 4.5, 0.5, 0.5, 'F')
        doc.text(String(si + 1), ML + 2.5, y, { align: 'center' })

        // Checkbox
        doc.setDrawColor(160)
        doc.setFillColor(255)
        doc.setLineWidth(0.25)
        doc.rect(ML + 7, y - 3, 3.5, 3.5, 'S')

        // Step text
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7.5)
        doc.setTextColor(20)
        const lines = doc.splitTextToSize(step, CW - 14)
        doc.text(lines, ML + 13, y)
        y += lines.length * 4.2 + 3

        // Subtle separator between steps
        if (si < opp.action_checklist.length - 1) {
          doc.setDrawColor(220)
          doc.setGState(new doc.GState({ opacity: 0.5 }))
          doc.setLineWidth(0.1)
          doc.line(ML + 6, y - 1.5, W - MR, y - 1.5)
          doc.setGState(new doc.GState({ opacity: 1 }))
        }
      })
    }

    // ── Page footer ──
    doc.setFillColor(0)
    doc.rect(0, H - 10, W, 10, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.5)
    doc.setTextColor(80)
    doc.text(
      `InboxIQ · Opportunity #${opp.rank} of ${opportunities.length} · ${dateStr}`,
      ML, H - 4
    )
    doc.text(
      `Page ${pageIdx + 2} of ${opportunities.length + 1}`,
      W - MR, H - 4, { align: 'right' }
    )
    // White dot accent
    doc.setFillColor(255)
    doc.setGState(new doc.GState({ opacity: 0.15 }))
    doc.circle(W / 2, H - 5, 0.8, 'F')
    doc.setGState(new doc.GState({ opacity: 1 }))
  })

  // Save
  const filename = `InboxIQ_Briefing_${now.toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

// ── React Component ────────────────────────────────────
export default function ExportPDF({ results, profile = {} }) {
  const [state, setState] = useState('idle') // idle | generating | done

  const opportunities = results?.opportunities || []
  if (opportunities.length === 0) return null

  async function handleExport() {
    setState('generating')
    // Small delay so the button animation plays
    await new Promise(r => setTimeout(r, 120))
    try {
      generatePDF(results, profile)
      setState('done')
      setTimeout(() => setState('idle'), 3000)
    } catch (e) {
      console.error('PDF generation failed:', e)
      setState('idle')
    }
  }

  return (
    <motion.div
      style={s.wrap}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left info */}
      <div style={s.info}>
        <span style={s.overline}>// EXPORT</span>
        <p style={s.label}>Mission Briefing PDF</p>
        <p style={s.sub}>
          {opportunities.length} opportunit{opportunities.length === 1 ? 'y' : 'ies'} ·
          black &amp; white · print-ready · A4
        </p>
      </div>

      {/* Preview pills */}
      <div style={s.pills}>
        {['Cover Page', 'Score Charts', 'Per-Opportunity', 'Checklists'].map(p => (
          <span key={p} style={s.pill}>{p}</span>
        ))}
      </div>

      {/* Button */}
      <motion.button
        style={{
          ...s.btn,
          ...(state === 'done' ? s.btnDone : {}),
        }}
        onClick={handleExport}
        disabled={state === 'generating'}
        whileHover={state === 'idle' ? { scale: 1.03, background: '#fff', color: '#000' } : {}}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {state === 'idle'       && <><DownloadIcon /> Export PDF</>}
        {state === 'generating' && <><Spinner /> Generating…</>}
        {state === 'done'       && <>✓ Downloaded</>}
      </motion.button>
    </motion.div>
  )
}

// ── Icons ──────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginRight: 6 }}>
      <path d="M6.5 1v7M3.5 5.5l3 3 3-3M1.5 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function Spinner() {
  return (
    <motion.span
      style={{
        display: 'inline-block', width: 11, height: 11, marginRight: 7,
        border: '1.5px solid rgba(255,255,255,0.25)',
        borderTopColor: '#fff', borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ── Styles ─────────────────────────────────────────────
const s = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '2px',
    padding: '20px 24px',
    margin: '16px 0',
    fontFamily: '"DM Sans", sans-serif',
  },
  info: {
    flexShrink: 0,
  },
  overline: {
    display: 'block',
    fontSize: '9px',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: '"DM Mono", monospace',
    marginBottom: '4px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#fff',
    margin: '0 0 3px',
    letterSpacing: '-0.01em',
  },
  sub: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.04em',
    margin: 0,
  },
  pills: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    flex: 1,
  },
  pill: {
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '4px 9px',
    borderRadius: '100px',
    fontFamily: '"DM Mono", monospace',
    whiteSpace: 'nowrap',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#fff',
    padding: '12px 28px',
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: '"DM Mono", monospace',
    cursor: 'pointer',
    borderRadius: '2px',
    flexShrink: 0,
    transition: 'background 0.2s, color 0.2s',
    whiteSpace: 'nowrap',
  },
  btnDone: {
    borderColor: 'rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.5)',
  },
}