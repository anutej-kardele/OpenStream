import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getFeed, createPost } from '../api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
    const { user } = useAuth()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const refresh = async () => {
        if (!user) {
            setPosts([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            const data = await getFeed(user.id)
            setPosts(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [user])

    const addPost = async (content) => {
        const created = await createPost(user.id, content)
        setPosts((prev) => [created, ...prev])
    }

    return (
        <DataContext.Provider value={{ posts, loading, error, addPost, refresh }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)