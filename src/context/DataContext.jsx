import { createContext, useContext, useState } from 'react'
import seed from '../data/dummyData.json'

const DataContext = createContext(null)

export function DataProvider({ children }) {
    const [posts, setPosts] = useState(seed.posts)
    const [followingIds, setFollowingIds] = useState(
        seed.users.filter((u) => u.isFollowing).map((u) => u.id)
    )

    const currentUser = seed.currentUser
    const users = seed.users

    const authorFor = (id) =>
        id === currentUser.id ? currentUser : users.find((u) => u.id === id)

    const addPost = (content) => {
        if (!content.trim()) return
        setPosts((prev) => [
            {
                id: Date.now(),
                authorId: currentUser.id,
                content: content.trim(),
                createdAt: new Date().toISOString(),
            },
            ...prev,
        ])
    }

    const toggleFollow = (id) =>
        setFollowingIds((ids) =>
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
        )

    return (
        <DataContext.Provider
            value={{ currentUser, users, posts, followingIds, authorFor, addPost, toggleFollow }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)