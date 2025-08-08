
import React, { useState, useEffect } from 'react'
import { FocusToggle } from './components/FocusToggle.jsx'
import { Pomodoro } from './components/Pomodoro.jsx'
import { LessonList } from './components/LessonList.jsx'
import { Flashcards } from './components/Flashcards.jsx'
import { Settings } from './components/Settings.jsx'
import './styles/app.css'

export default function App() {
  const [view, setView] = useState('lessons')
  const [focus, setFocus] = useState(false)
  const [fontSize, setFontSize] = useState(Number(localStorage.getItem('fontSize') || 18))
  const [lineHeight, setLineHeight] = useState(Number(localStorage.getItem('lineHeight') || 1.6))
  const [showHints, setShowHints] = useState(localStorage.getItem('showHints') !== 'false')

  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-size', fontSize + 'px')
    document.documentElement.style.setProperty('--app-line-height', lineHeight)
  }, [fontSize, lineHeight])

  return (
    <div className={`app ${focus ? 'focus' : ''}`}>
      <header className="app__header">
        <h1>Добро пожаловать 👋 | Russian Focus</h1>
        <nav className="app__nav">
          <button onClick={() => setView('lessons')} className={view === 'lessons' ? 'active' : ''}>Lessons</button>
          <button onClick={() => setView('flashcards')} className={view === 'flashcards' ? 'active' : ''}>Flashcards</button>
          <button onClick={() => setView('settings')} className={view === 'settings' ? 'active' : ''}>Settings</button>
        </nav>
        <div className="app__tools">
          <Pomodoro />
          <FocusToggle value={focus} onChange={setFocus} />
        </div>
      </header>

      <main className="app__main">
        {view === 'lessons' && <LessonList showHints={showHints} />}
        {view === 'flashcards' && <Flashcards />}
        {view === 'settings' && <Settings
          fontSize={fontSize}
          lineHeight={lineHeight}
          setFontSize={(v)=>{ setFontSize(v); localStorage.setItem('fontSize', v) }}
          setLineHeight={(v)=>{ setLineHeight(v); localStorage.setItem('lineHeight', v) }}
          showHints={showHints}
          setShowHints={(v)=>{ setShowHints(v); localStorage.setItem('showHints', v) }}
        />}
      </main>
      <footer className="app__footer">
        Built for a friend from Norway 🇳🇴 to learn Russian 🇷🇺 — ADHD-friendly (focus mode, short chunks, TTS, timers, & spaced repetition).
      </footer>
    </div>
  )
}
