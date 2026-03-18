import { useState } from 'react'
import jsPDF from 'jspdf'

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

const EAGLE_REQUIRED_BADGES = [
  'First Aid', 'Citizenship in the Community', 'Citizenship in the Nation',
  'Citizenship in the World', 'Communication', 'Cooking', 'Personal Fitness',
  'Personal Management', 'Camping', 'Family Life', 'Emergency Preparedness',
  'Lifesaving', 'Environmental Science', 'Sustainability', 'Swimming', 'Hiking', 'Cycling'
]

function loadAllData() {
  try {
    const rank = localStorage.getItem('sp_rank') || 'Not set'
    const completed = JSON.parse(localStorage.getItem('sp_completed') || '{}')
    const badgeStatus = JSON.parse(localStorage.getItem('sp_badge_status') || '{}')
    const logs = JSON.parse(localStorage.getItem('sp_activity_logs') || '[]')
    const project = JSON.parse(localStorage.getItem('sp_project') || '{}')
    const notes = JSON.parse(localStorage.getItem('sp_notes') || '{}')

    const rankIndex = ranks.indexOf(rank)
    const currentReqs = rank !== 'Not set' ? requirementNames[rank] || [] : []
    const completedReqs = currentReqs.filter(id => completed[id + rank])
    const incompleteReqs = currentReqs.filter(id => !completed[id + rank])

    const earnedBadges = Object.entries(badgeStatus)
      .filter(([, s]) => s === 'earned').map(([n]) => n)
    const inProgressBadges = Object.entries(badgeStatus)
      .filter(([, s]) => s === 'in-progress').map(([n]) => n)
    const earnedEagle = earnedBadges.filter(b => EAGLE_REQUIRED_BADGES.includes(b))

    const totalNights = logs.reduce((sum, l) => sum + (parseFloat(l.nights) || 0), 0)
    const totalMiles = logs.reduce((sum, l) => sum + (parseFloat(l.miles) || 0), 0)
    const totalServiceHours = logs
      .filter(l => l.type === 'Service Project')
      .reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0)

    return {
      rank, rankIndex, completedReqs, incompleteReqs,
      earnedBadges, inProgressBadges, earnedEagle,
      logs, project, notes,
      totalNights, totalMiles, totalServiceHours
    }
  } catch {
    return null
  }
}

export default function LeaderTools() {
  const [scoutName, setScoutName] = useState(() => localStorage.getItem('sp_scout_name') || '')
  const [troopNumber, setTroopNumber] = useState(() => localStorage.getItem('sp_troop') || '')
  const [generated, setGenerated] = useState(false)

  const data = loadAllData()

  const saveInfo = () => {
    localStorage.setItem('sp_scout_name', scoutName)
    localStorage.setItem('sp_troop', troopNumber)
  }

  const generatePDF = () => {
    saveInfo()
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    const addLine = (text, size = 11, bold = false, color = [44, 62, 80]) => {
      doc.setFontSize(size)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setTextColor(...color)
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(text, 20, y)
      y += size * 0.6
    }

    const addDivider = () => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setDrawColor(220, 220, 220)
      doc.line(20, y, pageWidth - 20, y)
      y += 6
    }

    const addSection = (title) => {
      y += 4
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFillColor(44, 62, 80)
      doc.rect(20, y - 5, pageWidth - 40, 10, 'F')
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(title, 24, y + 2)
      y += 12
    }

    // Header
    doc.setFillColor(44, 62, 80)
    doc.rect(0, 0, pageWidth, 30, 'F')
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('ScoutPath — Progress Report', 20, 20)
    y = 40

    // Scout Info
    addLine(`Scout: ${scoutName || 'Not provided'}`, 12, true)
    y += 2
    addLine(`Troop: ${troopNumber || 'Not provided'}`, 11)
    addLine(`Generated: ${new Date().toLocaleDateString()}`, 11)
    addLine(`Current Rank Working Toward: ${data.rank}`, 11)
    y += 4
    addDivider()

    // Rank Progress
    addSection('Rank Progress')
    addLine(`Current rank: ${data.rank}`, 11, true)
    addLine(`Requirements completed: ${data.completedReqs.length} / ${data.completedReqs.length + data.incompleteReqs.length}`, 11)
    y += 2
    if (data.completedReqs.length > 0) {
      addLine('Completed requirements:', 11, true)
      y += 2
      addLine(data.completedReqs.join(', '), 10, false, [100, 100, 100])
    }
    if (data.incompleteReqs.length > 0) {
      y += 2
      addLine('Remaining requirements:', 11, true)
      y += 2
      addLine(data.incompleteReqs.join(', '), 10, false, [100, 100, 100])
    }
    y += 4
    addDivider()

    // Merit Badges
    addSection('Merit Badges')
    addLine(`Total badges earned: ${data.earnedBadges.length}`, 11, true)
    addLine(`Eagle-required badges earned: ${data.earnedEagle.length} / 13`, 11)
    addLine(`Badges in progress: ${data.inProgressBadges.length}`, 11)
    y += 2
    if (data.earnedBadges.length > 0) {
      addLine('Earned badges:', 11, true)
      y += 2
      const chunks = []
      let chunk = ''
      data.earnedBadges.forEach((b, i) => {
        chunk += b + (i < data.earnedBadges.length - 1 ? ', ' : '')
        if (chunk.length > 80) { chunks.push(chunk); chunk = '' }
      })
      if (chunk) chunks.push(chunk)
      chunks.forEach(c => addLine(c, 10, false, [100, 100, 100]))
    }
    if (data.inProgressBadges.length > 0) {
      y += 2
      addLine('In progress:', 11, true)
      y += 2
      addLine(data.inProgressBadges.join(', '), 10, false, [100, 100, 100])
    }
    y += 4
    addDivider()

    // Activity Log
    addSection('Activity Summary')
    addLine(`Camping nights: ${data.totalNights}`, 11)
    addLine(`Miles hiked: ${data.totalMiles}`, 11)
    addLine(`Service hours: ${data.totalServiceHours}`, 11)
    addLine(`Total activities logged: ${data.logs.length}`, 11)
    y += 2
    if (data.logs.length > 0) {
      addLine('Recent activities:', 11, true)
      y += 2
      data.logs.slice(0, 10).forEach(log => {
        const detail = [
          log.type,
          log.date,
          log.nights ? `${log.nights} nights` : '',
          log.miles ? `${log.miles} mi` : '',
          log.hours ? `${log.hours} hrs` : ''
        ].filter(Boolean).join(' — ')
        addLine(`• ${log.title} (${detail})`, 10, false, [80, 80, 80])
        y += 1
      })
    }
    y += 4
    addDivider()

    // Eagle Project
    if (data.project?.idea || data.project?.status) {
      addSection('Eagle Project')
      if (data.project.idea) addLine(`Project idea: ${data.project.idea}`, 11)
      if (data.project.organization) addLine(`Benefiting organization: ${data.project.organization}`, 11)
      if (data.project.hours) addLine(`Estimated hours: ${data.project.hours}`, 11)
      if (data.project.status) addLine(`Status: ${data.project.status}`, 11)
      y += 4
      addDivider()
    }

    // Signature lines
    y += 6
    addLine('Scoutmaster Signature: ________________________________', 11)
    y += 10
    addLine('Date: ________________________________', 11)
    y += 10
    addLine('Scout Signature: ________________________________', 11)

    doc.save(`ScoutPath_Progress_${scoutName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`)
    setGenerated(true)
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Leader Tools</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Generate a PDF of your progress to share with your Scoutmaster.
      </p>

      {/* Scout Info */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '16px' }}>Your Info</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
              Scout name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={scoutName}
              onChange={e => setScoutName(e.target.value)}
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
          <div>
            <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
              Troop number
            </label>
            <input
              type="text"
              placeholder="e.g. Troop 42"
              value={troopNumber}
              onChange={e => setTroopNumber(e.target.value)}
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
        </div>
      </div>

      {/* Progress Preview */}
      {data && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '16px' }}>What gets included</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Current Rank', value: data.rank },
              { label: 'Reqs Completed', value: `${data.completedReqs.length} / ${data.completedReqs.length + data.incompleteReqs.length}` },
              { label: 'Badges Earned', value: data.earnedBadges.length },
              { label: 'Eagle Badges', value: `${data.earnedEagle.length} / 13` },
              { label: 'Camping Nights', value: data.totalNights },
              { label: 'Service Hours', value: data.totalServiceHours },
              { label: 'Activities Logged', value: data.logs.length },
              { label: 'Project Status', value: data.project?.status || 'Not started' },
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#2c3e50' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginTop: '3px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generatePDF}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '800',
          fontSize: '16px',
          marginBottom: '12px',
          transition: 'background-color 0.2s ease'
        }}
      >
        📄 Download Progress Report PDF
      </button>

      {generated && (
        <div style={{
          backgroundColor: '#eafaf1',
          border: '1.5px solid #2ecc71',
          borderRadius: '12px',
          padding: '14px 16px',
          fontSize: '14px',
          fontWeight: '700',
          color: '#27ae60',
          textAlign: 'center'
        }}>
          ✓ PDF downloaded — hand it to your Scoutmaster for review.
        </div>
      )}
    </div>
  )
}