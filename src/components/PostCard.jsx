import { MessageCircle, Repeat2, Heart } from 'lucide-react'

export default function PostCard({ author, content, timeAgo }) {
    return (
        <article className="flex gap-3 px-4 py-3 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
            <div className="flex-1">
                <p className="text-sm text-white">
                    <span className="font-medium">{author.name}</span>{' '}
                    <span className="text-zinc-500">@{author.handle} · {timeAgo}</span>
                </p>
                <p className="text-sm mt-1 mb-2 leading-relaxed text-zinc-100">{content}</p>
                <div className="flex gap-6 text-zinc-500">
                    <MessageCircle size={16} />
                    <Repeat2 size={16} />
                    <Heart size={16} />
                </div>
            </div>
        </article>
    )
}