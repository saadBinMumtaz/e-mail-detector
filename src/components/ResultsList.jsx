// ──────────────────────────────────────────────────────
//  ResultsList.jsx  (enhanced)
//  Animated results with monochromatic loading state.
// ──────────────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import OpportunityCard from './OpportunityCard.jsx'

export default function ResultsList({ status, results, errorMessage }) {

  if (status === 'idle') return null

  return (
    <AnimatePresence mode="wait">

      {/* Loading */}
      {status === 'loading' && (
        <motion.div
          key="loading"
          style={styles.loadingBox}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LoadingAnimation />
          <p style={styles.loadingText}>Analyzing with AI…</p>
          <p style={styles.loadingSubText}>Ranking opportunities to your profile</p>
        </motion.div>
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.div
          key="error"
          style={styles.errorBox}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <span style={styles.errorIcon}>⚠</span>
          <div>
            <p style={styles.errorTitle}>Analysis Failed</p>
            <p style={styles.errorMsg}>{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Done */}
      {status === 'done' && (() => {
        const opportunities = results?.opportunities || []
        const skippedCount  = results?.skipped_count  || 0

        if (opportunities.length === 0) {
          return (
            <motion.div
              key="empty"
              style={styles.emptyBox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span style={styles.emptyIcon}>◯</span>
              <p style={styles.emptyTitle}>No opportunities found</p>
              <p style={styles.emptySubText}>
                {results?.skipped_reason || 'Try pasting more emails or adjust your profile.'}
              </p>
            </motion.div>
          )
        }

        return (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Summary */}
            <motion.div
              style={styles.summaryRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={styles.summaryCount}>
                {opportunities.length} Opportunit{opportunities.length === 1 ? 'y' : 'ies'}
              </span>
              {skippedCount > 0 && (
                <span style={styles.summarySkipped}>
                  · {skippedCount} non-opportunity email{skippedCount > 1 ? 's' : ''} filtered
                </span>
              )}
            </motion.div>

            {/* Cards */}
            <div>
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp.rank} opportunity={opp} index={i} />
              ))}
            </div>

          </motion.div>
        )
      })()}

    </AnimatePresence>
  )
}

// ── Loading animation — pulsing dots ──────────────────
function LoadingAnimation() {
  return (
    <div style={styles.dotsWrap}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          style={styles.dot}
          animate={{ opacity: [0.1, 0.8, 0.1], scaleY: [0.5, 1.4, 0.5] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '64px 24px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.015)',
    textAlign: 'center',
  },
  dotsWrap: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    height: '32px',
  },
  dot: {
    width: '3px',
    height: '20px',
    background: '#fff',
    borderRadius: '2px',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '15px',
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 500,
    margin: 0,
    letterSpacing: '-0.01em',
  },
  loadingSubText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.06em',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '2px',
  },
  errorIcon: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.5)',
    flexShrink: 0,
    paddingTop: '2px',
  },
  errorTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 6px',
    fontFamily: '"DM Sans", sans-serif',
  },
  errorMsg: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.03em',
  },
  emptyBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '64px 24px',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '2px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '32px',
    color: 'rgba(255,255,255,0.15)',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    fontFamily: '"DM Sans", sans-serif',
  },
  emptySubText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: '"DM Mono", monospace',
    margin: 0,
    maxWidth: '400px',
    lineHeight: 1.6,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  summaryCount: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    fontFamily: '"DM Sans", sans-serif',
    letterSpacing: '-0.01em',
  },
  summarySkipped: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: '"DM Mono", monospace',
    letterSpacing: '0.04em',
  },
}