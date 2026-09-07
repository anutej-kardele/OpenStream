import { useState } from 'react'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'
import { useData } from '../context/DataContext'

export default function Feed() {
    const [draft, setDraft] = useState('')
    const { posts, authorFor, addPost } = useData()

    const handlePost = () => {
        addPost(draft)
        setDraft('')
    }

    return (
        <>
            <header className="px-4 py-3 border-b border-zinc-800 font-medium text-white">Home</header>

            <div className="flex gap-3 px-4 py-3 border-b border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1">
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        maxLength={280}
                        placeholder="What's happening?"
                        className="w-full text-sm resize-none outline-none bg-transparent text-white placeholder:text-zinc-500"
                        rows={2}
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-600">{draft.length} / 280</span>
                        <button
                            onClick={handlePost}
                            disabled={!draft.trim()}
                            className="text-sm px-4 py-1 rounded-full bg-blue-500 text-white disabled:opacity-40"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {posts.map((p) => (
                    <PostCard key={p.id} author={authorFor(p.authorId)} content={p.content} timeAgo="now" />
                ))}
            </div>

            <BottomNav />
        </>
    )
}