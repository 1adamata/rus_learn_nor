
import React, { useEffect, useState } from 'react'
import lessons from '../data/lessons.json'
import { TTSButton } from './TTSButton.jsx'

export function LessonList({ showHints }) {
  const [openId, setOpenId] = useState(localStorage.getItem('openLesson') || lessons[0].id)

  useEffect(() => {
    localStorage.setItem('openLesson', openId)
  }, [openId])

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
                  <div className="en">{p.en}</div>
                  <div className="tools">
                    <TTSButton text={p.ru} lang="ru-RU" />
                    <button onClick={() => addToDeck({ ru: p.ru, en: p.en })}>Add to deck</button>
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
