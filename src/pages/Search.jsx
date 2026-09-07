import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { searchUsers, follow, unfollow, getFollowing } from '../api'
import UserRow from '../components/UserRow'
import BottomNav from '../components/BottomNav'
import { useData } from '../context/DataContext'

export default function Search() {
    const { user } = useAuth()

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [followingIds, setFollowingIds] = useState([])
    const [pending, setPending] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { refresh } = useData()

    useEffect(() => {
        let cancelled = false

        getFollowing(user.id)
            .then((list) => {
                if (!cancelled) setFollowingIds(list.map((u) => u.id))
            })
            .catch(() => { })

        return () => {
            cancelled = true
        }
    }, [user.id])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setError(null)
            return
        }

        let cancelled = false

        const timer = setTimeout(async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await searchUsers(query.trim())
                if (!cancelled) setResults(data)
            } catch (err) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }, 300)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [query])

    const toggleFollow = async (targetId) => {
        const isFollowing = followingIds.includes(targetId)
        setPending((p) => [...p, targetId])

        try {
            if (isFollowing) {
                await unfollow(user.id, targetId)
                setFollowingIds((ids) => ids.filter((i) => i !== targetId))
                await refresh()
            } else {
                await follow(user.id, targetId)
                setFollowingIds((ids) => [...ids, targetId])
                await refresh()
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setPending((p) => p.filter((i) => i !== targetId))
        }
    }

    const visible = results.filter((u) => u.id !== user.id)

    return (
        <>
            <div className="px-4 py-3 border-b border-zinc-800">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people"
                    className="w-full text-sm px-3 py-2 rounded-full bg-zinc-900 text-white
                     placeholder:text-zinc-500 outline-none border border-zinc-800"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                <p className="text-xs text-zinc-500 px-4 pt-3 pb-1">People</p>

                {loading && <p className="text-sm text-zinc-500 px-4 py-6">Searching…</p>}

                {error && <p className="text-sm text-red-400 px-4 py-6">{error}</p>}

                {!loading && !error && !query.trim() && (
                    <p className="text-sm text-zinc-500 px-4 py-6">
                        Search for someone by name or handle.
                    </p>
                )}

                {!loading && !error && query.trim() && visible.length === 0 && (
                    <p className="text-sm text-zinc-500 px-4 py-6">No one matches “{query}”.</p>
                )}

                {visible.map((u) => (
                    <UserRow
                        key={u.id}
                        user={u}
                        isFollowing={followingIds.includes(u.id)}
                        disabled={pending.includes(u.id)}
                        onToggleFollow={toggleFollow}
                    />
                ))}
            </div>

            <BottomNav />
        </>
    )
}