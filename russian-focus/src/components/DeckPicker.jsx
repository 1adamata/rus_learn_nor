
import React, { useEffect, useState } from 'react'

export function DeckPicker({ onPick, selectedUser }) {
  const [manifest, setManifest] = useState([])

  useEffect(() => {
    // Choose appropriate manifest based on selected user
    const manifestPath = selectedUser?.id === 'jaeyoon' 
      ? '/decks/manifest-korean.json'
      : '/decks/manifest.json'
    
    console.log('Loading manifest from:', manifestPath)
    
    fetch(manifestPath)
      .then(r => {
        if (!r.ok) {
          throw new Error(`Failed to load manifest: ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        console.log('Loaded manifest:', data)
        setManifest(data || [])
      })
      .catch(err => {
        console.error('Error loading manifest:', err)
        // Fallback to Norwegian manifest
        fetch('/decks/manifest.json')
          .then(r => r.json())
          .then(setManifest)
          .catch(() => setManifest([]))
      })
  }, [selectedUser])

  return (
    <div className="deck-picker">
      <h2>Choose a deck</h2>
      <p className="deck-picker__subtitle">
        Learning Russian → {selectedUser?.language || 'English'} {selectedUser?.flag}
      </p>
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
