import type { UserProfile } from '../services/auth'

interface MetricsPanelProps {
  open: boolean
  onClose: () => void
  onOpenAuth: () => void
  user: UserProfile | null
}

export function MetricsPanel({ open, onClose, onOpenAuth, user }: MetricsPanelProps) {
  return (
    <>
      <button className={`panel-scrim ${open ? 'is-visible' : ''}`} type="button" onClick={onClose} aria-label="Close analytics panel" tabIndex={open ? 0 : -1} />
      <aside className={`metrics-panel ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Profile and analytics">
        <div className="panel-header">
          <div><p className="eyebrow">YOUR SPACE</p><h2>Profile & progress</h2></div>
          <button className="icon-button close-panel" onClick={onClose} type="button" aria-label="Close panel"><span aria-hidden="true">×</span></button>
        </div>
        <div className="profile-card">
          <div className="profile-avatar">{user?.username.charAt(0).toUpperCase() ?? 'G'}</div>
          <div className="profile-copy"><strong>{user?.username ?? 'Guest User'}</strong><span>{user ? `Member since ${new Date(user.created_at).toLocaleDateString()}` : 'Practice without an account'}</span></div>
          <span className="guest-tag">{user ? 'MEMBER' : 'GUEST'}</span>
          <p>{user?.bio || (user ? user.email : 'Sign in to save your profile across devices.')}</p>
          {!user && <button type="button" className="profile-signin" onClick={onOpenAuth}>Create a free account <span aria-hidden="true">↗</span></button>}
        </div>
        <div className="panel-section-heading"><div><p className="eyebrow">AT A GLANCE</p><h3>Your statistics</h3></div><span className="period-label">ALL TIME <span aria-hidden="true">⌄</span></span></div>
        <div className="metric-grid">
          <article className="metric-card"><span className="metric-icon metric-emerald">↗</span><span className="metric-name">AVERAGE WPM</span><strong>—</strong><small>No saved sessions yet</small></article>
          <article className="metric-card"><span className="metric-icon metric-orange">✓</span><span className="metric-name">TESTS DONE</span><strong>—</strong><small>Session history unavailable</small></article>
          <article className="metric-card"><span className="metric-icon metric-blue">◎</span><span className="metric-name">AVG. ACCURACY</span><strong>—</strong><small>No saved sessions yet</small></article>
          <article className="metric-card"><span className="metric-icon metric-slate">◷</span><span className="metric-name">PRACTICE TIME</span><strong>—</strong><small>Session history unavailable</small></article>
        </div>
        <section className="performance-card">
          <div className="performance-heading"><div><p className="eyebrow">PERFORMANCE</p><h3>Progress overview</h3></div></div>
          <div className="performance-summary"><strong>— <span>WPM</span></strong><span>Your saved sessions will appear here.</span></div>
          <div className="chart-wrap" role="img" aria-label="No saved typing performance data yet">
            <div className="chart-y-labels"><span>60</span><span>40</span><span>20</span></div>
            <svg className="trend-chart" viewBox="0 0 310 104" preserveAspectRatio="none" aria-hidden="true">
              <path className="chart-gridline" d="M0 15H310M0 48H310M0 81H310" />
              <path className="chart-gridline" d="M0 15H310M0 48H310M0 81H310" />
            </svg>
            <div className="chart-x-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
          </div>
          <div className="accuracy-history"><span>ACCURACY HISTORY</span><span>No data</span><strong>—</strong></div>
        </section>
        <section className="recent-section">
          <div className="recent-heading"><div><p className="eyebrow">KEEP IT UP</p><h3>Recent sessions</h3></div><button type="button" className="text-button" onClick={onOpenAuth}>View all <span aria-hidden="true">→</span></button></div>
          <div className="session-list"><p className="panel-footnote">No saved sessions to show yet.</p></div>
        </section>
        <p className="panel-footnote"><span>i</span> {user ? 'Your account profile is synced.' : 'Guest practice results are not linked to an account.'}</p>
      </aside>
    </>
  )
}

export default MetricsPanel
