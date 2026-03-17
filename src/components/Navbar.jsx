import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 20px',
      display: 'flex',
      gap: '20px'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/rank-tracker" style={{ color: 'white', textDecoration: 'none' }}>Rank Tracker</Link>
    </nav>
  )
}

export default Navbar