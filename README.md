<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 📬 Opportunity Inbox Copilot

> **SOFTEC 2026 — AI Hackathon Competition**
> FAST-NU, Lahore | Foundation for Advancement of Science & Technology

An AI-powered email parsing and personalized opportunity ranking system that helps university students cut through inbox noise and act on the right opportunities — fast.

---

## 🧩 Problem

University students receive dozens of emails every week about scholarships, internships, competitions, fellowships, and admissions. Most of these get ignored, misread, or filtered as spam. Students miss deadlines, overlook eligibility matches, and fail to act on opportunities that could change their careers.

**Opportunity Inbox Copilot** solves this by automatically scanning opportunity-related emails, extracting structured information, and ranking them by relevance and urgency — personalized to each student's profile.

---

## ✨ Features

- **Opportunity Detection** — Classifies whether an email contains a real opportunity or is irrelevant/spam
- **Structured Extraction** — Pulls out deadlines, eligibility criteria, required documents, and contact/application links from messy natural language
- **Student Profile Matching** — Evaluates each opportunity against a structured student profile (degree, CGPA, skills, interests, financial need, etc.)
- **Priority Ranking** — Scores and ranks opportunities from highest to lowest priority with evidence-backed reasoning
- **Action Checklist** — Generates a practical, step-by-step action plan for each opportunity
- **Urgency Highlighting** — Flags time-sensitive opportunities prominently

---





### 1. Input
- Paste or upload **5–15 opportunity-related emails** (plain text or copied email content)
- Fill in a **structured student profile form** with fields like:
  - Degree / Program
  - Semester
  - CGPA
  - Skills & Interests
  - Preferred Opportunity Types (scholarship, internship, competition, etc.)
  - Financial Need
  - Location Preference
  - Past Experience

### 2. AI Processing Pipeline

```
Raw Emails
    │
    ▼
[Classification]  ──→  Is this a real opportunity? (Yes / No / Uncertain)
    │
    ▼
[Extraction]      ──→  Opportunity type, deadline, eligibility, required docs,
                        application link / contact details
    │
    ▼
[Profile Matching] ──→ Score each opportunity against the student profile
    │
    ▼
[Scoring Engine]  ──→  Urgency score + Profile fit score + Completeness score
    │
    ▼
[Ranked Output]   ──→  Priority list with reasoning, action checklist
```

### 3. Output
A prioritized opportunity dashboard showing:
- **Rank** and **priority score** for each opportunity
- **Why it matters** — evidence-backed explanation
- **Eligibility check** — which criteria the student meets
- **What's needed** — required documents and steps
- **Deadline countdown** — urgency indicator
- **Action checklist** — concrete next steps

---

## 🎯 Scoring Methodology

Each opportunity is scored on three dimensions:

| Dimension | Weight | Description |
|---|---|---|
| **Urgency** | 40% | Days until deadline; closer deadlines score higher |
| **Profile Fit** | 40% | Match between student profile and eligibility criteria |
| **Completeness** | 20% | How complete and actionable the opportunity information is |

**Final Score** = (Urgency × 0.4) + (Profile Fit × 0.4) + (Completeness × 0.2)

---

## 📂 Project Structure

```
opportunity-inbox-copilot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailInput.jsx        # Email paste/upload interface
│   │   │   ├── ProfileForm.jsx       # Student profile form
│   │   │   ├── OpportunityCard.jsx   # Individual opportunity display
│   │   │   └── RankedList.jsx        # Prioritized results view
│   │   ├── utils/
│   │   │   ├── scorer.js             # Deterministic scoring engine
│   │   │   └── apiClient.js          # Anthropic API calls
│   │   └── App.jsx
│   └── package.json
├── backend/                          # Optional: FastAPI backend
│   ├── main.py
│   ├── parser.py                     # Email parsing logic
│   └── requirements.txt
├── prompts/
│   ├── classifier.txt                # System prompt for classification
│   └── extractor.txt                 # System prompt for extraction
├── sample_data/
│   ├── sample_emails.txt             # 10 sample test emails
│   └── sample_profile.json          # Example student profile
├── .env.example
└── README.md
```

---

## 🧪 Demo Flow

1. **Load sample inbox** — The app comes preloaded with a set of 10 realistic student emails (mix of real opportunities, spam, and irrelevant content)
2. **Fill student profile** — Enter or use the pre-filled demo profile
3. **Run the Copilot** — Click "Analyze Inbox"
4. **View ranked results** — See which opportunities to act on first, with full explanations and action checklists
5. **Try your own emails** — Paste real emails and update the profile to see personalized results

---

## 📋 Supported Opportunity Types

- 🎓 Scholarships & Financial Aid
- 💼 Internships & Part-time Roles
- 🏆 Competitions & Hackathons
- 🔬 Research & Fellowship Programs
- 🎓 Graduate School Admissions
- 📢 Conferences & Workshops
- 🌐 Exchange Programs

---

## ⚙️ MVP Scope (6-Hour Hackathon)

- [x] Support 5–15 English opportunity emails
- [x] Classify emails as opportunity / non-opportunity
- [x] Extract: opportunity type, deadline, eligibility, required docs, application info
- [x] Accept structured student profile via form (not free text)
- [x] Score and rank opportunities with reasoning
- [x] Display action checklist per opportunity


---


## 🙏 Acknowledgements

- **SOFTEC 2026** — FAST-NU Lahore
>>>>>>> c0c2ea3b990b15c3bc6f973d1d9c21c6e7bcc81b
