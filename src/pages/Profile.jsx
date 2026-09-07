import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { getFollowCounts } from '../api'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'

export default function Profile() {
    const { user, logout } = useAuth()
    const { posts } = useData()

    const [counts, setCounts] = useState({ following: 0, followers: 0 })
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        getFollowCounts(user.id)
            .then((data) => {
                if (!cancelled) setCounts(data)
            })
            .catch((err) => {
                if (!cancelled) setError(err.message)
            })

        return () => {
            cancelled = true
        }
    }, [user.id])

    const myPosts = posts.filter((p) => p.authorHandle === user.handle)

    return (
        <>
            <div className="px-4 pt-5 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{user.username}</p>
                        <p className="text-xs text-zinc-500 truncate">@{user.handle}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-white shrink-0"
                    >
                        Sign out
                    </button>
                </div>

                <div className="flex gap-5 text-sm">
                    <span className="text-white">
                        {counts.following} <span className="text-zinc-500">following</span>
                    </span>
                    <span className="text-white">
                        {counts.followers} <span className="text-zinc-500">followers</span>
                    </span>
                </div>

                {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            </div>

            <div className="flex border-b border-zinc-800 text-sm">
                <div className="flex-1 text-center py-3 text-blue-500 border-b-2 border-blue-500">
                    Posts
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {myPosts.length === 0 ? (
                    <p className="text-sm text-zinc-500 px-4 py-6">You haven't posted yet.</p>
                ) : (
                    myPosts.map((p) => <PostCard key={p.id} post={p} />)
                )}
            </div>

            <BottomNav />
        </>
    )
}