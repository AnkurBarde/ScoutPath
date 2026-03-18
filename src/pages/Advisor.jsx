import { useState } from 'react'

const ranks = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle']

const requirementNames = {
  Scout: ['1a','1b','1c','1d','1e','1f','2a','2b','2c','2d','3a','3b','4a','4b','5','6','7'],
  Tenderfoot: ['1a','1b','1c','2a','2b','2c','3a','3b','3c','3d','4a','4b','4c','4d','5a','5b','5c','6a','6b','6c','7a','7b','8','9','10','11'],
  'Second Class': ['1a','1b','1c','2a','2b','2c','2d','2e','2f','2g','3a','3b','3c','3d','4','5a','5b','5c','5d','6a','6b','6c','6d','6e','7a','7b','7c','8a','8b','8c','8d','8e','9a','9b','10','11','12'],
  'First Class': ['1a','1b','2a','2b','2c','2d','2e','3a','3b','3c','3d','4a','4b','5a','5b','5c','5d','6a','6b','6c','6d','6e','7a','7b','7c','7d','7e','7f','8a','8b','9a','9b','9c','9d','10','11','12','13'],
  Star: ['1','2','3','4','5','6','7','8'],
  Life: ['1','2','3','4','5','6','7','8'],
  Eagle: ['1','2','3','4','5','6','7'],
}

function loadScoutData() {
  try {
    const rank = localStorage.getItem('sp_rank') || null
    const completed = JSON.parse(localStorage.getItem('sp_completed') || '{}')
    const badgeStatus = JSON.parse(localStorage.getItem('sp_badge_status') || '{}')

    const currentReqs = rank ? requirementNames[rank] || [] : []
    const completedReqs = currentReqs.filter(id => completed[id + rank])
    const incompleteReqs = currentReqs.filter(id => !completed[id + rank])

    const earnedBadges = Object.entries(badgeStatus)
      .filter(([, status]) => status === 'earned')
      .map(([name]) => name)
    const inProgressBadges = Object.entries(badgeStatus)
      .filter(([, status]) => status === 'in-progress')
      .map(([name]) => name)

    return {
      rank,
      completedReqs,
      incompleteReqs,
      earnedBadges,
      inProgressBadges,
      totalEarned: earnedBadges.length,
    }
  } catch {
    return null
  }
}

function formatAdvice(text) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (trimmed === '') return <br key={i} />

    const boldOnly = trimmed.match(/^\*\*(.+)\*\*$/)
    if (boldOnly) {
      return (
        <h3 key={i} style={{ fontWeight: '800', fontSize: '16px', color: '#2c3e50', margin: '20px 0 6px' }}>
          {boldOnly[1]}
        </h3>
      )
    }

    const inlineBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return (
      <p
        key={i}
        style={{ fontSize: '14px', lineHeight: '1.7', color: '#2c3e50', margin: '4px 0' }}
        dangerouslySetInnerHTML={{ __html: inlineBold }}
      />
    )
  })
}

export default function Advisor() {
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState(null)
  const [error, setError] = useState(null)
  const [interests, setInterests] = useState('')
  const [timeAvailable, setTimeAvailable] = useState('a few hours a week')

  const data = loadScoutData()

  const getAdvice = async () => {
    setLoading(true)
    setError(null)
    setAdvice(null)

    const prompt = `You are a helpful Boy Scout advisor. Here is a Scout's current progress:

Current rank working toward: ${data.rank || 'Not set'}
Requirements completed for ${data.rank}: ${data.completedReqs.length} out of ${data.completedReqs.length + data.incompleteReqs.length}
Incomplete requirements for ${data.rank}: ${data.incompleteReqs.join(', ') || 'None'}
Merit badges earned: ${data.totalEarned} total
Badges in progress: ${data.inProgressBadges.join(', ') || 'None'}
Scout's interests: ${interests || 'Not specified'}
Available time: ${timeAvailable}

Based on this, give the Scout 3-5 specific, actionable next steps. For each step, include:
1. Exactly what to do
2. How long it will take
3. What they need (materials, people, location)
4. Why it is a good next step right now

Format each recommendation with a bold title on its own line. Be specific and practical. Keep it friendly and direct.`

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        setError('Server error. Make sure your API key is set in Vercel and redeploy.')
        setLoading(false)
        return
      }

      const result = await response.json()
      const text = result.content?.find(b => b.type === 'text')?.text

      if (text) {
        setAdvice(text)
      } else {
        setError('No response received. Try again.')
      }
    } catch {
      setError('Something went wrong. Check your connection and try again.')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>AI Advisor</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Get personalized recommendations based on your current progress.
      </p>

      {!data?.rank && (
        <div style={{
          backgroundColor: '#fff8e1',
          border: '1.5px solid #f0c080',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#b7770d'
        }}>
          ⚠️ You haven't set your rank yet. Go to the Rank Tracker first and select the rank you are working toward.
        </div>
      )}

      {data?.rank && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '14px' }}>Your Current Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Working Toward', value: data.rank },
              { label: 'Requirements Done', value: `${data.completedReqs.length} / ${data.completedReqs.length + data.incompleteReqs.length}` },
              { label: 'Badges Earned', value: data.totalEarned },
              { label: 'Badges In Progress', value: data.inProgressBadges.length },
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#2c3e50' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginTop: '3px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: '700', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
          Your interests (optional)
        </label>
        <input
          type="text"
          placeholder="e.g. outdoors, engineering, cooking, technology..."
          value={interests}
          onChange={e => setInterests(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1.5px solid #ddd',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontWeight: '700', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
          Time available per week
        </label>
        <select
          value={timeAvailable}
          onChange={e => setTimeAvailable(e.target.value)}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1.5px solid #ddd',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <option>less than an hour a week</option>
          <option>a few hours a week</option>
          <option>several hours a week</option>
          <option>a lot of free time</option>
        </select>
      </div>

      <button
        onClick={getAdvice}
        disabled={loading || !data?.rank}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading || !data?.rank ? '#ccc' : '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: loading || !data?.rank ? 'not-allowed' : 'pointer',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '800',
          fontSize: '16px',
          marginBottom: '30px',
          transition: 'background-color 0.2s ease'
        }}
      >
        {loading ? '🤖 Analyzing your progress...' : '🤖 Get My Next Steps'}
      </button>

      {error && (
        <div style={{
          backgroundColor: '#fdecea',
          border: '1.5px solid #f5c6cb',
          borderRadius: '12px',
          padding: '16px',
          color: '#c0392b',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {error}
        </div>
      )}

      {advice && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1.5px solid #e8f5e9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1.5px solid #eee'
          }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <h2 style={{ fontWeight: '800', fontSize: '18px', margin: 0 }}>Your Next Steps</h2>
          </div>
          <div>{formatAdvice(advice)}</div>
          <button
            onClick={getAdvice}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#2c3e50',
              border: '2px solid #2c3e50',
              borderRadius: '20px',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '700',
              fontSize: '13px'
            }}
          >
            Refresh Advice
          </button>
        </div>
      )}
    </div>
  )
}