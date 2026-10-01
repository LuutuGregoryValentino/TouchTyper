import { useMemo } from 'react'
import { useTypingEngine } from '../hooks/useTypingEngine'

const DEFAULT_TEXT = 'the quick brown fox jumps over the lazy dog'

interface TypingTestProps {
  targetText?: string
  userId?: number
}

export function TypingTest({ targetText = DEFAULT_TEXT, userId }: TypingTestProps) {
  const { currentIndex, errors, hasError, completed, reset, wpm, accuracy, elapsedSeconds } = useTypingEngine(targetText, userId)
  const started = currentIndex > 0 || errors > 0

  const characters = useMemo(() => Array.from(targetText), [targetText])

  const handleReset = () => {
    reset()
  }

  return (
    <section className="typing-card" aria-label="Typing practice">
      <div className="typing-card-top">
        <div>
          <p className="eyebrow">DAILY PRACTICE <span className="eyebrow-dot" /></p>
          <h1>Find your rhythm.</h1>
          <p className="typing-intro">Type the passage below. Accuracy first, speed follows.</p>
        </div>
        <div className="test-mode">
          <span className="mode-indicator" />
          <span>OPEN PRACTICE</span>
          <span className="mode-divider" />
          <span>ENGLISH</span>
        </div>
      </div>

      <div className="typing-stats" aria-live="polite">
        <div className="typing-stat"><span className="stat-label">WPM</span><strong>{started ? wpm : '—'}</strong></div>
        <div className="typing-stat"><span className="stat-label">ACCURACY</span><strong>{started ? `${accuracy}%` : '—'}</strong></div>
        <div className="typing-stat"><span className="stat-label">TIME</span><strong>{started ? `${elapsedSeconds}s` : '60s'}</strong></div>
        <div className="typing-stat errors-stat"><span className="stat-label">ERRORS</span><strong>{errors.toString().padStart(2, '0')}</strong></div>
      </div>

      {!completed ? (
        <>
          <div className="typing-prompt" aria-label="Text to type">
            {characters.map((character, index) => {
              let state = 'character-remaining'
              if (index < currentIndex) state = 'character-correct'
              if (index === currentIndex) state = hasError ? 'character-current character-error' : 'character-current'
              return <span className={state} key={`${index}-${character}`}>{character}</span>
            })}
          </div>
          <div className="typing-hint">
            <span className="keyboard-icon" aria-hidden="true">⌨</span>
            <span>{hasError ? 'Not quite — press the highlighted character' : 'Start typing anywhere to begin'}</span>
            <span className="hint-separator">·</span>
            <span>Use both hands, stay relaxed</span>
          </div>
        </>
      ) : (
        <div className="completion-card" role="status">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <p className="eyebrow">SESSION COMPLETE</p>
          <h2>Nice work. Keep the momentum.</h2>
          <div className="completion-metrics">
            <div><strong>{wpm}</strong><span>WPM</span></div>
            <div><strong>{accuracy}%</strong><span>ACCURACY</span></div>
            <div><strong>{errors}</strong><span>TOTAL ERRORS</span></div>
          </div>
          <button className="button button-primary" type="button" onClick={handleReset}>Try again <span aria-hidden="true">↗</span></button>
        </div>
      )}

      <div className="typing-card-footer">
        <span><span className="footer-dot" /> {userId ? 'SESSION SAVED TO YOUR ACCOUNT' : 'GUEST SESSION NOT SAVED'}</span>
        <button type="button" className="text-button" onClick={handleReset} aria-label="Restart practice">Restart <span aria-hidden="true">↺</span></button>
      </div>
    </section>
  )
}

export default TypingTest
