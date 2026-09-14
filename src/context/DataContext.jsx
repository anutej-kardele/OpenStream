import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getFeed, createPost, getFollowing, follow, unfollow } from '../api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
    const { user } = useAuth()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [followingIds, setFollowingIds] = useState([])
    const [pending, setPending] = useState([])

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

    const loadFollowing = async () => {
        if (!user) {
            setFollowingIds([])
            return
        }

        try {
            const list = await getFollowing(user.id)
            setFollowingIds(list.map((u) => u.id))
        } catch {
            // Non-critical: buttons fall back to showing "Follow"
        }
    }

    useEffect(() => {
        refresh()
        loadFollowing()
    }, [user])

    const addPost = async (content) => {
        const created = await createPost(user.id, content)
        setPosts((prev) => [created, ...prev])
    }

    const toggleFollow = async (targetId) => {
        const isFollowing = followingIds.includes(targetId)
        setPending((p) => [...p, targetId])

        try {
            if (isFollowing) {
                await unfollow(user.id, targetId)
                setFollowingIds((ids) => ids.filter((i) => i !== targetId))
            } else {
                await follow(user.id, targetId)
                setFollowingIds((ids) => [...ids, targetId])
            }
            await refresh()
        } finally {
            setPending((p) => p.filter((i) => i !== targetId))
        }
    }

    const isPending = (id) => pending.includes(id)
    const isFollowing = (id) => followingIds.includes(id)

    return (
        <DataContext.Provider
            value={{
                posts,
                loading,
                error,
                addPost,
                refresh,
                followingIds,
                isFollowing,
                isPending,
                toggleFollow,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)