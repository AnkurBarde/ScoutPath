import { useState, useEffect } from 'react'

const ranks = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle']

const rankEmoji = {
  Scout: '⭐',
  Tenderfoot: '🌱',
  'Second Class': '🔵',
  'First Class': '🔴',
  Star: '🌟',
  Life: '❤️',
  Eagle: '🦅',
}

const requirementNames = {
  Scout: ['1a','1b','1c','1d','1e','1f','2a','2b','2c','2d','3a','3b','4a','4b','5','6','7'],
  Tenderfoot: ['1a','1b','1c','2a','2b','2c','3a','3b','3c','3d','4a','4b','4c','4d','5a','5b','5c','6a','6b','6c','7a','7b','8','9','10','11'],
  'Second Class': ['1a','1b','1c','2a','2b','2c','2d','2e','2f','2g','3a','3b','3c','3d','4','5a','5b','5c','5d','6a','6b','6c','6d','6e','7a','7b','7c','8a','8b','8c','8d','8e','9a','9b','10','11','12'],
  'First Class': ['1a','1b','2a','2b','2c','2d','2e','3a','3b','3c','3d','4a','4b','5a','5b','5c','5d','6a','6b','6c','6d','6e','7a','7b','7c','7d','7e','7f','8a','8b','9a','9b','9c','9d','10','11','12','13'],
  Star: ['1','2','3','4','5','6','7','8'],
  Life: ['1','2','3','4','5','6','7','8'],
  Eagle: ['1','2','3','4','5','6','7'],
}

const eagleApplicationChecklist = [
  'Eagle Scout Rank Application completed',
  'Statement of ambitions and life purpose written',
  'List of positions held in religious, school, camp, community organizations',
  'Parent/guardian reference secured',
  'Religious reference secured',
  'Educational reference secured',
  'Employer reference secured (if employed)',
  'Two additional references secured',
  'Eagle Scout Service Project Workbook completed',
  'Scoutmaster conference completed',
  'Board of review scheduled',
]

function loadProgress() {
  try {
    const rank = localStorage.getItem('sp_rank') || null
    const completed = JSON.parse(localStorage.getItem('sp_completed') || '{}')
    const badgeStatus = JSON.parse(localStorage.getItem('sp_badge_status') || '{}')
    const earnedBadges = Object.entries(badgeStatus).filter(([, s]) => s === 'earned').length
    return { rank, completed, earnedBadges }
  } catch {
    return { rank: null, completed: {}, earnedBadges: 0 }
  }
}

export default function EagleRoadmap() {
  const [birthday, setBirthday] = useState(() => localStorage.getItem('sp_birthday') || '')
  const [projectStatus, setProjectStatus] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_project') || '{}') } catch { return {} }
  })
  const [appChecklist, setAppChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_app_checklist') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('sp_birthday', birthday) }, [birthday])
  useEffect(() => { localStorage.setItem('sp_project', JSON.stringify(projectStatus)) }, [projectStatus])
  useEffect(() => { localStorage.setItem('sp_app_checklist', JSON.stringify(appChecklist)) }, [appChecklist])

  const { rank, completed, earnedBadges } = loadProgress()
  const currentRankIndex = ranks.indexOf(rank)

  const getRankProgress = (r) => {
    const reqs = requirementNames[r] || []
    const done = reqs.filter(id => completed[id + r]).length
    return { done, total: reqs.length }
  }

  const daysUntil18 = () => {
    if (!birthday) return null
    const birth = new Date(birthday)
    const eighteenth = new Date(birth)
    eighteenth.setFullYear(eighteenth.getFullYear() + 18)
    const diff = Math.ceil((eighteenth - new Date()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const days = daysUntil18()
  const atRisk = days !== null && days < 365

  const toggleAppItem = (item) => {
    setAppChecklist(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const overallProgress = () => {
    if (!rank) return 0
    const totalReqs = ranks.slice(0, currentRankIndex + 1).reduce((sum, r) => {
      return sum + (requirementNames[r]?.length || 0)
    }, 0)
    const allReqs = ranks.reduce((sum, r) => sum + (requirementNames[r]?.length || 0), 0)
    const doneReqs = ranks.slice(0, currentRankIndex + 1).reduce((sum, r) => {
      const reqs = requirementNames[r] || []
      return sum + reqs.filter(id => completed[id + r]).length
    }, 0)
    return Math.round((doneReqs / allReqs) * 100)
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '780px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>🦅 Eagle Roadmap</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Your full path from where you are to Eagle Scout.</p>

      {/* Birthday Countdown */}
      <div style={{
        backgroundColor: atRisk ? '#fff3e0' : 'white',
        border: `1.5px solid ${atRisk ? '#e67e22' : '#ddd'}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '12px' }}>
          🎂 18th Birthday Countdown
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #ddd',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px'
            }}
          />
          {days !== null && (
            <div>
              {days <= 0 ? (
                <span style={{ fontWeight: '800', color: '#2ecc71', fontSize: '15px' }}>
                  🎉 You've passed your 18th birthday
                </span>
              ) : (
                <span style={{
                  fontWeight: '800',
                  fontSize: '15px',
                  color: atRisk ? '#e67e22' : '#2c3e50'
                }}>
                  {atRisk && '⚠️ '}{days} days until your 18th birthday
                  {atRisk && ' — you need to move quickly to make Eagle in time'}
                </span>
              )}
            </div>
          )}
          {!birthday && (
            <span style={{ color: '#999', fontSize: '13px' }}>Enter your birthday to see your countdown</span>
          )}
        </div>
      </div>

      {/* Overall Progress */}
      {rank && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '15px' }}>Overall Eagle Progress</span>
            <span style={{ fontWeight: '800', color: '#2ecc71' }}>{overallProgress()}%</span>
          </div>
          <div style={{ backgroundColor: '#eee', borderRadius: '10px', height: '14px' }}>
            <div style={{
              width: `${overallProgress()}%`,
              backgroundColor: '#2ecc71',
              height: '14px',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>
              Current rank: <strong>{rank}</strong>
            </span>
            <span style={{ fontSize: '13px', color: '#666' }}>
              Merit badges earned: <strong>{earnedBadges}</strong> / 21
            </span>
          </div>
        </div>
      )}

      {!rank && (
        <div style={{
          backgroundColor: '#fff8e1',
          border: '1.5px solid #f0c080',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#b7770d'
        }}>
          ⚠️ Go to the Rank Tracker and select the rank you are working toward to see your roadmap.
        </div>
      )}

      {/* Rank Timeline */}
      <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>Rank Timeline</h2>
      <div style={{ marginBottom: '32px' }}>
        {ranks.map((r, i) => {
          const { done, total } = getRankProgress(r)
          const isCurrentRank = r === rank
          const isCompleted = currentRankIndex > i
          const isUpcoming = currentRankIndex < i
          const pct = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <div key={r} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>

              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#2ecc71' : isCurrentRank ? '#2c3e50' : '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                  boxShadow: isCurrentRank ? '0 0 0 4px rgba(44,62,80,0.2)' : 'none'
                }}>
                  {isCompleted ? '✓' : rankEmoji[r]}
                </div>
                {i < ranks.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '16px',
                    backgroundColor: isCompleted ? '#2ecc71' : '#eee',
                    margin: '4px 0'
                  }} />
                )}
              </div>

              {/* Rank card */}
              <div style={{
                flex: 1,
                backgroundColor: isCurrentRank ? '#f0f4f8' : 'white',
                borderRadius: '12px',
                padding: '14px 16px',
                border: isCurrentRank ? '2px solid #2c3e50' : '1.5px solid #eee',
                marginBottom: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCurrentRank ? '10px' : '0' }}>
                  <span style={{
                    fontWeight: '800',
                    fontSize: '15px',
                    color: isUpcoming ? '#aaa' : '#2c3e50'
                  }}>
                    {r}
                    {isCurrentRank && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '11px',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: '700'
                      }}>
                        Current
                      </span>
                    )}
                    {isCompleted && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '11px',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: '700'
                      }}>
                        Done
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: '13px', color: '#999', fontWeight: '600' }}>
                    {done}/{total} reqs
                  </span>
                </div>

                {(isCurrentRank || isCompleted) && total > 0 && (
                  <div style={{ backgroundColor: '#ddd', borderRadius: '6px', height: '8px' }}>
                    <div style={{
                      width: `${pct}%`,
                      backgroundColor: isCompleted ? '#2ecc71' : '#3498db',
                      height: '8px',
                      borderRadius: '6px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Eagle Project */}
      <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>🔨 Eagle Project</h2>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        {[
          { key: 'idea', label: 'Project idea', placeholder: 'What is your project idea?' },
          { key: 'organization', label: 'Benefiting organization', placeholder: 'Which organization will benefit?' },
          { key: 'hours', label: 'Estimated hours', placeholder: 'How many total hours?' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: '14px' }}>
            <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={projectStatus[field.key] || ''}
              onChange={e => setProjectStatus(prev => ({ ...prev, [field.key]: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid #ddd',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        ))}

        <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
          Project status
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Not started', 'Planning', 'Proposal approved', 'In progress', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setProjectStatus(prev => ({ ...prev, status: s }))}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '700',
                fontSize: '13px',
                backgroundColor: projectStatus.status === s ? '#2c3e50' : '#eee',
                color: projectStatus.status === s ? 'white' : '#666',
                transition: 'all 0.2s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Application Checklist */}
      <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>📋 Eagle Application Checklist</h2>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '40px'
      }}>
        <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          {appChecklist.length} / {eagleApplicationChecklist.length} completed
        </p>
        {eagleApplicationChecklist.map(item => {
          const done = appChecklist.includes(item)
          return (
            <div
              key={item}
              onClick={() => toggleAppItem(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: done ? '#eafaf1' : '#fafafa',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: done ? '1.5px solid #2ecc71' : '1.5px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: done ? '#2ecc71' : '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {done && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: done ? '#999' : '#2c3e50',
                textDecoration: done ? 'line-through' : 'none'
              }}>
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}