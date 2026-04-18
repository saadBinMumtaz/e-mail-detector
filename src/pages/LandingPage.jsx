// ──────────────────────────────────────────────────────
//  pages/LandingPage.jsx
//  Renders the full marketing landing page.
//  Hero's "Analyze My Inbox" button uses useNavigate()
//  to push the user to /analyze.
// ──────────────────────────────────────────────────────

import Hero        from '../components/landing/Hero.jsx'
import Description from '../mainpage.jsx'
import Footer      from '../components/landing/Footer.jsx'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Description />
      {/* <Footer /> */}
    </>
  )
}