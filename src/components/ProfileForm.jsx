// ──────────────────────────────────────────────────────
//  ProfileForm.jsx  (enhanced)
//  Monochromatic black/white with Framer Motion labels.
// ──────────────────────────────────────────────────────

import { useState } from 'react'
import { motion }   from 'framer-motion'

export default function ProfileForm({ profile, onChange }) {
  return (
    <div style={styles.card}>
      <div style={styles.profileGrid}>
        {FIELDS.map((f, i) => (
          <motion.div
            key={f.key}
            style={styles.field}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <label style={styles.label}>{f.label}</label>

            {f.type === 'select' ? (
              <select
                style={styles.select}
                value={profile[f.key]}
                onChange={e => onChange(f.key, e.target.value)}
              >
                {f.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <FocusInput
                placeholder={f.placeholder}
                value={profile[f.key]}
                onChange={v => onChange(f.key, v)}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function FocusInput({ placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        style={{
          ...styles.input,
          borderColor: focused ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)',
          boxShadow: focused ? 'inset 0 0 0 1px rgba(255,255,255,0.08)' : 'none',
        }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <motion.div
          layoutId="inputFocus"
          style={styles.focusBar}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </div>
  )
}

const FIELDS = [
  { key: 'degree',    label: 'Degree / Program',           placeholder: 'e.g. BS Computer Science',             type: 'text' },
  { key: 'semester',  label: 'Semester',                   placeholder: 'e.g. 6th Semester',                    type: 'text' },
  { key: 'cgpa',      label: 'CGPA',                       placeholder: 'e.g. 3.5',                             type: 'text' },
  { key: 'skills',    label: 'Skills / Interests',         placeholder: 'e.g. Python, ML, Research',            type: 'text' },
  { key: 'prefs',     label: 'Preferred Opportunity Types',placeholder: 'e.g. internship, scholarship, research',type: 'text' },
  {
    key: 'financial', label: 'Financial Need', type: 'select',
    options: [
      { value: 'not specified', label: 'Not specified' },
      { value: 'high',          label: 'High' },
      { value: 'moderate',      label: 'Moderate' },
      { value: 'low',           label: 'Low' },
    ],
  },
]

const styles = {
  card: {
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.02)',
    padding: '32px',
    borderRadius: '2px',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '10px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: '"DM Mono", monospace',
  },
  input: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '2px',
    color: '#fff',
    padding: '11px 14px',
    fontSize: '14px',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '2px',
    color: '#fff',
    padding: '11px 14px',
    fontSize: '14px',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },
  focusBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255,255,255,0.5)',
    transformOrigin: 'left',
  },
}