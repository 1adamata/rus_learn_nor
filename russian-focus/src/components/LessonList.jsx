
import React, { useEffect, useState } from 'react'
import lessonsNorwegian from '../data/lessons.json'
import lessonsKorean from '../data/lessons-korean.json'
import { TTSButton } from './TTSButton.jsx'

export function LessonList({ showHints, selectedUser }) {
  // Choose the appropriate lessons data based on selected user
  const lessons = selectedUser?.id === 'jaeyoon' ? lessonsKorean : lessonsNorwegian

  console.log('Using lessons data:', lessons?.length, 'lessons for user:', selectedUser?.name)
  
  const [openId, setOpenId] = useState(localStorage.getItem('openLesson') || lessons[0]?.id || 1)
  const [showTranscript, setShowTranscript] = useState(localStorage.getItem('showTranscript') === 'true')

  useEffect(() => {
    localStorage.setItem('openLesson', openId)
  }, [openId])

  useEffect(() => {
    localStorage.setItem('showTranscript', showTranscript)
  }, [showTranscript])

  // Function to generate phonetic transcription for Russian text
  const getPhoneticTranscription = (russianText) => {
    // Enhanced Russian to phonetic mapping with common pronunciation rules
    const phoneticMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'ye', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
      'ъ': '', 'ы': 'y', 'ь': "'", 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'Ye', 'Ё': 'Yo',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
      'Ъ': '', 'Ы': 'Y', 'Ь': "'", 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    
    let result = russianText.toLowerCase()
      // Handle specific combinations and rules
      .replace(/его$/g, 'ivo')  // genitive ending -его -> ivo
      .replace(/ого$/g, 'ovo')  // genitive ending -ого -> ovo
      .replace(/тс/g, 'ts')     // тс -> ts
      .replace(/дс/g, 'ts')     // дс -> ts
      .replace(/жи/g, 'zhy')    // жи -> zhy
      .replace(/ши/g, 'shy')    // ши -> shy
      .replace(/чи/g, 'chy')    // чи -> chy
      .replace(/щи/g, 'shchy')  // щи -> shchy
    
    // Apply character mapping
    result = result.split('').map(char => phoneticMap[char] || char).join('')
    
    // Clean up extra apostrophes and spaces
    result = result.replace(/'+/g, "'").replace(/\s+/g, ' ').trim()
    
    return result
  }

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
        <div className="lessons__controls">
          <button 
            className={`transcript-toggle ${showTranscript ? 'active' : ''}`}
            onClick={() => setShowTranscript(!showTranscript)}
            title="Toggle phonetic transcription"
          >
            📝 Transcript
          </button>
        </div>
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
                  {showTranscript && (
                    <div className="transcript">[{getPhoneticTranscription(p.ru)}]</div>
                  )}
                  <div className="en">{getTranslation(p)}</div>
                  <div className="tools">
                    <TTSButton text={p.ru} lang="ru-RU" />
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
