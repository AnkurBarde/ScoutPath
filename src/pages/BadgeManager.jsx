import { useState } from 'react'

const fixedBadges = [
  { name: 'First Aid', emoji: '🩹' },
  { name: 'Citizenship in the Community', emoji: '🏛️' },
  { name: 'Citizenship in the Nation', emoji: '🗽' },
  { name: 'Citizenship in the World', emoji: '🌍' },
  { name: 'Communication', emoji: '📢' },
  { name: 'Cooking', emoji: '🍳' },
  { name: 'Personal Fitness', emoji: '💪' },
  { name: 'Personal Management', emoji: '📊' },
  { name: 'Family Life', emoji: '👨‍👩‍👧' },
  { name: 'Camping', emoji: '⛺' },
]

const choiceGroups = [
  {
    label: 'Choose one',
    options: [
      { name: 'Emergency Preparedness', emoji: '🚨' },
      { name: 'Lifesaving', emoji: '🛟' },
    ]
  },
  {
    label: 'Choose one',
    options: [
      { name: 'Environmental Science', emoji: '🌿' },
      { name: 'Sustainability', emoji: '♻️' },
    ]
  },
  {
    label: 'Choose one',
    options: [
      { name: 'Swimming', emoji: '🏊' },
      { name: 'Hiking', emoji: '🥾' },
      { name: 'Cycling', emoji: '🚴' },
    ]
  }
]

const cardStyle = (earned) => ({
  backgroundColor: earned ? '#2ecc71' : 'white',
  color: earned ? 'white' : '#2c3e50',
  borderRadius: '16px',
  padding: '20px 15px',
  textAlign: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  border: earned ? '2px solid #27ae60' : '2px solid transparent',
})

function BadgeCard({ badge, earned, onToggle }) {
  return (
    <div
      onClick={() => onToggle(badge.name)}
      style={cardStyle(earned)}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>{badge.emoji}</div>
      <div style={{ fontWeight: '700', fontSize: '14px' }}>{badge.name}</div>
      {earned && <div style={{ marginTop: '6px', fontSize: '12px' }}>✓ Earned</div>}
    </div>
  )
}

function BadgeManager() {
  const [earned, setEarned] = useState([])
  const [groupSelections, setGroupSelections] = useState({})

  const toggleBadge = (name) => {
    setEarned(prev =>
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    )
  }

  const selectGroupBadge = (groupIndex, badgeName) => {
    setGroupSelections(prev => ({
      ...prev,
      [groupIndex]: prev[groupIndex] === badgeName ? null : badgeName
    }))
  }

  const totalEarned = earned.length + Object.values(groupSelections).filter(Boolean).length
  const totalRequired = 13

  return (
    <div style={{ padding: '30px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Merit Badge Manager</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Required for Eagle: <strong>{totalEarned} / {totalRequired}</strong>
      </p>

      <div style={{
        backgroundColor: '#eee',
        borderRadius: '10px',
        height: '12px',
        marginBottom: '40px'
      }}>
        <div style={{
          width: `${(totalEarned / totalRequired) * 100}%`,
          backgroundColor: '#2ecc71',
          height: '12px',
          borderRadius: '10px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <h2 style={{ fontWeight: '700', marginBottom: '20px' }}>Required Badges</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '15px',
        marginBottom: '40px'
      }}>
        {fixedBadges.map(badge => (
          <BadgeCard
            key={badge.name}
            badge={badge}
            earned={earned.includes(badge.name)}
            onToggle={toggleBadge}
          />
        ))}
      </div>

      {choiceGroups.map((group, groupIndex) => (
        <div key={groupIndex} style={{ marginBottom: '30px' }}>
          <h2 style={{ fontWeight: '700', marginBottom: '15px' }}>
            {group.label}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '15px'
          }}>
            {group.options.map(badge => (
              <BadgeCard
                key={badge.name}
                badge={badge}
                earned={groupSelections[groupIndex] === badge.name}
                onToggle={() => selectGroupBadge(groupIndex, badge.name)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BadgeManager