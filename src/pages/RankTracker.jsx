import { useState } from 'react'

const ranks = ['Scout', 'Tenderfoot', 'Second Class', 'First Class', 'Star', 'Life', 'Eagle']

function RankTracker() {
  const [currentRank, setCurrentRank] = useState(null)

  const rankIndex = ranks.indexOf(currentRank)
  const progress = currentRank ? Math.round((rankIndex / (ranks.length - 1)) * 100) : 0

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Rank Tracker</h1>
      <p>Select your current rank:</p>
      {ranks.map(rank => (
        <button
          key={rank}
          onClick={() => setCurrentRank(rank)}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: currentRank === rank ? '#2ecc71' : '#eee',
            color: currentRank === rank ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {rank}
        </button>
      ))}

      {currentRank && (
        <div style={{ marginTop: '30px' }}>
          <p>Progress to Eagle: <strong>{progress}%</strong></p>
          <div style={{ backgroundColor: '#eee', borderRadius: '10px', height: '20px' }}>
            <div style={{
              width: `${progress}%`,
              backgroundColor: '#2ecc71',
              height: '20px',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RankTracker