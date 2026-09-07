export default function UserRow({ user, isFollowing, onToggleFollow }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">
                    @{user.handle} · {user.followers} followers
                </p>
            </div>
            <button
                onClick={() => onToggleFollow(user.id)}
                className={`text-xs px-3 py-1.5 rounded-full border shrink-0 ${isFollowing
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-transparent text-white border-zinc-700'
                    }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    )
}