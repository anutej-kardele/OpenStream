import { useState } from 'react'
import { useData } from '../context/DataContext'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'

export default function Profile() {
    const [tab, setTab] = useState('posts')
    const { currentUser: user, posts } = useData()

    const myPosts = posts.filter((p) => p.authorId === user.id)

    return (
        <>
            <div className="px-4 pt-5 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">@{user.handle}</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-white shrink-0">
                        Edit
                    </button>
                </div>
                <div className="flex gap-5 text-sm">
                    <span className="text-white">
                        {user.following} <span className="text-zinc-500">following</span>
                    </span>
                    <span className="text-white">
                        {user.followers} <span className="text-zinc-500">followers</span>
                    </span>
                </div>
            </div>

            <div className="flex border-b border-zinc-800 text-sm">
                {['posts', 'likes'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-3 capitalize ${tab === t
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-zinc-500'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto">
                {tab === 'posts' ? (
                    myPosts.length === 0 ? (
                        <p className="text-sm text-zinc-500 px-4 py-6">No posts yet.</p>
                    ) : (
                        myPosts.map((p) => (
                            <PostCard key={p.id} author={user} content={p.content} timeAgo="now" />
                        ))
                    )
                ) : (
                    <p className="text-sm text-zinc-500 px-4 py-6">Likes are coming later.</p>
                )}
            </div>

            <BottomNav />
        </>
    )
}