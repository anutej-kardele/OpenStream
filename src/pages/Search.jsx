import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { searchUsers, getSuggestions } from '../api'
import UserRow from '../components/UserRow'
import BottomNav from '../components/BottomNav'

export default function Search() {
    const { user } = useAuth()
    const { isFollowing, isPending, toggleFollow } = useData()

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Load suggestions once when the screen opens
    useEffect(() => {
        let cancelled = false

        getSuggestions(user.id)
            .then((data) => {
                if (!cancelled) setSuggestions(data)
            })
            .catch(() => {
                // Non-critical: the search box still works
            })

        return () => { cancelled = true }
    }, [user.id])

    // Debounced search whenever the query changes
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

    const searching = query.trim().length > 0
    const showing = (searching ? results : suggestions).filter((u) => u.id !== user.id)

    return (
        <>
            <div className="px-4 py-3 border-b border-zinc-800">
                <input
                    id="search"
                    name="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people"
                    className="w-full text-sm px-3 py-2 rounded-full bg-zinc-900 text-white
                     placeholder:text-zinc-500 outline-none border border-zinc-800"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                <p className="text-xs text-zinc-500 px-4 pt-3 pb-1">
                    {searching ? 'People' : 'Suggested for you'}
                </p>

                {loading && <p className="text-sm text-zinc-500 px-4 py-6">Searching…</p>}

                {error && <p className="text-sm text-red-400 px-4 py-6">{error}</p>}

                {!loading && !error && showing.length === 0 && (
                    <p className="text-sm text-zinc-500 px-4 py-6">
                        {searching
                            ? `No one matches “${query}”.`
                            : "You're following everyone here already."}
                    </p>
                )}

                {showing.map((u) => (
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