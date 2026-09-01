import { NavLink } from 'react-router-dom'
import { Home, Search, User } from 'lucide-react'

const items = [
    { to: '/feed', Icon: Home },
    { to: '/search', Icon: Search },
    { to: '/profile', Icon: User },
]

export default function BottomNav() {
    return (
        <nav
            className="flex justify-around border-t border-zinc-800 py-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
            {items.map(({ to, Icon }) => (
                <NavLink key={to} to={to}>
                    {({ isActive }) => (
                        <Icon size={24} className={isActive ? 'text-blue-500' : 'text-zinc-600'} />
                    )}
                </NavLink>
            ))}
        </nav>
    )
}