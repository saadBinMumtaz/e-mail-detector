import { API_KEY, API_URL, MODEL } from './config.js'

// ──────────────────────────────────────────────────────
//  This file handles all API logic.
//  Groq uses the OpenAI-compatible format:
//    - messages array with { role, content }
//    - system message goes as the FIRST message with role "system"
//  Returns a clean ranked list of opportunities.
// ──────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are an Opportunity Inbox Copilot for university students.

Your job:
1. Read a batch of raw emails.
2. Decide which ones contain REAL opportunities (scholarships, internships, fellowships, competitions, research positions, admissions). Ignore spam and promotional emails.
3. For each real opportunity, extract the important fields.
4. Score and rank them based on how relevant and urgent they are for this specific student.

Rules:
- Respond ONLY with valid JSON. No extra text, no markdown, no code blocks.
- Sort opportunities by rank (1 = highest priority).
- Be specific in "why_relevant" — mention the student's actual skills, CGPA, or preferences.

JSON format to return:
{
  "opportunities": [
    {
      "rank": 1,
      "title": "Name of the opportunity",
      "type": "scholarship | internship | fellowship | competition | research | admission | other",
      "organization": "Name of the org or company",
      "deadline": "Deadline date as a string, or null if not mentioned",
      "eligibility": ["Condition 1", "Condition 2"],
      "required_docs": ["Document 1", "Document 2"],
      "contact_or_link": "URL or email, or null",
      "priority": "critical | high | medium | low",
      "score": 75,
      "why_relevant": "2-3 sentences explaining why this matters for this student specifically.",
      "action_checklist": ["Step 1 the student should take", "Step 2", "Step 3"]
    }
  ],
  "skipped_count": 2,
  "skipped_reason": "2 emails were promotional/spam and had no real opportunity."
}
`

// ── Main function called by App.jsx ──────────────────
export async function analyzeEmails(emailsText, studentProfile) {

  // Build the user message combining profile + emails
  const userMessage = `
Student Profile:
- Degree / Program: ${studentProfile.degree || 'not specified'}
- Semester: ${studentProfile.semester || 'not specified'}
- CGPA: ${studentProfile.cgpa || 'not specified'}
- Skills and Interests: ${studentProfile.skills || 'not specified'}
- Preferred Opportunity Types: ${studentProfile.prefs || 'not specified'}
- Financial Need: ${studentProfile.financial || 'not specified'}

Emails to analyze:
${emailsText}
`

  // ── Call the Groq API (OpenAI-compatible format) ──
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage }
      ]
    })
  })

  // Check if the API call itself failed
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()

  // Groq response format: data.choices[0].message.content
  const rawText = data.choices?.[0]?.message?.content || ''

  if (!rawText) {
    throw new Error('Empty response from Groq API. Try again.')
  }

  // Strip accidental markdown fences just in case
  const cleanText = rawText.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleanText)
  } catch (e) {
    throw new Error('Could not parse the AI response as JSON. Try again.')
  }
}
