
import React from 'react'

export function TTSButton({ text, lang='ru-RU' }) {
  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis not supported in this browser.')
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }
  return <button onClick={speak} aria-label="Play pronunciation">🔊</button>
}
