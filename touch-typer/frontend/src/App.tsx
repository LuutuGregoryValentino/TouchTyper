import { useEffect, useState } from 'react'
import AuthModal, { type AuthMode } from './components/AuthModal'
import DashboardHeader from './components/DashboardHeader'
import MetricsPanel from './components/MetricsPanel'
import TypingTest from './components/TypingTest'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('practice')
  const [metricsOpen, setMetricsOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMetricsOpen(false)
        setAuthMode(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="app-shell">
      <DashboardHeader activeView={activeView} onViewChange={setActiveView} onOpenMetrics={() => setMetricsOpen(true)} onOpenAuth={setAuthMode} />
      <main className="app-main" id="practice">
        <div className="main-container">
          <div className="breadcrumb"><span>HOME</span><span aria-hidden="true">/</span><strong>{activeView === 'practice' ? 'PRACTICE' : 'THE METHOD'}</strong></div>
          {activeView === 'practice' ? <TypingTest /> : (
            <section className="guide-card">
              <p className="eyebrow">A BETTER WAY TO PRACTICE</p>
              <h1>Progress, one keystroke at a time.</h1>
              <p className="guide-lead">TouchType gives you a quiet place to build accuracy and confidence—without distractions or pressure.</p>
              <div className="guide-steps">
                <article><span>01</span><h2>Start with accuracy</h2><p>Read the passage and type each character in sequence. Mistakes are highlighted as you go.</p></article>
                <article><span>02</span><h2>Build a steady rhythm</h2><p>Let your hands find a comfortable pace. Speed improves naturally with consistent practice.</p></article>
                <article><span>03</span><h2>Review your progress</h2><p>Open Profile & Analytics any time to see your WPM trend, accuracy, and recent sessions.</p></article>
              </div>
              <button type="button" className="button button-primary" onClick={() => setActiveView('practice')}>Start practicing <span aria-hidden="true">→</span></button>
            </section>
          )}
          <div className="below-note"><span className="note-line" /><span>SMALL STEPS. BETTER FLOW.</span><span className="note-line" /></div>
        </div>
      </main>
      <footer className="app-footer"><span>© 2026 TOUCHTYPER</span><span>MADE FOR YOUR NEXT KEYSTROKE <b>⌁</b></span><button type="button" onClick={() => setActiveView('guide')}>HOW IT WORKS</button></footer>
      <MetricsPanel open={metricsOpen} onClose={() => setMetricsOpen(false)} onOpenAuth={() => { setMetricsOpen(false); setAuthMode('register') }} />
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </div>
  )
}

export default App
