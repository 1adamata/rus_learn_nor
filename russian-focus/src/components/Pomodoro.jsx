
import React, { useEffect, useState, useRef } from 'react'

export function Pomodoro() {
  const [mode, setMode] = useState('work') // work | break
  const [workLen, setWorkLen] = useState(Number(localStorage.getItem('workLen') || 25))
  const [breakLen, setBreakLen] = useState(Number(localStorage.getItem('breakLen') || 5))
  const [seconds, setSeconds] = useState(workLen * 60)
  const [running, setRunning] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(timer.current)
  }, [running])

  useEffect(() => {
    if (seconds <= 0) {
      const nextMode = mode === 'work' ? 'break' : 'work'
      setMode(nextMode)
      const next = (nextMode === 'work' ? workLen : breakLen) * 60
      setSeconds(next)
      try { new AudioContext() } catch {}
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(nextMode === 'work' ? 'Back to work' : 'Take a short break')
        u.lang = 'en-US'
        window.speechSynthesis.speak(u)
      }
    }
  }, [seconds, mode, workLen, breakLen])

  const reset = () => {
    setMode('work')
    setSeconds(workLen * 60)
    setRunning(false)
  }

  const fmt = (n) => String(Math.floor(n/60)).padStart(2,'0') + ':' + String(n%60).padStart(2,'0')

  return (
    <div className="pomodoro" aria-label="Pomodoro timer">
      <div className="pomodoro__display">{fmt(seconds)} <small>{mode}</small></div>
      <div className="pomodoro__controls">
        <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="pomodoro__inputs">
        <label>Work
          <input type="number" min="5" max="60" value={workLen} onChange={e => {setWorkLen(Number(e.target.value)); localStorage.setItem('workLen', e.target.value)}}/>
        </label>
        <label>Break
          <input type="number" min="3" max="30" value={breakLen} onChange={e => {setBreakLen(Number(e.target.value)); localStorage.setItem('breakLen', e.target.value)}}/>
        </label>
      </div>
    </div>
  )
}
