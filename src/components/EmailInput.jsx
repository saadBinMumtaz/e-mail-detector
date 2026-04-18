// ──────────────────────────────────────────────────────
//  EmailInput.jsx  (enhanced)
//  Monochromatic textarea with character count + glow.
// ──────────────────────────────────────────────────────
 
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
 
const PLACEHOLDER_TEXT = `Subject: LUMS Scholarship 2026 – Applications Open
Dear Student, We are pleased to announce that applications are now open for the LUMS National Outreach Programme. Eligible students with CGPA above 3.0 may apply before March 31, 2026. Visit lums.edu.pk/nop for details.
 
---
 
Subject: Flash Sale This Weekend!
Get 50% off electronics at our mega store. Limited time offer.
 
---
 
Subject: Google Summer Internship 2026
We are looking for talented undergraduate students for our 3-month summer internship program. Apply at careers.google.com by April 15, 2026.`
 
export default function EmailInput({ value, onChange }) {
  const [focused, setFocused] = useState(false)
 
  const emailCount = value
    .split(/\n---\n|\n\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0).length
 
  return (
    <div style={styles.wrapper}>
 
      {/* Header row */}
      <div style={styles.headerRow}>
        <span style={styles.hint}>
          Separate emails with <code style={styles.code}>---</code> or a blank line
        </span>
        <AnimatePresence>
          {emailCount > 0 && (
            <motion.span
              style={styles.count}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {emailCount} email{emailCount > 1 ? 's' : ''} detected
            </motion.span>
          )}
        </AnimatePresence>
      </div>
 
      {/* Textarea */}
      <motion.div
        style={{
          ...styles.textareaWrap,
          borderColor: focused ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
          boxShadow: focused ? '0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
        }}
        animate={{ borderColor: focused ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)' }}
        transition={{ duration: 0.2 }}
      >
        <textarea
          style={styles.textarea}
          placeholder={PLACEHOLDER_TEXT}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
        />
 
        {/* Bottom bar */}
        <div style={styles.bottomBar}>
          <span style={styles.bottomHint}>
            {value.length > 0
              ? `${value.length.toLocaleString()} characters`
              : 'Paste your emails above'}
          </span>
          {value && (
            <motion.button
              style={styles.clearBtn}
              onClick={() => onChange('')}
              whileHover={{ color: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Clear ×
            </motion.button>
          )}
        </div>
      </motion.div>
 
    </div>
  )
}
 
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.04em',
  },
  code: {
    background: 'rgba(255,255,255,0.08)',
    padding: '1px 5px',
    borderRadius: '2px',
    fontSize: '10px',
    fontFamily: '"DM Mono", monospace',
  },
  count: {
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: '"DM Mono", monospace',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '4px 10px',
    borderRadius: '100px',
  },
  textareaWrap: {
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    display: 'block',
    width: '100%',
    minHeight: '260px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    fontFamily: '"DM Mono", monospace',
    lineHeight: 1.75,
    padding: '20px',
    resize: 'vertical',
    boxSizing: 'border-box',
    letterSpacing: '0.01em',
  },
  bottomBar: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomHint: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.2)',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.08em',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '10px',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    padding: '2px 6px',
  },
}