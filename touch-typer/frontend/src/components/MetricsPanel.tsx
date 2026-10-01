interface MetricsPanelProps {
  open: boolean
  onClose: () => void
  onOpenAuth: () => void
}

const recentSessions = [
  { day: 'Today, 10:42 AM', label: 'Daily practice', wpm: 54, accuracy: '97.8%', tone: 'green' },
  { day: 'Yesterday, 6:18 PM', label: 'Warm-up round', wpm: 49, accuracy: '96.2%', tone: 'orange' },
  { day: 'Sep 27, 9:05 AM', label: 'Daily practice', wpm: 52, accuracy: '98.1%', tone: 'blue' },
]

export function MetricsPanel({ open, onClose, onOpenAuth }: MetricsPanelProps) {
  return (
    <>
      <button className={`panel-scrim ${open ? 'is-visible' : ''}`} type="button" onClick={onClose} aria-label="Close analytics panel" tabIndex={open ? 0 : -1} />
      <aside className={`metrics-panel ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Profile and analytics">
        <div className="panel-header">
          <div><p className="eyebrow">YOUR SPACE</p><h2>Profile & progress</h2></div>
          <button className="icon-button close-panel" onClick={onClose} type="button" aria-label="Close panel"><span aria-hidden="true">×</span></button>
        </div>
        <div className="profile-card">
          <div className="profile-avatar">G</div>
          <div className="profile-copy"><strong>Guest typist</strong><span>Member since today</span></div>
          <span className="guest-tag">GUEST</span>
          <p>Sign in to keep your progress across devices.</p>
          <button type="button" className="profile-signin" onClick={onOpenAuth}>Create a free account <span aria-hidden="true">↗</span></button>
        </div>
        <div className="panel-section-heading"><div><p className="eyebrow">AT A GLANCE</p><h3>Your statistics</h3></div><span className="period-label">ALL TIME <span aria-hidden="true">⌄</span></span></div>
        <div className="metric-grid">
          <article className="metric-card"><span className="metric-icon metric-emerald">↗</span><span className="metric-name">AVERAGE WPM</span><strong>52<span> wpm</span></strong><small><b>+4.8%</b> this week</small></article>
          <article className="metric-card"><span className="metric-icon metric-orange">✓</span><span className="metric-name">TESTS DONE</span><strong>28</strong><small><b>6</b> this week</small></article>
          <article className="metric-card"><span className="metric-icon metric-blue">◎</span><span className="metric-name">AVG. ACCURACY</span><strong>97.4<span>%</span></strong><small><b>+1.2%</b> this week</small></article>
          <article className="metric-card"><span className="metric-icon metric-slate">◷</span><span className="metric-name">PRACTICE TIME</span><strong>3.6<span> hrs</span></strong><small>Across all sessions</small></article>
        </div>
        <section className="performance-card">
          <div className="performance-heading"><div><p className="eyebrow">PERFORMANCE</p><h3>Steady progress</h3></div><span className="trend-badge">↗ 12.6%</span></div>
          <div className="performance-summary"><strong>52 <span>WPM</span></strong><span>Weekly average <b>+6 WPM</b></span></div>
          <div className="chart-wrap" role="img" aria-label="WPM trend increasing from Monday to Sunday">
            <div className="chart-y-labels"><span>60</span><span>40</span><span>20</span></div>
            <svg className="trend-chart" viewBox="0 0 310 104" preserveAspectRatio="none" aria-hidden="true">
              <path className="chart-gridline" d="M0 15H310M0 48H310M0 81H310" />
              <path className="chart-area" d="M0 71L52 63L104 68L155 44L207 53L258 30L310 18V100H0Z" />
              <path className="chart-line" d="M0 71L52 63L104 68L155 44L207 53L258 30L310 18" />
              <circle cx="310" cy="18" r="4" className="chart-point" />
            </svg>
            <div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          </div>
          <div className="accuracy-history"><span>ACCURACY HISTORY</span><div className="accuracy-bars" aria-label="Recent accuracy between 95 and 99 percent"><i style={{ height: '56%' }} /><i style={{ height: '72%' }} /><i style={{ height: '64%' }} /><i style={{ height: '88%' }} /><i style={{ height: '78%' }} /><i style={{ height: '94%' }} /><i style={{ height: '84%' }} /><i style={{ height: '100%' }} /><i style={{ height: '92%' }} /><i style={{ height: '100%' }} /></div><strong>97.4%</strong></div>
        </section>
        <section className="recent-section">
          <div className="recent-heading"><div><p className="eyebrow">KEEP IT UP</p><h3>Recent sessions</h3></div><button type="button" className="text-button" onClick={onOpenAuth}>View all <span aria-hidden="true">→</span></button></div>
          <div className="session-list">{recentSessions.map((session) => <article className="session-row" key={session.day}><span className={`session-marker ${session.tone}`} /><div className="session-copy"><strong>{session.label}</strong><span>{session.day}</span></div><strong className="session-wpm">{session.wpm}<small> WPM</small></strong><span className="session-accuracy">{session.accuracy}</span></article>)}</div>
        </section>
        <p className="panel-footnote"><span>i</span> Demo statistics shown. Sign in to save real results.</p>
      </aside>
    </>
  )
}

export default MetricsPanel
