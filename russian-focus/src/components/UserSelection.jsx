import React from 'react'

export function UserSelection({ onUserSelect }) {
  const users = [
    {
      id: 'soren',
      name: 'Soren',
      flag: '🇳🇴',
      language: 'Norwegian',
      description: 'Norsk oversettelser',
      color: '#ef4444'
    },
    {
      id: 'jaeyoon',
      name: 'Jaeyoon',
      flag: '🇰🇷',
      language: 'Korean',
      description: '한국어 번역',
      color: '#3b82f6'
    }
  ]

  return (
    <div className="user-selection">
      <div className="user-selection__container">
        <h1 className="user-selection__title">
          Who's learning Russian today?
        </h1>
        <p className="user-selection__subtitle">
          Choose your profile to customize the language
        </p>
        
        <div className="user-selection__profiles">
          {users.map(user => (
            <button
              key={user.id}
              className="user-profile"
              onClick={() => {
                console.log('Profile clicked:', user)
                onUserSelect(user)
              }}
              style={{ '--profile-color': user.color }}
            >
              <div className="user-profile__avatar">
                <span className="user-profile__flag">{user.flag}</span>
              </div>
              <div className="user-profile__info">
                <h3 className="user-profile__name">{user.name}</h3>
                <p className="user-profile__language">{user.language}</p>
                <p className="user-profile__description">{user.description}</p>
              </div>
            </button>
          ))}
        </div>
        
        <p className="user-selection__footer">
          Learn Russian with translations in your preferred language
        </p>
      </div>
    </div>
  )
}
