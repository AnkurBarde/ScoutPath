import { useState, useEffect, useRef } from 'react'

const EAGLE_REQUIRED = [
  'First Aid', 'Citizenship in the Community', 'Citizenship in the Nation',
  'Citizenship in the World', 'Communication', 'Cooking', 'Personal Fitness',
  'Personal Management', 'Camping', 'Family Life',
  'Emergency Preparedness', 'Lifesaving',
  'Environmental Science', 'Sustainability',
  'Swimming', 'Hiking', 'Cycling'
]

const CHOICE_GROUPS = [
  { label: 'Choose one', badges: ['Emergency Preparedness', 'Lifesaving'] },
  { label: 'Choose one', badges: ['Environmental Science', 'Sustainability'] },
  { label: 'Choose one', badges: ['Swimming', 'Hiking', 'Cycling'] },
]

const ALL_BADGES = [
  'American Business', 'American Cultures', 'American Heritage', 'American Indian Culture',
  'American Labor', 'Animal Science', 'Animation', 'Archaeology', 'Archery', 'Architecture',
  'Art', 'Artificial Intelligence', 'Astronomy', 'Athletics', 'Automotive Maintenance',
  'Aviation', 'Backpacking', 'Basketry', 'Bird Study', 'Bugling', 'Camping', 'Canoeing',
  'Chemistry', 'Chess', 'Citizenship in Society', 'Citizenship in the Community',
  'Citizenship in the Nation', 'Citizenship in the World', 'Climbing', 'Coin Collecting',
  'Collections', 'Communication', 'Composite Materials', 'Cooking', 'Crime Prevention',
  'Cybersecurity', 'Cycling', 'Dentistry', 'Digital Technology', 'Disabilities Awareness',
  'Dog Care', 'Drafting', 'Electricity', 'Electronics', 'Emergency Preparedness', 'Energy',
  'Engineering', 'Entrepreneurship', 'Environmental Science', 'Exploration', 'Family Life',
  'Farm Mechanics', 'Fingerprinting', 'Fire Safety', 'First Aid', 'Fish & Wildlife Management',
  'Fishing', 'Fly Fishing', 'Forestry', 'Game Design', 'Gardening', 'Genealogy', 'Geocaching',
  'Geology', 'Golf', 'Graphic Arts', 'Health Care Professions', 'Hiking', 'Home Repairs',
  'Horsemanship', 'Insect Study', 'Inventing', 'Journalism', 'Kayaking',
  'Landscape Architecture', 'Law', 'Leatherwork', 'Lifesaving', 'Mammal Study', 'Metalwork',
  'Mining in Society', 'Model Design and Building', 'Motorboating', 'Moviemaking', 'Multisport',
  'Music', 'Nature', 'Nuclear Science', 'Oceanography', 'Orienteering', 'Painting',
  'Personal Fitness', 'Personal Management', 'Pets', 'Photography', 'Pioneering',
  'Plant Science', 'Plumbing', 'Pottery', 'Programming', 'Public Health', 'Public Speaking',
  'Pulp and Paper', 'Radio', 'Railroading', 'Reading', 'Reptile and Amphibian Study',
  'Rifle Shooting', 'Robotics', 'Rowing', 'Safety', 'Salesmanship', 'Scholarship',
  'Scouting Heritage', 'Scuba Diving', 'Sculpture', 'Search and Rescue', 'Shotgun Shooting',
  'Signs, Signals, and Codes', 'Skating', 'Small-Boat Sailing', 'Snow Sports',
  'Soil and Water Conservation', 'Space Exploration', 'Sports', 'Stamp Collecting',
  'Surveying', 'Sustainability', 'Swimming', 'Textile', 'Theater', 'Traffic Safety',
  'Truck Transportation', 'Veterinary Medicine', 'Water Sports', 'Weather', 'Welding',
  'Whitewater', 'Wilderness Survival', 'Wood Carving', 'Woodwork'
]

const BADGE_EMOJI = {
  'First Aid': '🩹', 'Citizenship in the Community': '🏛️', 'Citizenship in the Nation': '🗽',
  'Citizenship in the World': '🌍', 'Communication': '📢', 'Cooking': '🍳',
  'Personal Fitness': '💪', 'Personal Management': '📊', 'Camping': '⛺',
  'Family Life': '👨‍👩‍👧', 'Emergency Preparedness': '🚨', 'Lifesaving': '🛟',
  'Environmental Science': '🌿', 'Sustainability': '♻️', 'Swimming': '🏊',
  'Hiking': '🥾', 'Cycling': '🚴', 'Astronomy': '🔭', 'Aviation': '✈️',
  'Archery': '🎯', 'Art': '🎨', 'Backpacking': '🎒', 'Bird Study': '🐦',
  'Chemistry': '🧪', 'Chess': '♟️', 'Climbing': '🧗', 'Coin Collecting': '🪙',
  'Dog Care': '🐕', 'Electricity': '⚡', 'Electronics': '🔌', 'Energy': '🔋',
  'Engineering': '⚙️', 'Fishing': '🎣', 'Fly Fishing': '🪝', 'Forestry': '🌲',
  'Game Design': '🎮', 'Gardening': '🌱', 'Geology': '🪨', 'Golf': '⛳',
  'Horsemanship': '🐴', 'Journalism': '📰', 'Kayaking': '🛶', 'Law': '⚖️',
  'Music': '🎵', 'Nature': '🍃', 'Oceanography': '🌊', 'Orienteering': '🧭',
  'Photography': '📷', 'Pioneering': '🪢', 'Programming': '💻', 'Radio': '📻',
  'Reading': '📚', 'Rifle Shooting': '🎯', 'Robotics': '🤖', 'Rowing': '🚣',
  'Scholarship': '🎓', 'Scuba Diving': '🤿', 'Shotgun Shooting': '🎯',
  'Skating': '⛸️', 'Small-Boat Sailing': '⛵', 'Snow Sports': '⛷️',
  'Space Exploration': '🚀', 'Sports': '🏅', 'Theater': '🎭',
  'Veterinary Medicine': '🐾', 'Weather': '🌤️', 'Welding': '🔧',
  'Wilderness Survival': '🏕️', 'Wood Carving': '🪵', 'Woodwork': '🔨',
  'Artificial Intelligence': '🤖', 'Cybersecurity': '🔒',
  'Digital Technology': '📱', 'Entrepreneurship': '💼',
}

function getBadgeEmoji(name) {
  return BADGE_EMOJI[name] || '🎖️'
}

function isEagleRequired(name) {
  return EAGLE_REQUIRED.includes(name)
}

function getChoiceGroup(name) {
  return CHOICE_GROUPS.find(g => g.badges.includes(name)) || null
}

function BadgeChatbot({ earnedBadges, inProgressBadges }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! Ask me anything about merit badges — which ones are easiest, most fun, best for Eagle, or how to complete a specific one.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input.trim() }
    const context = `(Scout context: earned badges: ${earnedBadges.join(', ') || 'none yet'}; in progress: ${inProgressBadges.join(', ') || 'none'})`

    const apiMessages = [
      ...messages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: `${context}\n\n${input.trim()}` }
    ]

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })
      const data = await response.json()
      const text = data.content?.find(b => b.type === 'text')?.text
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', content: text }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Check your connection.' }])
    }

    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '340px',
          height: '480px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1.5px solid #eee'
        }}>
          <div style={{
            backgroundColor: '#2c3e50',
            padding: '16px 18px',
            color: 'white'
          }}>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>🤖 Badge Advisor</div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>Ask me anything about merit badges</div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: msg.role === 'user' ? '#2c3e50' : '#f0f4f8',
                  color: msg.role === 'user' ? 'white' : '#2c3e50',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  backgroundColor: '#f0f4f8',
                  fontSize: '13px',
                  color: '#999'
                }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: '12px',
            borderTop: '1.5px solid #eee',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Ask about merit badges..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #ddd',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                padding: '10px 14px',
                backgroundColor: !input.trim() || loading ? '#ccc' : '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '800',
                fontSize: '13px'
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function BadgeManager() {
  const [badgeStatus, setBadgeStatus] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_badge_status') || '{}') } catch { return {} }
  })
  const [badgeReqs, setBadgeReqs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_badge_reqs') || '{}') } catch { return {} }
  })
  const [badgeDates, setBadgeDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_badge_dates') || '{}') } catch { return {} }
  })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('eagle-first')
  const [expandedBadge, setExpandedBadge] = useState(null)

  useEffect(() => { localStorage.setItem('sp_badge_status', JSON.stringify(badgeStatus)) }, [badgeStatus])
  useEffect(() => { localStorage.setItem('sp_badge_reqs', JSON.stringify(badgeReqs)) }, [badgeReqs])
  useEffect(() => { localStorage.setItem('sp_badge_dates', JSON.stringify(badgeDates)) }, [badgeDates])

  const cycleStatus = (name) => {
    const current = badgeStatus[name] || 'not-started'
    const next = current === 'not-started' ? 'in-progress' : current === 'in-progress' ? 'earned' : 'not-started'
    setBadgeStatus(prev => ({ ...prev, [name]: next }))
    if (next === 'earned' && !badgeDates[name]) {
      setBadgeDates(prev => ({ ...prev, [name]: new Date().toISOString().split('T')[0] }))
    }
    if (next === 'not-started') {
      setBadgeDates(prev => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const toggleReq = (badge, reqIndex) => {
    const current = badgeReqs[badge] || []
    const updated = current.includes(reqIndex)
      ? current.filter(i => i !== reqIndex)
      : [...current, reqIndex]
    setBadgeReqs(prev => ({ ...prev, [badge]: updated }))
  }

  const setReqCount = (badge, count) => {
    setBadgeReqs(prev => ({ ...prev, [`${badge}_count`]: parseInt(count) || 0 }))
  }

  const choiceGroupMet = (group) => group.badges.some(b => badgeStatus[b] === 'earned')

  const eagleRequiredMet = [
    badgeStatus['First Aid'] === 'earned',
    badgeStatus['Citizenship in the Community'] === 'earned',
    badgeStatus['Citizenship in the Nation'] === 'earned',
    badgeStatus['Citizenship in the World'] === 'earned',
    badgeStatus['Communication'] === 'earned',
    badgeStatus['Cooking'] === 'earned',
    badgeStatus['Personal Fitness'] === 'earned',
    badgeStatus['Personal Management'] === 'earned',
    badgeStatus['Camping'] === 'earned',
    badgeStatus['Family Life'] === 'earned',
    choiceGroupMet(CHOICE_GROUPS[0]),
    choiceGroupMet(CHOICE_GROUPS[1]),
    choiceGroupMet(CHOICE_GROUPS[2]),
  ].filter(Boolean).length

  const totalEarned = ALL_BADGES.filter(b => badgeStatus[b] === 'earned').length
  const electivesEarned = ALL_BADGES.filter(b => badgeStatus[b] === 'earned' && !isEagleRequired(b)).length
  const electivesNeeded = Math.max(0, 8 - electivesEarned)

  const earnedBadgesList = ALL_BADGES.filter(b => badgeStatus[b] === 'earned')
  const inProgressBadgesList = ALL_BADGES.filter(b => badgeStatus[b] === 'in-progress')

  const getStatusColor = (status) => {
    if (status === 'earned') return '#2ecc71'
    if (status === 'in-progress') return '#f39c12'
    return '#eee'
  }

  const getStatusTextColor = (status) => {
    if (status === 'earned' || status === 'in-progress') return 'white'
    return '#2c3e50'
  }

  const getStatusLabel = (status) => {
    if (status === 'earned') return '✓ Earned'
    if (status === 'in-progress') return '⋯ In Progress'
    return '+ Not Started'
  }

  let filteredBadges = ALL_BADGES.filter(name => {
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase())
    const status = badgeStatus[name] || 'not-started'
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'eagle-required' ? isEagleRequired(name) :
      filter === 'earned' ? status === 'earned' :
      filter === 'in-progress' ? status === 'in-progress' :
      filter === 'not-started' ? status === 'not-started' : true
    return matchesSearch && matchesFilter
  })

  if (sort === 'eagle-first') {
    filteredBadges = [
      ...filteredBadges.filter(isEagleRequired),
      ...filteredBadges.filter(b => !isEagleRequired(b))
    ]
  } else if (sort === 'alpha') {
    filteredBadges = [...filteredBadges].sort((a, b) => a.localeCompare(b))
  } else if (sort === 'status') {
    const order = { earned: 0, 'in-progress': 1, 'not-started': 2 }
    filteredBadges = [...filteredBadges].sort((a, b) =>
      (order[badgeStatus[a] || 'not-started']) - (order[badgeStatus[b] || 'not-started'])
    )
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Merit Badge Manager</h1>

      {/* Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Eagle-Required', value: `${eagleRequiredMet} / 13`, color: '#2ecc71' },
          { label: 'Total Earned', value: `${totalEarned} / 21`, color: '#3498db' },
          { label: 'Electives Earned', value: `${electivesEarned} / 8`, color: '#9b59b6' },
          { label: 'Electives Still Needed', value: electivesNeeded, color: electivesNeeded === 0 ? '#2ecc71' : '#e67e22' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Eagle Merit Badge Progress</span>
          <span style={{ fontWeight: '700', fontSize: '14px', color: '#2ecc71' }}>{Math.round((Math.min(totalEarned, 21) / 21) * 100)}%</span>
        </div>
        <div style={{ backgroundColor: '#eee', borderRadius: '10px', height: '12px' }}>
          <div style={{
            width: `${Math.min((totalEarned / 21) * 100, 100)}%`,
            backgroundColor: '#2ecc71',
            height: '12px',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search badges..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid #ddd',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            flex: '1',
            minWidth: '180px'
          }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid #ddd',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Badges</option>
          <option value="eagle-required">Eagle Required</option>
          <option value="earned">Earned</option>
          <option value="in-progress">In Progress</option>
          <option value="not-started">Not Started</option>
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid #ddd',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="eagle-first">Eagle Required First</option>
          <option value="alpha">Alphabetical</option>
          <option value="status">By Status</option>
        </select>
      </div>

      {/* Badge Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px'
      }}>
        {filteredBadges.map(name => {
          const status = badgeStatus[name] || 'not-started'
          const isExpanded = expandedBadge === name
          const reqCount = badgeReqs[`${name}_count`] || 0
          const checkedReqs = badgeReqs[name] || []
          const group = getChoiceGroup(name)

          return (
            <div key={name} style={{
              gridColumn: isExpanded ? '1 / -1' : undefined,
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
              border: isEagleRequired(name)
                ? `2px solid ${status === 'earned' ? '#2ecc71' : '#f0c080'}`
                : '2px solid transparent',
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}>
              <div
                onClick={() => setExpandedBadge(isExpanded ? null : name)}
                style={{ padding: '16px 14px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>
                  {getBadgeEmoji(name)}
                </div>
                <div style={{ fontWeight: '700', fontSize: '13px', textAlign: 'center', marginBottom: '8px', color: '#2c3e50' }}>
                  {name}
                </div>
                {isEagleRequired(name) && (
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#e67e22',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px'
                  }}>
                    {group ? `Eagle Required (${group.label})` : 'Eagle Required'}
                  </div>
                )}
                <button
                  onClick={e => { e.stopPropagation(); cycleStatus(name) }}
                  style={{
                    width: '100%',
                    padding: '7px',
                    backgroundColor: getStatusColor(status),
                    color: getStatusTextColor(status),
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}
                >
                  {getStatusLabel(status)}
                </button>
              </div>

              {isExpanded && (
                <div style={{
                  padding: '16px',
                  borderTop: '1.5px solid #eee',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <h3 style={{ fontWeight: '800', fontSize: '15px', marginBottom: '12px' }}>
                        Requirement Tracker
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                          Number of requirements:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={reqCount}
                          onChange={e => setReqCount(name, e.target.value)}
                          style={{
                            width: '60px',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            border: '1.5px solid #ddd',
                            fontFamily: 'Nunito, sans-serif',
                            fontSize: '13px',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      {reqCount > 0 && (
                        <div>
                          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                            {checkedReqs.length} / {reqCount} completed
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {Array.from({ length: reqCount }, (_, i) => (
                              <div
                                key={i}
                                onClick={() => toggleReq(name, i)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  backgroundColor: checkedReqs.includes(i) ? '#2ecc71' : '#eee',
                                  color: checkedReqs.includes(i) ? 'white' : '#999',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {checkedReqs.includes(i) ? '✓' : i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ minWidth: '200px' }}>
                      <h3 style={{ fontWeight: '800', fontSize: '15px', marginBottom: '12px' }}>
                        Details
                      </h3>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                          Status:
                        </label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {['not-started', 'in-progress', 'earned'].map(s => (
                            <button
                              key={s}
                              onClick={() => setBadgeStatus(prev => ({ ...prev, [name]: s }))}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Nunito, sans-serif',
                                fontWeight: '700',
                                fontSize: '12px',
                                backgroundColor: status === s ? getStatusColor(s) : '#eee',
                                color: status === s ? getStatusTextColor(s) : '#666'
                              }}
                            >
                              {s === 'not-started' ? 'Not Started' : s === 'in-progress' ? 'In Progress' : 'Earned'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {status === 'earned' && (
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '4px' }}>
                            Date Earned:
                          </label>
                          <input
                            type="date"
                            value={badgeDates[name] || ''}
                            onChange={e => setBadgeDates(prev => ({ ...prev, [name]: e.target.value }))}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1.5px solid #ddd',
                              fontFamily: 'Nunito, sans-serif',
                              fontSize: '13px'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          No badges match your search or filter.
        </div>
      )}

      <BadgeChatbot
        earnedBadges={earnedBadgesList}
        inProgressBadges={inProgressBadgesList}
      />
    </div>
  )
}