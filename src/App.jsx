import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RankTracker from './pages/RankTracker'
import BadgeManager from './pages/BadgeManager'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rank-tracker" element={<RankTracker />} />
        <Route path="/badges" element={<BadgeManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App