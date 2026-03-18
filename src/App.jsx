import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RankTracker from './pages/RankTracker'
import BadgeManager from './pages/BadgeManager'
import Advisor from './pages/Advisor'
import EagleRoadmap from './pages/EagleRoadmap'
import ActivityLog from './pages/ActivityLog'
import LeaderTools from './pages/LeaderTools'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rank-tracker" element={<RankTracker />} />
        <Route path="/badges" element={<BadgeManager />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/eagle" element={<EagleRoadmap />} />
        <Route path="/log" element={<ActivityLog />} />
        <Route path="/leader" element={<LeaderTools />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App