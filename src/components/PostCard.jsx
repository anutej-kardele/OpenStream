function timeAgo(iso) {
    const mins = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.floor(hrs / 24)}d`
}

export default function PostCard({ post }) {
    return (
        <article className="flex gap-3 px-4 py-3 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                    <span className="font-medium">{post.authorUsername}</span>{' '}
                    <span className="text-zinc-500">@{post.authorHandle}</span>
                </p>
                <p className="text-sm mt-1 leading-relaxed text-zinc-100">{post.content}</p>
            </div>
        </article>
    )
}