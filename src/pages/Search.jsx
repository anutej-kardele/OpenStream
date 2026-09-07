import { useState } from 'react'
import { useData } from '../context/DataContext'
import UserRow from '../components/UserRow'
import BottomNav from '../components/BottomNav'

export default function Search() {
    const [query, setQuery] = useState('')
    const { users, followingIds, toggleFollow } = useData()

    const q = query.trim().toLowerCase()
    const results = q
        ? users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q)
        )
        : users

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
                {results.length === 0 ? (
                    <p className="text-sm text-zinc-500 px-4 py-6">No one matches “{query}”.</p>
                ) : (
                    results.map((u) => (
                        <UserRow
                            key={u.id}
                            user={u}
                            isFollowing={followingIds.includes(u.id)}
                            onToggleFollow={toggleFollow}
                        />
                    ))
                )}
            </div>

            <BottomNav />
        </>
    )
}