// ──────────────────────────────────────────────────────
//  ProfileForm.jsx
//  Renders the student profile input fields.
//  Props:
//    profile  - the current profile object (from App state)
//    onChange - function to update a single field
// ──────────────────────────────────────────────────────

export default function ProfileForm({ profile, onChange }) {
  return (
    <div className="card">
      <div className="section-label">Student Profile</div>

      <div className="profile-grid">

        <div className="field">
          <label>Degree / Program</label>
          <input
            type="text"
            placeholder="e.g. BS Computer Science"
            value={profile.degree}
            onChange={e => onChange('degree', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Semester</label>
          <input
            type="text"
            placeholder="e.g. 6th semester"
            value={profile.semester}
            onChange={e => onChange('semester', e.target.value)}
          />
        </div>

        <div className="field">
          <label>CGPA</label>
          <input
            type="text"
            placeholder="e.g. 3.5"
            value={profile.cgpa}
            onChange={e => onChange('cgpa', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Skills / Interests</label>
          <input
            type="text"
            placeholder="e.g. Python, Machine Learning, Research"
            value={profile.skills}
            onChange={e => onChange('skills', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Preferred Opportunity Types</label>
          <input
            type="text"
            placeholder="e.g. internship, scholarship, research"
            value={profile.prefs}
            onChange={e => onChange('prefs', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Financial Need</label>
          <select
            value={profile.financial}
            onChange={e => onChange('financial', e.target.value)}
          >
            <option value="not specified">Not specified</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>

      </div>
    </div>
  )
}
