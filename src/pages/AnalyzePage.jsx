// ──────────────────────────────────────────────────────
//  pages/AnalyzePage.jsx  (enhanced with Framer Motion)
// ──────────────────────────────────────────────────────
import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileForm        from '../components/ProfileForm.jsx'
import EmailInput         from '../components/EmailInput.jsx'
import ResultsList        from '../components/ResultsList.jsx'
import { analyzeEmails }  from '../analyzeEmails.js'

const EMPTY_PROFILE = {
  degree:    '',
  semester:  '',
  cgpa:      '',
  skills:    '',
  prefs:     '',
  financial: 'not specified',
}

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 28 },
  animate:   { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
})

export default function AnalyzePage() {
  const navigate = useNavigate()

  const [profile,      setProfile]      = useState(EMPTY_PROFILE)
  const [emailsText,   setEmailsText]   = useState('')
  const [status,       setStatus]       = useState('idle')
  const [results,      setResults]      = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  function handleProfileChange(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  async function handleAnalyze() {
    if (!emailsText.trim()) {
      alert('Please paste at least one email before analyzing.')
      return
    }
    setStatus('loading')
    setResults(null)
    setErrorMessage('')
    try {
      const data = await analyzeEmails(emailsText, profile)
      setResults(data)
      setStatus('done')
    } catch (err) {
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <div style={styles.page}>

      {/* ── Ambient background grid ── */}
      <div style={styles.bgGrid} />

      {/* ── Nav ── */}
      <motion.nav
        style={styles.nav}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          style={styles.backBtn}
          onClick={() => navigate('/')}
          whileHover={{ x: -4, color: '#fff' }}
          transition={{ duration: 0.15 }}
        >
          ← Back
        </motion.button>
        <span style={styles.navLogo}>
          Inbox<em style={{ fontStyle: 'italic' }}>IQ</em>
        </span>
        <div style={{ width: '80px' }} /> {/* balance */}
      </motion.nav>

      {/* ── Page header ── */}
      <div style={styles.headerWrap}>
        <motion.p style={styles.overline} {...fadeUp(0.1)}>
          Opportunity Analyzer
        </motion.p>
        <motion.h1 style={styles.pageTitle} {...fadeUp(0.2)}>
          Find what matters.<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Act on it fast.</em>
        </motion.h1>
        <motion.p style={styles.pageSub} {...fadeUp(0.3)}>
          Paste your emails · set your profile · get ranked results in seconds.
        </motion.p>

        {/* Step indicator */}
        <motion.div style={styles.steps} {...fadeUp(0.4)}>
          {['Profile', 'Emails', 'Analyze', 'Results'].map((s, i) => (
            <div key={s} style={styles.stepItem}>
              <div style={styles.stepCircle}>{i + 1}</div>
              <span style={styles.stepLabel}>{s}</span>
            </div>
          ))}
          <div style={styles.stepLine} />
        </motion.div>
      </div>

      {/* ── Main content ── */}
      <div style={styles.content}>

        {/* Step 1 */}
        <motion.div {...fadeUp(0.35)}>
          <SectionLabel num="01" label="Student Profile" />
          <ProfileForm profile={profile} onChange={handleProfileChange} />
        </motion.div>

        {/* Step 2 */}
        <motion.div {...fadeUp(0.45)}>
          <SectionLabel num="02" label="Paste Emails" />
          <EmailInput value={emailsText} onChange={setEmailsText} />
        </motion.div>

        {/* Step 3: Analyze Button */}
        <motion.div {...fadeUp(0.55)} style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.button
            style={{
              ...styles.analyzeBtn,
              opacity: status === 'loading' ? 0.6 : 1,
              cursor:  status === 'loading' ? 'not-allowed' : 'pointer',
            }}
            onClick={handleAnalyze}
            disabled={status === 'loading'}
            whileHover={status !== 'loading' ? { scale: 1.03, background: '#fff', color: '#000' } : {}}
            whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 280 }}
          >
            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <Spinner /> Analyzing Emails…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Analyze & Rank Opportunities →
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Step 4: Results */}
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel num="04" label="Results" />
              <ResultsList
                status={status}
                results={results}
                errorMessage={errorMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────
function SectionLabel({ num, label }) {
  return (
    <div style={labelStyles.wrap}>
      <span style={labelStyles.num}>{num}</span>
      <div style={labelStyles.line} />
      <span style={labelStyles.text}>{label}</span>
    </div>
  )
}

function Spinner() {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        width: '14px', height: '14px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#080808',
    color: '#fff',
    fontFamily: '"DM Sans", sans-serif',
    position: 'relative',
    overflowX: 'hidden',
  },
  bgGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px clamp(20px, 6vw, 80px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(8,8,8,0.85)',
    backdropFilter: 'blur(12px)',
  },
  backBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    letterSpacing: '0.08em',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '2px',
    fontFamily: '"DM Mono", monospace',
    width: '80px',
  },
  navLogo: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '24px',
    fontWeight: 300,
    letterSpacing: '-0.02em',
  },
  headerWrap: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px) 0',
    maxWidth: '800px',
    margin: '0 auto',
  },
  overline: {
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    marginBottom: '16px',
  },
  pageTitle: {
    fontSize: 'clamp(36px, 5vw, 64px)',
    fontWeight: 300,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    color: '#fff',
    fontFamily: '"Cormorant Garamond", serif',
    margin: '0 0 20px',
  },
  pageSub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: '0.05em',
    fontFamily: '"DM Mono", monospace',
    marginBottom: '48px',
  },
  steps: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    position: 'relative',
    marginBottom: '60px',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '80px',
    position: 'relative',
    zIndex: 1,
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontFamily: '"DM Mono", monospace',
    color: 'rgba(255,255,255,0.4)',
    background: '#080808',
  },
  stepLabel: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    fontFamily: '"DM Mono", monospace',
  },
  stepLine: {
    position: 'absolute',
    top: '16px',
    left: '40px',
    right: '40px',
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 clamp(20px, 6vw, 40px) 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  analyzeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    padding: '18px 56px',
    fontSize: '12px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontFamily: '"DM Mono", monospace',
    borderRadius: '2px',
    margin: '24px 0',
    transition: 'background 0.25s, color 0.25s, border-color 0.25s',
  },
}

const labelStyles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '36px 0 16px',
  },
  num: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: '0.1em',
    flexShrink: 0,
  },
  line: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
  },
  text: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    flexShrink: 0,
  },
}