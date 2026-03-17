import { useState } from 'react'

const requiredBadges = [
  'First Aid', 'Citizenship in the Community', 'Citizenship in the Nation',
  'Citizenship in the World', 'Communication', 'Cooking', 'Personal Fitness',
  'Emergency Preparedness', 'Environmental Science', 'Personal Management',
  'Swimming', 'Family Life', 'Cycling', 'Hiking', 'Athletics'
]

function BadgeManager() {
  const [earned, setEarned] = useState([])

  const toggleBadge = (badge) => {
    if (earned.includes(badge)) {
      setEarned(earned.filter(b => b !== badge))
    } else {
      setEarned([...earned, badge])
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Merit Badge Manager</h1>
      <p>Required Eagle badges: <strong>{earned.length} / 13</strong></p>
      {requiredBadges.map(badge => (
        <div
          key={badge}
          onClick={() => toggleBadge(badge)}
          style={{
            padding: '10px 15px',
            margin: '5px 0',
            backgroundColor: earned.includes(badge) ? '#2ecc71' : '#eee',
            color: earned.includes(badge) ? 'white' : 'black',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {badge}
        </div>
      ))}
    </div>
  )
}

export default BadgeManager