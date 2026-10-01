import { useState } from 'react'
import { login, register } from '../services/auth'

export type AuthMode = 'login' | 'register'

interface AuthModalProps {
  mode: AuthMode | null
  onClose: () => void
  onModeChange: (mode: AuthMode) => void
  onAuthenticated: () => void
}

export function AuthModal({ mode, onClose, onModeChange, onAuthenticated }: AuthModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  if (!mode) return null

  const isRegister = mode === 'register'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    try {
      if (isRegister) {
        await register({ username: String(form.get('username') ?? ''), email, password })
      }
      await login({ email, password })
      onAuthenticated()
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  const changeMode = (nextMode: AuthMode) => {
    setSubmitted(false)
    onModeChange(nextMode)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button type="button" className="icon-button auth-close" onClick={onClose} aria-label="Close">×</button>
        <div className="auth-brand-mark" aria-hidden="true"><span /><span /><span /><span /></div>
        <p className="eyebrow">TOUCHTYPER ACCOUNT</p>
        <h2 id="auth-title">{isRegister ? 'Build a better habit.' : 'Welcome back.'}</h2>
        <p className="auth-description">{isRegister ? 'Create an account to keep your practice moving.' : 'Sign in to pick up where you left off.'}</p>
        <div className="demo-badge"><span /> Secure account authentication</div>
        {submitted ? (
          <div className="demo-confirmation" role="status"><strong>Account ready.</strong><span>You are signed in.</span><button className="button button-primary" type="button" onClick={onClose}>Back to practice</button></div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && <label>Display name<input name="username" type="text" placeholder="How should we call you?" autoComplete="username" required /></label>}
            <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" placeholder="At least 8 characters" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={8} required /></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'} <span aria-hidden="true">→</span></button>
          </form>
        )}
        <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to TouchType?'} <button type="button" onClick={() => changeMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Log in' : 'Create an account'}</button></p>
      </section>
    </div>
  )
}

export default AuthModal
