// ──────────────────────────────────────────────────────
//  EmailInput.jsx
//  A big textarea where the user pastes their emails.
//  Props:
//    value    - current text value (from App state)
//    onChange - function to update the value
// ──────────────────────────────────────────────────────

export default function EmailInput({ value, onChange }) {
  return (
    <div>
      <div className="section-label">
        Paste Emails Below — separate each email with "---" or a blank line
      </div>

      <textarea
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ── Sample placeholder so users know the format ────────
const PLACEHOLDER_TEXT = `Subject: LUMS Scholarship 2026 – Applications Open
Dear Student, We are pleased to announce that applications are now open for the LUMS National Outreach Programme. Eligible students with CGPA above 3.0 may apply before March 31, 2026. Visit lums.edu.pk/nop for details.

---

Subject: Flash Sale This Weekend!
Get 50% off electronics at our mega store. Limited time offer. Visit our website now.

---

Subject: Google Summer Internship 2026
We are looking for talented undergraduate students for our 3-month summer internship program. Applicants should have strong programming skills. Apply at careers.google.com by April 15, 2026.`
