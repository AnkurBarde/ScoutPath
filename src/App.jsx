import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import RankTracker from './pages/RankTracker'
import BadgeManager from './pages/BadgeManager'
import Advisor from './pages/Advisor'
import EagleRoadmap from './pages/EagleRoadmap'
import ActivityLog from './pages/ActivityLog'
import LeaderTools from './pages/LeaderTools'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rank-tracker" element={<ProtectedRoute><RankTracker /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgeManager /></ProtectedRoute>} />
        <Route path="/advisor" element={<ProtectedRoute><Advisor /></ProtectedRoute>} />
        <Route path="/eagle" element={<ProtectedRoute><EagleRoadmap /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
        <Route path="/leader" element={<ProtectedRoute><LeaderTools /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App