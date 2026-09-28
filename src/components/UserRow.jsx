import Avatar from './Avatar'

export default function UserRow({ user, isFollowing, disabled, onToggleFollow }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Avatar
                username={user.username}
                handle={user.handle}
            />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <p className="text-xs text-zinc-500 truncate">@{user.handle}</p>
            </div>

            <button
                onClick={() => onToggleFollow(user.id)}
                disabled={disabled}
                className={`text-xs px-3 py-1.5 rounded-full border shrink-0 disabled:opacity-40 ${isFollowing
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-transparent text-white border-zinc-700'
                    }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    )
}