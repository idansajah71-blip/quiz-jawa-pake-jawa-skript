import { useEffect, useRef, useState } from "react"
import { SECOND_PER_QUESTION } from "../store/quizStore"

export function useTimer(duration = SECOND_PER_QUESTION, onTimeout: () => void) {
  const [remaining, setRemaining] = useState(duration)
  const onTimeoutRef = useRef(onTimeout)
  const startRef = useRef(Date.now())

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    startRef.current = Date.now()
    setRemaining(duration)
    const iv = setInterval(() => {
      const r = window.__jawaTimer.hitungSisa(startRef.current, duration, Date.now())
      setRemaining(r)
      if (r <= 0) {
        clearInterval(iv)
        onTimeoutRef.current()
      }
    }, 500)
    return () => clearInterval(iv)
  }, [duration])

  return remaining
}