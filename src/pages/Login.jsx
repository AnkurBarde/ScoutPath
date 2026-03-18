import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleGoogle = async () => {
    setError(null)
    await signInWithGoogle()
  }

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = mode === 'login'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password)

    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setMessage('Check your email to confirm your account.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '12px'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚜️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2c3e50', marginBottom: '6px' }}>
            ScoutPath
          </h1>
          <p style={{ color: '#999', fontSize: '14px' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'white',
            border: '1.5px solid #ddd',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: '700',
            fontSize: '14px',
            color: '#2c3e50',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
          Continue with Google
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }} />
          <span style={{ color: '#999', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }} />
        </div>

        {/* Email/Password */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={inputStyle}
        />

        {error && (
          <div style={{
            backgroundColor: '#fdecea',
            border: '1.5px solid #f5c6cb',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#c0392b',
            marginBottom: '12px'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: '#eafaf1',
            border: '1.5px solid #2ecc71',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#27ae60',
            marginBottom: '12px'
          }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: loading || !email || !password ? '#ccc' : '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: '800',
            fontSize: '15px',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#999' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setMessage(null) }}
            style={{ color: '#2c3e50', fontWeight: '700', cursor: 'pointer' }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}