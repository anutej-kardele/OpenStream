import { useState } from 'react'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'
import { useData } from '../context/DataContext'

export default function Feed() {
    const [draft, setDraft] = useState('')
    const [posting, setPosting] = useState(false)
    const [postError, setPostError] = useState('')
    const { posts, loading, error, addPost } = useData()

    const handlePost = async () => {
        setPostError('')
        setPosting(true)
        try {
            await addPost(draft)
            setDraft('')
        } catch (err) {
            setPostError(err.message)
        } finally {
            setPosting(false)
        }
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
                            disabled={!draft.trim() || posting}
                            className="text-sm px-4 py-1 rounded-full bg-blue-500 text-white disabled:opacity-40"
                        >
                            Post
                        </button>
                    </div>

                    {postError && <p className="text-xs text-red-400 mt-1">{postError}</p>}
                </div>
            </div>

            {loading && <p className="text-sm text-zinc-500 px-4 py-6">Loading feed…</p>}
            {error && <p className="text-sm text-red-400 px-4 py-6">{error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p className="text-sm text-zinc-500 px-4 py-6">No posts yet.</p>
            )}

            <div className="flex-1 overflow-y-auto">
                {posts.map((p) => (
                    <PostCard key={p.id} post={p} />
                ))}
            </div>

            <BottomNav />
        </>
    )
}