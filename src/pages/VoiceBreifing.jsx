// ──────────────────────────────────────────────────────
//  VoiceBriefing.jsx
//  One button. Reads a 30-second AI morning briefing
//  using the browser's free Web Speech API.
//
//  USAGE:
//    import VoiceBriefing from './VoiceBriefing.jsx'
//    <VoiceBriefing results={results} />
//
//  results shape (same object from analyzeEmails):
//  {
//    opportunities: [
//      { title, priority, deadline, organization, score }
//    ]
//  }
// ──────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence }      from 'framer-motion'

// ── Build the spoken script from results ──────────────
function buildScript(opportunities) {
  if (!opportunities || opportunities.length === 0)
    return "No opportunities were found in your emails. Try pasting more emails and analyzing again."

  const high   = opportunities.filter(o => o.priority === 'high')
  const medium = opportunities.filter(o => o.priority === 'medium')
  const total  = opportunities.length

  // Opening
  let script = `Inbox I.Q. briefing. `
  script += `You have ${total} opportunit${total === 1 ? 'y' : 'ies'} detected. `

  if (high.length > 0)
    script += `${high.length} of them ${high.length === 1 ? 'is' : 'are'} high priority. `

  script += `Here is your briefing. `

  // Top 3 opportunities narrated
  const top = opportunities.slice(0, 3)
  top.forEach((opp, i) => {
    const ordinal = ['First', 'Second', 'Third'][i]
    const dl = opp.deadline
      ? `The deadline is ${opp.deadline}.`
      : `No deadline was specified.`
    const org = opp.organization ? `from ${opp.organization}. ` : ''
    script += `${ordinal}: ${opp.title}. ${org}${dl} Relevance score: ${opp.score} out of 100. `
  })

  if (opportunities.length > 3)
    script += `There ${opportunities.length - 3 === 1 ? 'is' : 'are'} also ${opportunities.length - 3} more opportunit${opportunities.length - 3 === 1 ? 'y' : 'ies'} waiting for your review. `

  // Closing
  const urgent = opportunities.find(o => o.priority === 'high')
  if (urgent)
    script += `Your most urgent action is: ${urgent.title}. Do not miss it. `

  script += `Good luck. End of briefing.`
  return script
}

// ── Parse deadline string → days remaining ───────────
function daysUntil(deadlineStr) {
  if (!deadlineStr) return null
  const now     = new Date()
  const parsed  = new Date(`${deadlineStr} ${now.getFullYear()}`)
  if (isNaN(parsed)) return null
  const diff = Math.ceil((parsed - now) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

// ── Main component ─────────────────────────────────────
export default function VoiceBriefing({ results }) {
  const [state,    setState]    = useState('idle')   // idle | speaking | paused | done | unsupported
  const [progress, setProgress] = useState(0)        // 0–1
  const [wordIdx,  setWordIdx]  = useState(0)
  const utterRef  = useRef(null)
  const timerRef  = useRef(null)
  const startRef  = useRef(null)
  const durationRef = useRef(1)

  const opportunities = results?.opportunities || []
  const script        = buildScript(opportunities)
  const words         = script.split(' ')

  // Check browser support
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Cleanup on unmount
  useEffect(() => () => {
    window.speechSynthesis?.cancel()
    clearInterval(timerRef.current)
  }, [])

  function speak() {
    if (!supported) { setState('unsupported'); return }

    window.speechSynthesis.cancel()
    clearInterval(timerRef.current)

    const utter = new SpeechSynthesisUtterance(script)
    utter.rate   = 0.92
    utter.pitch  = 1.0
    utter.volume = 1.0

    // Pick a good voice — prefer a male English voice for the "briefing" feel
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && /daniel|alex|google us|microsoft david/i.test(v.name)
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0]
    if (preferred) utter.voice = preferred

    // Estimate duration (avg ~140 words/min at rate 0.92)
    const estSeconds = (words.length / 140) * 60 / 0.92
    durationRef.current = estSeconds

    utter.onstart = () => {
      setState('speaking')
      startRef.current = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startRef.current) / 1000
        setProgress(Math.min(elapsed / durationRef.current, 1))
      }, 80)
    }

    utter.onboundary = (e) => {
      if (e.name === 'word') {
        const charIdx = e.charIndex
        // estimate word index from char position
        const spoken = script.slice(0, charIdx).split(' ').length
        setWordIdx(spoken)
      }
    }

    utter.onend = () => {
      setState('done')
      setProgress(1)
      clearInterval(timerRef.current)
    }

    utter.onerror = () => {
      setState('idle')
      clearInterval(timerRef.current)
    }

    utterRef.current = utter
    window.speechSynthesis.speak(utter)
  }

  function pause() {
    window.speechSynthesis.pause()
    setState('paused')
    clearInterval(timerRef.current)
  }

  function resume() {
    window.speechSynthesis.resume()
    setState('speaking')
    startRef.current = Date.now() - progress * durationRef.current * 1000
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      setProgress(Math.min(elapsed / durationRef.current, 1))
    }, 80)
  }

  function stop() {
    window.speechSynthesis.cancel()
    clearInterval(timerRef.current)
    setState('idle')
    setProgress(0)
    setWordIdx(0)
  }

  // ── Stats for the card ──────────────────────────────
  const highCount   = opportunities.filter(o => o.priority === 'high').length
  const mostUrgent  = opportunities.find(o => o.priority === 'high') || opportunities[0]
  const daysLeft    = mostUrgent ? daysUntil(mostUrgent?.deadline) : null

  if (!results || opportunities.length === 0) return null

  return (
    <motion.div
      style={s.wrap}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.overline}>// VOICE BRIEFING</span>
          <h2 style={s.title}>Brief Me</h2>
          <p style={s.subtitle}>
            A 30-second spoken summary of your top opportunities
          </p>
        </div>

        {/* Live waveform when speaking */}
        <AnimatePresence>
          {state === 'speaking' && <Waveform />}
        </AnimatePresence>
      </div>

      {/* ── Stats row ── */}
      <div style={s.statsRow}>
        <Stat label="Opportunities" value={opportunities.length} />
        <Stat label="High Priority" value={highCount} />
        <Stat label="Most Urgent" value={mostUrgent?.title?.split(' ').slice(0, 3).join(' ') + '…'} small />
        {daysLeft && <Stat label="Days Left" value={`${daysLeft}d`} />}
      </div>

      {/* ── Progress bar ── */}
      <div style={s.progressTrack}>
        <motion.div
          style={s.progressFill}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ── Script preview (scrolling highlighted words) ── */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            style={s.scriptBox}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p style={s.scriptText}>
              {words.map((word, i) => (
                <span
                  key={i}
                  style={{
                    ...s.word,
                    ...(i < wordIdx ? s.wordSpoken : {}),
                    ...(i === wordIdx ? s.wordActive : {}),
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls ── */}
      <div style={s.controls}>

        {state === 'idle' || state === 'done' ? (
          <BriefButton onClick={speak} label={state === 'done' ? 'Brief Me Again' : 'Brief Me'} icon="▶" primary />
        ) : state === 'speaking' ? (
          <>
            <BriefButton onClick={pause} label="Pause" icon="⏸" />
            <BriefButton onClick={stop}  label="Stop"  icon="■" />
          </>
        ) : state === 'paused' ? (
          <>
            <BriefButton onClick={resume} label="Resume" icon="▶" primary />
            <BriefButton onClick={stop}   label="Stop"   icon="■" />
          </>
        ) : null}

        {state === 'unsupported' && (
          <p style={s.unsupported}>
            ⚠ Your browser doesn't support speech synthesis.
            Try Chrome or Edge.
          </p>
        )}

      </div>

    </motion.div>
  )
}

// ── Sub-components ─────────────────────────────────────

function Stat({ label, value, small }) {
  return (
    <div style={s.stat}>
      <span style={{ ...s.statVal, fontSize: small ? '13px' : '22px' }}>{value}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  )
}

function BriefButton({ onClick, label, icon, primary }) {
  return (
    <motion.button
      style={{ ...s.btn, ...(primary ? s.btnPrimary : {}) }}
      onClick={onClick}
      whileHover={{ scale: 1.04, ...(primary ? { background: '#fff', color: '#000' } : { borderColor: 'rgba(255,255,255,0.4)' }) }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span style={s.btnIcon}>{icon}</span> {label}
    </motion.button>
  )
}

function Waveform() {
  const bars = 12
  return (
    <motion.div
      style={s.waveform}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          style={s.waveBar}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.7 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.07,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}

// ── Styles ─────────────────────────────────────────────
const s = {
  wrap: {
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '2px',
    padding: '32px',
    margin: '32px 0',
    fontFamily: '"DM Sans", sans-serif',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
  },
  headerLeft: {},
  overline: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.28)',
    fontFamily: '"DM Mono", monospace',
    marginBottom: '8px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 300,
    letterSpacing: '-0.03em',
    fontFamily: '"Cormorant Garamond", serif',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.38)',
    margin: 0,
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.03em',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    padding: '20px 0',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: '24px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statVal: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '22px',
    fontWeight: 300,
    color: '#fff',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '9px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    fontFamily: '"DM Mono", monospace',
  },
  progressTrack: {
    height: '2px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '1px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    background: '#fff',
    borderRadius: '1px',
    width: '0%',
  },
  scriptBox: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '2px',
    padding: '18px 20px',
    marginBottom: '20px',
    maxHeight: '110px',
    overflowY: 'auto',
  },
  scriptText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.85,
    fontFamily: '"DM Mono", monospace',
  },
  word: {
    color: 'rgba(255,255,255,0.2)',
    transition: 'color 0.1s',
  },
  wordSpoken: {
    color: 'rgba(255,255,255,0.3)',
  },
  wordActive: {
    color: '#fff',
    fontWeight: 500,
  },
  controls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.6)',
    padding: '12px 24px',
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: '"DM Mono", monospace',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'border-color 0.2s, color 0.2s',
  },
  btnPrimary: {
    border: '1px solid rgba(255,255,255,0.5)',
    color: '#fff',
  },
  btnIcon: {
    fontSize: '10px',
  },
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    height: '36px',
  },
  waveBar: {
    width: '3px',
    height: '24px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '2px',
    transformOrigin: 'center',
  },
  unsupported: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.05em',
  },
}