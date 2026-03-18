import { useState, useEffect } from 'react'

const ACTIVITY_TYPES = ['Campout', 'Hike', 'Service Project', 'Meeting', 'Other']

const emptyForm = {
  type: 'Campout',
  title: '',
  date: '',
  nights: '',
  miles: '',
  hours: '',
  description: '',
}

function loadLogs() {
  try { return JSON.parse(localStorage.getItem('sp_activity_logs') || '[]') } catch { return [] }
}

export default function ActivityLog() {
  const [logs, setLogs] = useState(loadLogs)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    localStorage.setItem('sp_activity_logs', JSON.stringify(logs))
  }, [logs])

  const totalNights = logs.reduce((sum, l) => sum + (parseFloat(l.nights) || 0), 0)
  const totalMiles = logs.reduce((sum, l) => sum + (parseFloat(l.miles) || 0), 0)
  const totalServiceHours = logs
    .filter(l => l.type === 'Service Project')
    .reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0)
  const totalCampouts = logs.filter(l => l.type === 'Campout').length

  const handleSubmit = () => {
    if (!form.title || !form.date) return
    if (editIndex !== null) {
      setLogs(prev => prev.map((l, i) => i === editIndex ? form : l))
      setEditIndex(null)
    } else {
      setLogs(prev => [form, ...prev])
    }
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleEdit = (index) => {
    setForm(logs[index])
    setEditIndex(index)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (index) => {
    setLogs(prev => prev.filter((_, i) => i !== index))
  }

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.type === filter)

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontWeight: '700',
    fontSize: '13px',
    color: '#666',
    display: 'block',
    marginBottom: '6px'
  }

  const typeColor = {
    Campout: '#2ecc71',
    Hike: '#3498db',
    'Service Project': '#9b59b6',
    Meeting: '#e67e22',
    Other: '#95a5a6'
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '780px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Activity Log</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Track your campouts, hikes, and service hours.
      </p>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {[
          { label: 'Campout Nights', value: totalNights, icon: '🌙', req: 'Required for Star, Life, Eagle' },
          { label: 'Total Campouts', value: totalCampouts, icon: '⛺', req: null },
          { label: 'Miles Hiked', value: totalMiles, icon: '🥾', req: null },
          { label: 'Service Hours', value: totalServiceHours, icon: '🤝', req: 'Required for all ranks' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#2c3e50' }}>{stat.value % 1 === 0 ? stat.value : stat.value.toFixed(1)}</div>            
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', marginTop: '2px' }}>{stat.label}</div>
            {stat.req && <div style={{ fontSize: '10px', color: '#bbb', marginTop: '4px' }}>{stat.req}</div>}
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setForm(emptyForm); setEditIndex(null) }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: '800',
            fontSize: '15px',
            marginBottom: '24px'
          }}
        >
          + Log Activity
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '20px' }}>
            {editIndex !== null ? 'Edit Activity' : 'Log New Activity'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Activity type</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ACTIVITY_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: '700',
                      fontSize: '13px',
                      backgroundColor: form.type === t ? typeColor[t] : '#eee',
                      color: form.type === t ? 'white' : '#666',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                placeholder="e.g. Summer Camp 2025, Philmont Trek..."
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                style={inputStyle}
              />
            </div>

            {form.type === 'Campout' && (
              <div>
                <label style={labelStyle}>Nights camping</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.nights}
                  onChange={e => setForm(prev => ({ ...prev, nights: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            )}

            {form.type === 'Hike' && (
              <div>
                <label style={labelStyle}>Miles hiked</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={form.miles}
                  onChange={e => setForm(prev => ({ ...prev, miles: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            )}

            {form.type === 'Service Project' && (
              <div>
                <label style={labelStyle}>Service hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={form.hours}
                  onChange={e => setForm(prev => ({ ...prev, hours: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                placeholder="What did you do? What did you learn?"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSubmit}
              disabled={!form.title || !form.date}
              style={{
                padding: '12px 24px',
                backgroundColor: !form.title || !form.date ? '#ccc' : '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: !form.title || !form.date ? 'not-allowed' : 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '800',
                fontSize: '14px'
              }}
            >
              {editIndex !== null ? 'Save Changes' : 'Save Activity'}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); setEditIndex(null) }}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#2c3e50',
                border: '2px solid #2c3e50',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '800',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {['All', ...ACTIVITY_TYPES].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '700',
              fontSize: '13px',
              backgroundColor: filter === t ? '#2c3e50' : '#eee',
              color: filter === t ? 'white' : '#666',
              transition: 'all 0.15s ease'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Log Entries */}
      {filteredLogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#bbb', fontWeight: '600' }}>
          No activities logged yet. Hit the button above to add one.
        </div>
      )}

      {filteredLogs.map((log, i) => {
        const realIndex = logs.indexOf(log)
        return (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${typeColor[log.type] || '#ccc'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    backgroundColor: typeColor[log.type],
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {log.type}
                  </span>
                  <span style={{ fontSize: '13px', color: '#999', fontWeight: '600' }}>{log.date}</span>
                </div>
                <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#2c3e50', margin: '0 0 6px' }}>
                  {log.title}
                </h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {log.nights && <span style={{ fontSize: '13px', color: '#666' }}>🌙 {log.nights} night{log.nights > 1 ? 's' : ''}</span>}
                  {log.miles && <span style={{ fontSize: '13px', color: '#666' }}>🥾 {log.miles} miles</span>}
                  {log.hours && <span style={{ fontSize: '13px', color: '#666' }}>🤝 {log.hours} hours</span>}
                </div>
                {log.description && (
                  <p style={{ fontSize: '13px', color: '#888', margin: '8px 0 0', lineHeight: '1.5' }}>
                    {log.description}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                <button
                  onClick={() => handleEdit(realIndex)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f0f4f8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: '700',
                    fontSize: '12px',
                    color: '#2c3e50'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(realIndex)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#fdecea',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: '700',
                    fontSize: '12px',
                    color: '#c0392b'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}