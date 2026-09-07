import { createContext, useContext, useState } from 'react'
import { getUserByHandle } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    const login = async (handle) => {
        const found = await getUserByHandle(handle)
        setUser(found)
        return found
    }

    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)