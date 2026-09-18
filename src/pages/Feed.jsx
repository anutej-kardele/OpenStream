import { useState } from 'react'
import PostCard from '../components/PostCard'
import BottomNav from '../components/BottomNav'
import { useData } from '../context/DataContext'

export default function Feed() {
    const [draft, setDraft] = useState('')
    const [posting, setPosting] = useState(false)
    const [postStatus, setPostStatus] = useState(null)

    const { posts, loading, error, addPost } = useData()

    const handlePost = async () => {
        if (!draft.trim() || posting) return

        setPostStatus(null)
        setPosting(true)

        try {
            const result = await addPost(draft)

            if (result.moderation === 'PASSED') {
                setPostStatus({
                    type: 'POSTED',
                    message: 'Post published successfully.'
                })
            }

            if (result.moderation === 'SKIPPED') {
                setPostStatus({
                    type: 'SKIPPED',
                    message: "Post published, but couldn't be checked by moderation."
                })
            }

            setDraft('')

        } catch (err) {
            if (err.status === 422) {
                setPostStatus({
                    type: 'FLAGGED',
                    message: 'Post flagged by moderation and was not published.'
                })
            } else {
                setPostStatus({
                    type: 'ERROR',
                    message: 'Something went wrong. Your post was not published.'
                })
            }
        } finally {
            setPosting(false)

            setTimeout(() => {
                setPostStatus(null)
            }, 5000)
        }
    }

    return (
        <>
            <header className="px-4 py-3 border-b border-zinc-800 font-medium text-white">
                Home
            </header>

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
                        <span className="text-xs text-zinc-600">
                            {draft.length} / 280
                        </span>

                        <button
                            onClick={handlePost}
                            disabled={!draft.trim() || posting}
                            className="text-sm px-4 py-1 rounded-full bg-blue-500 text-white disabled:opacity-40"
                        >
                            {posting ? 'Checking...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>

            {posting && (
                <div className="h-[2px] w-full overflow-hidden bg-zinc-800">
                    <div className="post-loading-bar h-full w-1/3 bg-blue-500" />
                </div>
            )}

            {postStatus && (
                <div
                    className={`px-4 py-2.5 border-b border-zinc-800 text-sm ${postStatus.type === 'POSTED'
                        ? 'text-emerald-400 bg-emerald-500/5'
                        : postStatus.type === 'FLAGGED'
                            ? 'text-rose-400 bg-rose-500/5'
                            : postStatus.type === 'SKIPPED'
                                ? 'text-amber-400 bg-amber-500/5'
                                : 'text-red-400 bg-red-500/5'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span>
                            {postStatus.type === 'POSTED' && '✓'}
                            {postStatus.type === 'FLAGGED' && '⚠'}
                            {postStatus.type === 'SKIPPED' && '⚠'}
                            {postStatus.type === 'ERROR' && '!'}
                        </span>

                        <span>{postStatus.message}</span>
                    </div>
                </div>
            )}

            {loading && (
                <p className="text-sm text-zinc-500 px-4 py-6">
                    Loading feed…
                </p>
            )}

            {error && (
                <p className="text-sm text-red-400 px-4 py-6">
                    {error}
                </p>
            )}

            {!loading && !error && posts.length === 0 && (
                <p className="text-sm text-zinc-500 px-4 py-6">
                    No posts yet.
                </p>
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