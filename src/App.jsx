// ──────────────────────────────────────────────────────
//  App.jsx
//  The main component. Holds all the state and connects
//  ProfileForm + EmailInput + ResultsList together.
// ──────────────────────────────────────────────────────

import { useState } from 'react'
import ProfileForm from './components/ProfileForm.jsx'
import EmailInput from './components/EmailInput.jsx'
import ResultsList from './components/ResultsList.jsx'
import { analyzeEmails } from './analyzeEmails.js'

// ── Default empty profile ────────────────────────────
const EMPTY_PROFILE = {
  degree: '',
  semester: '',
  cgpa: '',
  skills: '',
  prefs: '',
  financial: 'not specified',
}

export default function App() {
  // ── State ──────────────────────────────────────────
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [emailsText, setEmailsText] = useState('')
  const [status, setStatus] = useState('idle')   // idle | loading | done | error
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // ── Update a single profile field ─────────────────
  function handleProfileChange(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  // ── Run the analysis ───────────────────────────────
  async function handleAnalyze() {
    // Basic validation
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

  // ── Render ─────────────────────────────────────────
  return (
    <div className="container">

      {/* ── Page Header ── */}
      <div className="header">
        <h1>Opportunity Inbox Copilot</h1>
        <p>Paste your emails, fill in your profile, and get a ranked list of opportunities to act on.</p>
      </div>

      {/* ── Step 1: Student Profile ── */}
      <ProfileForm
        profile={profile}
        onChange={handleProfileChange}
      />

      {/* ── Step 2: Paste Emails ── */}
      <EmailInput
        value={emailsText}
        onChange={setEmailsText}
      />

      {/* ── Step 3: Analyze Button ── */}
      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Analyzing…' : 'Analyze & Rank Opportunities →'}
      </button>

      {/* ── Step 4: Results ── */}
      <ResultsList
        status={status}
        results={results}
        errorMessage={errorMessage}
      />

    </div>
  )
}
