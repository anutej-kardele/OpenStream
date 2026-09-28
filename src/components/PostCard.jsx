import Avatar from './Avatar'

function formatPostTime(iso) {
    if (!iso) return ''

    const date = new Date(iso)
    const now = new Date()

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'now'

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`

    const sameYear = date.getFullYear() === now.getFullYear()

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        ...(sameYear ? {} : { year: 'numeric' })
    })
}

export default function PostCard({ post }) {
    return (
        <article className="flex gap-3 px-4 py-3 border-b border-zinc-800">
            <Avatar
                username={post.authorUsername}
                handle={post.authorHandle}
                size="sm"
            />

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 text-sm">
                    <div className="min-w-0 truncate">
                        <span className="font-medium text-white">
                            {post.authorUsername}
                        </span>{' '}

                        <span className="text-zinc-500">
                            @{post.authorHandle}
                        </span>
                    </div>

                    <span
                        className="ml-auto shrink-0 text-zinc-500"
                        title={
                            post.createdAt
                                ? new Date(post.createdAt).toLocaleString()
                                : ''
                        }
                    >
                        {formatPostTime(post.createdAt)}
                    </span>
                </div>

                <p className="text-sm mt-1 leading-relaxed text-zinc-100">
                    {post.content}
                </p>
            </div>
        </article>
    )
}