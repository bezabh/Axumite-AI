import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_WARNING_MS = 60 * 1000;      // 1 minute warning
const ACTIVITY_STORAGE_KEY = 'axumite_last_activity_timestamp';
const THROTTLE_MS = 2000;                  // Throttle activity event dispatch

export interface IdleTimerOptions {
  timeoutMs?: number;
  warningMs?: number;
  isLoggedIn: boolean;
  onIdle: () => void;
}

export interface IdleTimerState {
  remainingSeconds: number;
  isWarning: boolean;
  formattedRemaining: string;
  resetTimer: () => void;
  lastActive: Date;
}

export function useIdleTimer({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  warningMs = DEFAULT_WARNING_MS,
  isLoggedIn,
  onIdle,
}: IdleTimerOptions): IdleTimerState {
  const [remainingMs, setRemainingMs] = useState<number>(timeoutMs);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const lastActivityRef = useRef<number>(Date.now());
  const lastThrottleRef = useRef<number>(0);
  const hasTriggeredIdleRef = useRef<boolean>(false);
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  // Initialize or restore last activity from localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      hasTriggeredIdleRef.current = false;
      return;
    }

    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed <= Date.now()) {
          // If stored activity is already older than timeout
          if (Date.now() - parsed >= timeoutMs) {
            hasTriggeredIdleRef.current = true;
            onIdleRef.current();
            return;
          }
          lastActivityRef.current = parsed;
        }
      } else {
        const now = Date.now();
        lastActivityRef.current = now;
        localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
      }
    } catch {
      lastActivityRef.current = Date.now();
    }
    hasTriggeredIdleRef.current = false;
  }, [isLoggedIn, timeoutMs]);

  // Record user activity
  const handleUserActivity = useCallback(() => {
    if (!isLoggedIn) return;
    const now = Date.now();
    
    // Throttle writing to state / storage
    if (now - lastThrottleRef.current < THROTTLE_MS) {
      return;
    }
    lastThrottleRef.current = now;
    lastActivityRef.current = now;
    hasTriggeredIdleRef.current = false;

    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
    } catch {
      // Ignore localStorage errors
    }
  }, [isLoggedIn]);

  // Reset timer manually (e.g. clicked "Stay Logged In")
  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    lastThrottleRef.current = now;
    hasTriggeredIdleRef.current = false;
    setIsWarning(false);
    setRemainingMs(timeoutMs);
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
    } catch {
      // Ignore
    }
  }, [timeoutMs]);

  // Register multi-input event listeners for user activity
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'click',
      'pointerdown',
    ];

    const onActivity = () => handleUserActivity();

    events.forEach((evt) => {
      window.addEventListener(evt, onActivity, { passive: true });
    });

    // Multi-tab synchronization
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACTIVITY_STORAGE_KEY && e.newValue) {
        const remoteTime = parseInt(e.newValue, 10);
        if (!isNaN(remoteTime)) {
          lastActivityRef.current = remoteTime;
          hasTriggeredIdleRef.current = false;
        }
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, onActivity);
      });
      window.removeEventListener('storage', onStorage);
    };
  }, [isLoggedIn, handleUserActivity]);

  // Periodic timer check (every 1 second)
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const timeLeft = Math.max(0, timeoutMs - elapsed);

      setRemainingMs(timeLeft);

      // Check if within warning threshold
      if (timeLeft > 0 && timeLeft <= warningMs) {
        setIsWarning(true);
      } else {
        setIsWarning(false);
      }

      // Check if idle timeout reached
      if (timeLeft <= 0) {
        if (!hasTriggeredIdleRef.current) {
          hasTriggeredIdleRef.current = true;
          setIsWarning(false);
          onIdleRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, timeoutMs, warningMs]);

  // Formatting helpers
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedRemaining = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    remainingSeconds,
    isWarning,
    formattedRemaining,
    resetTimer,
    lastActive: new Date(lastActivityRef.current),
  };
}
