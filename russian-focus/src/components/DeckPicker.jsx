
import React, { useEffect, useState } from 'react'

export function DeckPicker({ onPick }) {
  const [manifest, setManifest] = useState([])

  useEffect(() => {
    fetch('/decks/manifest.json')
      .then(r => r.json())
      .then(setManifest)
      .catch(() => setManifest([]))
  }, [])

  return (
    <div className="deck-picker">
      <h2>Choose a deck</h2>
      <div className="deck-grid">
        {manifest.map(d => (
          <button key={d.key} className="deck-card" onClick={() => onPick(d)}>
            <div className="deck-card__title">{d.name}</div>
            <div className="deck-card__meta">{d.count} cards</div>
          </button>
        ))}
      </div>
    </div>
  )
}
