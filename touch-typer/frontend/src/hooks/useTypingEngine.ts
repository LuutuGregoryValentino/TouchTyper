// frontend/src/hooks/useTypingEngine.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '../services/api';

export interface BigramSample {
  key_a: string;
  key_b: string;
  latency_ms: number;
  is_error: boolean;
}

export const useTypingEngine = (targetText: string, userId?: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [clockNow, setClockNow] = useState(0);

  const lastKeyPressTime = useRef<number | null>(null);
  const lastKeyChar = useRef<string | null>(null);
  const bigramSamples = useRef<BigramSample[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    if (completed) return;
    e.preventDefault();

    const now = performance.now();

    if (startTime === null) {
      setStartTime(now);
    }

    if (e.key === targetText[currentIndex]) {
      if (lastKeyChar.current !== null && lastKeyPressTime.current !== null) {
        bigramSamples.current.push({
          key_a: lastKeyChar.current,
          key_b: targetText[currentIndex],
          latency_ms: parseFloat((now - lastKeyPressTime.current).toFixed(2)),
          is_error: false,
        });
      }
      setHasError(false);
      lastKeyChar.current = e.key;
      lastKeyPressTime.current = now;
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex === targetText.length) {
        setCompletedAt(now);
        setCompleted(true);
      }
    } else {
      setHasError(true);
      setErrors((prev) => prev + 1);
      if (lastKeyChar.current !== null && lastKeyPressTime.current !== null) {
        bigramSamples.current.push({
          key_a: lastKeyChar.current,
          key_b: targetText[currentIndex],
          latency_ms: parseFloat((now - lastKeyPressTime.current).toFixed(2)),
          is_error: true,
        });
      }
    }
  }, [currentIndex, targetText, completed, startTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const submitSession = useCallback(async () => {
    if (!startTime) return;
    const durationSeconds = (performance.now() - startTime) / 1000;
    const totalWords = targetText.length / 5;
    const rawWpm = (totalWords / durationSeconds) * 60;
    const netWpm = Math.max(0, rawWpm - (errors / (durationSeconds / 60)));
    const accuracy = Math.max(0, (currentIndex / (currentIndex + errors)) * 100);

    if (userId === undefined) return;
    const payload = {
      user_id: userId,
      net_wpm: parseFloat(netWpm.toFixed(2)),
      raw_wpm: parseFloat(rawWpm.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2)),
      total_errors: errors,
      duration_seconds: parseFloat(durationSeconds.toFixed(2)),
      samples: bigramSamples.current,
    };

    try {
      await apiRequest('/telemetry/submit', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      console.error('Failed to submit session telemetry:', err);
    }
  }, [startTime, targetText, errors, currentIndex, userId]);

  useEffect(() => {
    if (completed) {
      submitSession();
    }
  }, [completed, submitSession]);

  useEffect(() => {
    if (startTime === null || completed) return;
    const timer = window.setInterval(() => setClockNow(performance.now()), 250);
    return () => window.clearInterval(timer);
  }, [startTime, completed]);

  const now = completedAt ?? clockNow;
  const elapsedSeconds = startTime === null
    ? 0
    : Math.max(1, Math.floor((now - startTime) / 1000));
  const wpm = startTime !== null && now > startTime
    ? Math.round((currentIndex / 5) / (elapsedSeconds / 60))
    : 0;
  const accuracy = currentIndex + errors > 0
    ? Math.round((currentIndex / (currentIndex + errors)) * 100)
    : 100;

  return {
    currentIndex,
    errors,
    hasError,
    completed,
    reset: () => {
      setCurrentIndex(0);
      setStartTime(null);
      setClockNow(0);
      setErrors(0);
      setHasError(false);
      setCompleted(false);
      setCompletedAt(null);
      bigramSamples.current = [];
      lastKeyChar.current = null;
      lastKeyPressTime.current = null;
    },
    wpm,
    accuracy,
    elapsedSeconds,
  };
};