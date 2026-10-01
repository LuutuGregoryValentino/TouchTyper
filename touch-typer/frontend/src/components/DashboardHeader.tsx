interface DashboardHeaderProps {
  activeView: string
  onViewChange: (view: string) => void
  onOpenMetrics: () => void
  onOpenAuth: (mode: 'login' | 'register') => void
}

function AnalyticsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h17M8 15l3-4 3 2 5-7" /></svg>
}

function UserIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" /></svg>
}

export function DashboardHeader({ activeView, onViewChange, onOpenMetrics, onOpenAuth }: DashboardHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#practice" onClick={(event) => { event.preventDefault(); onViewChange('practice') }} aria-label="TouchType home">
        <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
        <span className="brand-word">touch<span>typer</span></span>
        {/* <span className="brand-version">BETA</span> */}
      </a>

      <nav className="top-navigation" aria-label="Primary navigation">
        <button type="button" className={`nav-link ${activeView === 'practice' ? 'active' : ''}`} onClick={() => onViewChange('practice')}>Practice</button>
        <button type="button" className={`nav-link ${activeView === 'guide' ? 'active' : ''}`} onClick={() => onViewChange('guide')}>How it works</button>
      </nav>

      <div className="header-actions">
        <span className="offline-indicator"><span /> Demo mode</span>
        <span className="header-action-divider" />
        <button className="header-text-button" type="button" onClick={() => onOpenAuth('login')}>Log in</button>
        <button className="button button-header" type="button" onClick={() => onOpenAuth('register')}>Create account</button>
        <button className="icon-button analytics-toggle" type="button" onClick={onOpenMetrics} aria-label="Open profile and analytics" title="Profile & analytics">
          <AnalyticsIcon />
          <span className="icon-notification" />
        </button>
        <button className="avatar-button" type="button" onClick={onOpenMetrics} aria-label="Open profile"><UserIcon /></button>
      </div>
    </header>
  )
}

export default DashboardHeader
