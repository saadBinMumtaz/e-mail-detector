// ──────────────────────────────────────────────────────
//  OpportunityCard.jsx
//  Renders one ranked opportunity with all its details.
//  Props:
//    opportunity - a single opportunity object from the API
// ──────────────────────────────────────────────────────

export default function OpportunityCard({ opportunity }) {
  const {
    rank,
    title,
    type,
    organization,
    deadline,
    eligibility,
    required_docs,
    contact_or_link,
    priority,
    score,
    why_relevant,
    action_checklist,
  } = opportunity

  return (
    <div className="opp-card">

      {/* ── Top row: rank number, title+type, priority badge ── */}
      <div className="opp-top-row">

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
          <span className="opp-rank">#{rank}</span>
          <div>
            <div className="opp-title">{title}</div>
            <span className="opp-type-tag">{type}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className={`badge badge-${priority}`}>{priority}</span>
          <div className="score-chip">score {score}/100</div>
        </div>

      </div>

      {/* ── Meta info: deadline, org, link ── */}
      <div className="meta-row">
        {deadline && <span><strong>Deadline:</strong> {deadline}</span>}
        {organization && <span><strong>Org:</strong> {organization}</span>}
        {contact_or_link && (
          <span>
            <strong>Link:</strong>{' '}
            <a href={contact_or_link} target="_blank" rel="noreferrer">
              {contact_or_link.length > 50
                ? contact_or_link.slice(0, 50) + '…'
                : contact_or_link}
            </a>
          </span>
        )}
      </div>

      {/* ── Why this is relevant for this student ── */}
      <div className="why-box">{why_relevant}</div>

      <hr className="section-divider" />

      {/* ── Eligibility conditions ── */}
      {eligibility?.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div className="sub-label">Eligibility</div>
          <ul className="checklist">
            {eligibility.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Required documents ── */}
      {required_docs?.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div className="sub-label">Required Documents</div>
          <ul className="checklist">
            {required_docs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Action checklist ── */}
      {action_checklist?.length > 0 && (
        <div>
          <div className="sub-label">Action Checklist</div>
          <ul className="checklist">
            {action_checklist.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
