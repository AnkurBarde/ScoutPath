import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 20px',
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/rank-tracker" style={{ color: 'white', textDecoration: 'none' }}>Rank Tracker</Link>
      <Link to="/badges" style={{ color: 'white', textDecoration: 'none' }}>Merit Badges</Link>
      <Link to="/advisor" style={{ color: 'white', textDecoration: 'none' }}>AI Advisor</Link>
      <Link to="/eagle" style={{ color: 'white', textDecoration: 'none' }}>Eagle Roadmap</Link>
      <Link to="/log" style={{ color: 'white', textDecoration: 'none' }}>Activity Log</Link>
      <Link to="/leader" style={{ color: 'white', textDecoration: 'none' }}>Leader Tools</Link>
      <Link to="/settings" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto' }}>⚙️ Settings</Link>
    </nav>
  )
}

export default Navbar