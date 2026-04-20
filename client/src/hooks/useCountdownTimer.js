import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Countdown in seconds; call resetTimer() when moving to the next question.
 * Clears interval on unmount / stop.
 */
export function useCountdownTimer(durationSeconds, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)
  const durationRef = useRef(durationSeconds)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    durationRef.current = durationSeconds
    setTimeLeft(durationSeconds)
  }, [durationSeconds])

  const clear = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const stopTimer = useCallback(() => {
    clear()
  }, [clear])

  const resetTimer = useCallback(() => {
    clear()
    const d = durationRef.current
    setTimeLeft(d)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear()
          onTimeUpRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear])

  useEffect(() => () => clear(), [clear])

  return { timeLeft, resetTimer, stopTimer }
}
