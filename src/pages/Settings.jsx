import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [scoutName, setScoutName] = useState(() => localStorage.getItem('sp_scout_name') || '')
  const [troopNumber, setTroopNumber] = useState(() => localStorage.getItem('sp_troop') || '')
  const [theme, setTheme] = useState(() => localStorage.getItem('sp_theme') || 'light')
  const [saved, setSaved] = useState(false)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('sp_theme', theme)
  }, [theme])

  const saveSettings = () => {
    localStorage.setItem('sp_scout_name', scoutName)
    localStorage.setItem('sp_troop', troopNumber)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearAllData = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sp_'))
    keys.forEach(k => localStorage.removeItem(k))
    setShowConfirmClear(false)
    navigate('/')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Settings</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Manage your account and preferences.</p>

      {/* Account Info */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '16px' }}>Account</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            />
          )}
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#2c3e50' }}>
              {user?.user_metadata?.full_name || user?.email}
            </div>
            <div style={{ fontSize: '13px', color: '#999' }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#c0392b',
            border: '2px solid #c0392b',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Profile */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '16px' }}>Profile</h2>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            Scout name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={scoutName}
            onChange={e => setScoutName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '700', fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            Troop number
          </label>
          <input
            type="text"
            placeholder="e.g. Troop 566"
            value={troopNumber}
            onChange={e => setTroopNumber(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button
          onClick={saveSettings}
          style={{
            padding: '10px 24px',
            backgroundColor: saved ? '#2ecc71' : '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'background-color 0.2s ease'
          }}
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Theme */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '16px' }}>Theme</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: '10px 24px',
                backgroundColor: theme === t ? '#2c3e50' : 'white',
                color: theme === t ? 'white' : '#2c3e50',
                border: '2px solid #2c3e50',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}
            >
              {t === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Data */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontWeight: '800', fontSize: '16px', marginBottom: '8px' }}>Reset Data</h2>
        <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          This clears all your progress, badges, and activity logs. This cannot be undone.
        </p>
        {!showConfirmClear ? (
          <button
            onClick={() => setShowConfirmClear(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#c0392b',
              border: '2px solid #c0392b',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            Clear All Data
          </button>
        ) : (
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#c0392b', marginBottom: '12px' }}>
              Are you sure? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={clearAllData}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#c0392b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                Yes, clear everything
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#2c3e50',
                  border: '2px solid #2c3e50',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}