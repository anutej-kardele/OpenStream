import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import RequireAuth from './components/RequireAuth'
import PhoneShell from './components/PhoneShell'
import Login from './pages/Login'
import Feed from './pages/Feed'
import SearchPage from './pages/Search'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PhoneShell>
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<RequireAuth><Feed /></RequireAuth>} />
            <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          </Routes>
        </PhoneShell>
      </DataProvider>
    </AuthProvider>
  )
}