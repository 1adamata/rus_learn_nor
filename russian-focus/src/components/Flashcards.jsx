
import React, { useEffect, useState } from 'react'
import { DeckPicker } from './DeckPicker.jsx'

// JSON schema for cards in a deck:
// { "cards": [
//   { "russian": "Кошка", "transliteration": "Koshka", "norwegian": "Katt", "korean": "고양이", "image": "https://...", "ttsLang": "ru-RU" }
// ]}

export function Flashcards({ selectedUser }) {
  const [deckMeta, setDeckMeta] = useState(null) // { key, name, path }
  const [cards, setCards] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!deckMeta) return
    fetch(deckMeta.path).then(r => r.json()).then(data => {
      setCards(data.cards || [])
      setIdx(0)
      setFlipped(false)
    })
  }, [deckMeta])

  const current = cards[idx] || null

  const getTranslation = (card) => {
    if (!card) return ''
    if (selectedUser?.id === 'jaeyoon') {
      return card.korean || card.norwegian || 'Translation not available'
    }
    return card.norwegian || card.korean || 'Translation not available'
  }

  const next = () => {
    setIdx(i => (i + 1) % cards.length)
    setFlipped(false)
  }
  const prev = () => {
    setIdx(i => (i - 1 + cards.length) % cards.length)
    setFlipped(false)
  }

  const speak = () => {
    if (!current) return
    if (!('speechSynthesis' in window)) return alert('Speech Synthesis is not supported in this browser.')
    const u = new SpeechSynthesisUtterance(current.russian)
    u.lang = current.ttsLang || 'ru-RU'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }

  if (!deckMeta) {
    return <DeckPicker onPick={setDeckMeta} selectedUser={selectedUser} />
  }

  if (!cards.length) {
    return <div className="flashcards-empty">
      No cards found in this deck.
    </div>
  }

  return (
    <div className="flashcards flip-ui">
      <h2 className="center">Flashcards: {deckMeta.name}</h2>
      <div className="flip-card" onClick={() => setFlipped(f => !f)} role="button" aria-label="Flip card">
        <div className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
          <div className="flip-card-front">
            <div className="front-text">{current.russian}</div>
          </div>
          <div className="flip-card-back">
            {current.image && <img src={current.image} alt={getTranslation(current)} />}
            <div className="back-text">
              <div className="nor">{getTranslation(current)}</div>
              <div className="trl">{current.transliteration && `(${current.transliteration})`}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flip-controls">
        <button onClick={prev}>Prev</button>
        <button onClick={(e) => { e.stopPropagation(); speak() }}>🔊</button>
        <button onClick={next}>Next</button>
      </div>
      <div className="flip-meta">Card {idx + 1} / {cards.length}</div>
      <button className="link-like" onClick={() => setDeckMeta(null)}>← Back to decks</button>
    </div>
  )
}
