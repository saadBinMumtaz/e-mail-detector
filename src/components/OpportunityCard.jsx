// ──────────────────────────────────────────────────────
//  OpportunityCard.jsx  (enhanced)
//  Editorial monochromatic card with Framer Motion.
// ──────────────────────────────────────────────────────

import { useState }  from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OpportunityCard({ opportunity, index = 0 }) {
  const [expanded, setExpanded] = useState(false)

  const {
    rank, title, type, organization, deadline,
    eligibility, required_docs, contact_or_link,
    priority, score, why_relevant, action_checklist,
  } = opportunity

  const priorityOpacity = priority === 'high' ? 1 : priority === 'medium' ? 0.55 : 0.3

  return (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.22)' }}
    >

      {/* ── Score bar (visual accent on left edge) ── */}
      <div
        style={{
          ...styles.scoreBar,
          height: `${score}%`,
          opacity: 0.3 + (score / 100) * 0.5,
        }}
      />

      {/* ── Top row ── */}
      <div style={styles.topRow}>
        <div style={styles.rankWrap}>
          <span style={styles.rankNum}>#{rank}</span>
        </div>

        <div style={styles.titleGroup}>
          <h3 style={styles.title}>{title}</h3>
          <div style={styles.metaTags}>
            <span style={styles.typeTag}>{type}</span>
            {organization && <span style={styles.orgTag}>{organization}</span>}
          </div>
        </div>

        <div style={styles.rightGroup}>
          <div style={{ ...styles.priorityDot, opacity: priorityOpacity }} />
          <div style={styles.scoreCircle}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke="rgba(255,255,255,0.65)" strokeWidth="2"
                strokeDasharray={`${(score / 100) * 113} 113`}
                strokeLinecap="round"
              />
            </svg>
            <span style={styles.scoreNum}>{score}</span>
          </div>
        </div>
      </div>

      {/* ── Deadline + link row ── */}
      <div style={styles.infoRow}>
        {deadline && (
          <span style={styles.infoChip}>
            <span style={styles.infoIcon}>◷</span> {deadline}
          </span>
        )}
        {contact_or_link && (
          <a
            href={contact_or_link}
            target="_blank"
            rel="noreferrer"
            style={styles.linkChip}
          >
            ↗ {contact_or_link.length > 40 ? contact_or_link.slice(0, 40) + '…' : contact_or_link}
          </a>
        )}
        <span style={{ ...styles.priorityLabel, opacity: priorityOpacity }}>
          {priority} priority
        </span>
      </div>

      {/* ── Why relevant ── */}
      <p style={styles.whyText}>{why_relevant}</p>

      {/* ── Expand toggle ── */}
      <motion.button
        style={styles.expandBtn}
        onClick={() => setExpanded(v => !v)}
        whileHover={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
      >
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          style={{ display: 'inline-block' }}
          transition={{ duration: 0.25 }}
        >
          ↓
        </motion.span>{' '}
        {expanded ? 'Less' : 'Details, Eligibility & Checklist'}
      </motion.button>

      {/* ── Expandable content ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={styles.expandContent}>
              <div style={styles.divider} />

              <div style={styles.detailsGrid}>
                {eligibility?.length > 0 && (
                  <div>
                    <p style={styles.detailHead}>Eligibility</p>
                    <ul style={styles.list}>
                      {eligibility.map((item, i) => (
                        <li key={i} style={styles.listItem}>
                          <span style={styles.bullet}>—</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {required_docs?.length > 0 && (
                  <div>
                    <p style={styles.detailHead}>Required Documents</p>
                    <ul style={styles.list}>
                      {required_docs.map((item, i) => (
                        <li key={i} style={styles.listItem}>
                          <span style={styles.bullet}>—</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {action_checklist?.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <p style={styles.detailHead}>Action Checklist</p>
                  <div style={styles.checklistGrid}>
                    {action_checklist.map((step, i) => (
                      <div key={i} style={styles.checkItem}>
                        <span style={styles.checkNum}>{String(i + 1).padStart(2, '0')}</span>
                        <span style={styles.checkText}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

const styles = {
  card: {
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '2px',
    padding: '28px 28px 24px 40px',
    marginBottom: '12px',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  scoreBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '3px',
    background: '#fff',
    borderRadius: '0 2px 0 0',
    transition: 'height 0.4s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '14px',
  },
  rankWrap: {
    flexShrink: 0,
    paddingTop: '2px',
  },
  rankNum: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: '0.05em',
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 'clamp(15px, 2vw, 18px)',
    fontWeight: 500,
    color: '#fff',
    margin: '0 0 8px',
    fontFamily: '"DM Sans", sans-serif',
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
  },
  metaTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  typeTag: {
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '3px 8px',
    borderRadius: '2px',
    fontFamily: '"DM Mono", monospace',
  },
  orgTag: {
    fontSize: '10px',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    padding: '3px 0',
  },
  rightGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  priorityDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#fff',
  },
  scoreCircle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    position: 'absolute',
    fontSize: '10px',
    fontFamily: '"DM Mono", monospace',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0',
  },
  infoRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center',
  },
  infoChip: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: '"DM Mono", monospace',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  infoIcon: {
    opacity: 0.5,
  },
  linkChip: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: '"DM Mono", monospace',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.15)',
    textUnderlineOffset: '3px',
  },
  priorityLabel: {
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#fff',
    fontFamily: '"DM Mono", monospace',
    marginLeft: 'auto',
  },
  whyText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
    margin: '0 0 18px',
    fontFamily: '"DM Sans", sans-serif',
    fontStyle: 'italic',
  },
  expandBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.35)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: '"DM Mono", monospace',
    cursor: 'pointer',
    padding: '7px 14px',
    borderRadius: '2px',
    transition: 'color 0.15s, border-color 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  expandContent: {
    paddingTop: '4px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.07)',
    margin: '20px 0',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  detailHead: {
    fontSize: '10px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    fontFamily: '"DM Mono", monospace',
    margin: '0 0 12px',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  listItem: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: '"DM Sans", sans-serif',
    lineHeight: 1.5,
    display: 'flex',
    gap: '8px',
  },
  bullet: {
    color: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  checklistGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '2px',
  },
  checkNum: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
    paddingTop: '1px',
  },
  checkText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.55)',
    fontFamily: '"DM Sans", sans-serif',
    lineHeight: 1.55,
  },
}