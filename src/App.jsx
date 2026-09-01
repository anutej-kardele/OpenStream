import { Routes, Route, Navigate } from 'react-router-dom'
import PhoneShell from './components/PhoneShell'
import Feed from './pages/Feed'

const Stub = ({ name }) => <div className="p-4">{name} — coming next</div>

export default function App() {
  return (
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<Stub name="Search" />} />
        <Route path="/profile" element={<Stub name="Profile" />} />
        <Route path="/login" element={<Stub name="Login" />} />
      </Routes>
    </PhoneShell>
  )
}