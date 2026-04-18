// ──────────────────────────────────────────────────────
//  ResultsList.jsx
//  Renders the full ranked list of opportunity cards,
//  or loading/error/empty states.
//  Props:
//    status       - 'idle' | 'loading' | 'done' | 'error'
//    results      - the full parsed API response object
//    errorMessage - string if status is 'error'
// ──────────────────────────────────────────────────────

import OpportunityCard from './OpportunityCard.jsx'

export default function ResultsList({ status, results, errorMessage }) {

  // Nothing to show yet
  if (status === 'idle') return null

  // Loading spinner
  if (status === 'loading') {
    return (
      <div className="loading-box">
        <span className="spinner"></span>
        Analyzing emails with AI... this takes about 10 seconds
      </div>
    )
  }

  // API or parse error
  if (status === 'error') {
    return (
      <div className="error-box">
        <strong>Error:</strong> {errorMessage}
      </div>
    )
  }

  // Done — show results
  const opportunities = results?.opportunities || []
  const skippedCount = results?.skipped_count || 0
  const skippedReason = results?.skipped_reason || ''

  if (opportunities.length === 0) {
    return (
      <div className="no-results">
        No real opportunities found in these emails.
        {skippedReason && <div style={{ marginTop: 8, fontSize: 13 }}>{skippedReason}</div>}
      </div>
    )
  }

  return (
    <div style={{ marginTop: '28px' }}>

      {/* ── Summary line ── */}
      <div className="results-header">
        Found <strong>{opportunities.length}</strong> opportunit{opportunities.length === 1 ? 'y' : 'ies'}
        {skippedCount > 0 && ` · ${skippedCount} non-opportunity email${skippedCount > 1 ? 's' : ''} skipped`}
      </div>

      {/* ── One card per opportunity ── */}
      {opportunities.map(opp => (
        <OpportunityCard key={opp.rank} opportunity={opp} />
      ))}

    </div>
  )
}
