
import React, { useEffect, useState } from 'react'
import lessonsNorwegian from '../data/lessons.json'
import { TTSButton } from './TTSButton.jsx'

// Dynamically import Korean lessons with fallback
let lessonsKorean = lessonsNorwegian // Fallback to Norwegian
try {
  lessonsKorean = require('../data/lessons-korean.json')
} catch (error) {
  console.warn('Korean lessons not available, using Norwegian as fallback')
  lessonsKorean = lessonsNorwegian
}

export function LessonList({ showHints, selectedUser }) {
  // Choose the appropriate lessons data based on selected user
  let lessons = lessonsNorwegian // Default to Norwegian lessons
  
  try {
    if (selectedUser?.id === 'jaeyoon') {
      lessons = lessonsKorean
    }
  } catch (error) {
    console.error('Error loading lessons:', error)
    lessons = lessonsNorwegian // Fallback to Norwegian
  }
  
  console.log('Using lessons data:', lessons?.length, 'lessons for user:', selectedUser?.name)
  
  const [openId, setOpenId] = useState(localStorage.getItem('openLesson') || lessons[0]?.id || 1)

  useEffect(() => {
    localStorage.setItem('openLesson', openId)
  }, [openId])

  const getTranslation = (phrase) => {
    if (!phrase) return 'Translation not available'
    
    if (selectedUser?.id === 'jaeyoon') {
      return phrase.ko || phrase.en || 'Translation not available' // Use Korean if available, fallback to English
    }
    return phrase.no || phrase.en || 'Translation not available' // Use Norwegian if available, fallback to English
  }

  // Safety check for lessons
  if (!lessons || lessons.length === 0) {
    return (
      <div className="lessons-error">
        <h2>No lessons available</h2>
        <p>There was an error loading lessons for {selectedUser?.name}. Please try switching users or refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="lessons">
      <aside className="lessons__menu" aria-label="Lessons list">
        {lessons.map(les => (
          <button key={les.id} className={openId === String(les.id) ? 'active' : ''} onClick={() => setOpenId(String(les.id))}>
            {les.title}
          </button>
        ))}
      </aside>
      <section className="lessons__content">
        {lessons.map(les => (
          <article key={les.id} style={{display: openId === String(les.id) ? 'block' : 'none'}}>
            <h2>{les.title}</h2>
            <p className="hint" style={{display: showHints ? 'block' : 'none'}}>{les.hint}</p>
            <ul className="phrase-list">
              {les.phrases.map((p, i) => (
                <li key={i}>
                  <div className="ru">{p.ru}</div>
                  <div className="en">{getTranslation(p)}</div>
                  <div className="tools">
                    <TTSButton text={p.ru} lang="ru-RU" />
                    <button onClick={() => addToDeck({ ru: p.ru, en: getTranslation(p) })}>Add to deck</button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  )
}

function addToDeck(card) {
  const deck = JSON.parse(localStorage.getItem('deck') || '[]')
  if (!deck.find(d => d.ru === card.ru)) {
    deck.push({ ...card, box: 1, next: Date.now() })
    localStorage.setItem('deck', JSON.stringify(deck))
  }
  alert('Added to flashcards ✅')
}
