import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { getFollowing, getFollowers } from '../api'
import UserRow from '../components/UserRow'
import BottomNav from '../components/BottomNav'

export default function FollowList({ mode }) {
    const { user } = useAuth()
    const { isFollowing, isPending, toggleFollow } = useData()
    const navigate = useNavigate()

    const [people, setPeople] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const title = mode === 'following' ? 'Following' : 'Followers'

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                setLoading(true)
                setError(null)
                const fetcher = mode === 'following' ? getFollowing : getFollowers
                const data = await fetcher(user.id)
                if (!cancelled) setPeople(data)
            } catch (err) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [user.id, mode])

    const emptyMessage =
        mode === 'following'
            ? "You aren't following anyone yet."
            : "Nobody follows you yet."

    return (
        <>
            <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="text-zinc-400 shrink-0">
                    <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                    <p className="font-medium text-white leading-tight">{title}</p>
                    <p className="text-xs text-zinc-500 truncate">@{user.handle}</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                {loading && <p className="text-sm text-zinc-500 px-4 py-6">Loading…</p>}

                {error && <p className="text-sm text-red-400 px-4 py-6">{error}</p>}

                {!loading && !error && people.length === 0 && (
                    <p className="text-sm text-zinc-500 px-4 py-6">{emptyMessage}</p>
                )}

                {people
                    .filter((u) => u.id !== user.id)
                    .map((u) => (
                        <UserRow
                            key={u.id}
                            user={u}
                            isFollowing={isFollowing(u.id)}
                            disabled={isPending(u.id)}
                            onToggleFollow={toggleFollow}
                        />
                    ))}
            </div>

            <BottomNav />
        </>
    )
}