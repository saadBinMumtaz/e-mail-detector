// ──────────────────────────────────────────────────────
//  App.jsx  — Root router. Connects landing page + analyzer.
//  Install:  npm install react-router-dom
// ──────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import AnalyzePage from './pages/AnalyzePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </BrowserRouter>
  )
}