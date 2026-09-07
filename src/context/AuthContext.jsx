import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isAuthed, setIsAuthed] = useState(false)

    const login = (handle, password) => {
        if (!handle.trim() || !password.trim()) return false
        setIsAuthed(true)
        return true
    }

    const logout = () => setIsAuthed(false)

    return (
        <AuthContext.Provider value={{ isAuthed, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)