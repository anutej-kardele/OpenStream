import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [handle, setHandle] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = () => {
        if (!login(handle, password)) {
            setError('Enter a handle and password')
            return
        }
        navigate('/feed', { replace: true })
    }

    return (
        <div className="flex-1 flex flex-col justify-center px-6">
            <div className="text-center mb-8">
                <p className="text-xl font-medium text-white">OpenStream</p>
                <p className="text-sm text-zinc-500 mt-1">Sign in to continue</p>
            </div>

            <label className="text-xs text-zinc-500">Handle</label>
            <input
                value={handle}
                onChange={(e) => { setHandle(e.target.value); setError('') }}
                placeholder="anutej"
                className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-900 text-white
                   placeholder:text-zinc-600 outline-none border border-zinc-800"
            />

            <label className="text-xs text-zinc-500">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-900 text-white
                   outline-none border border-zinc-800"
            />

            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

            <button
                onClick={submit}
                className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-medium"
            >
                Sign in
            </button>

            <p className="text-xs text-zinc-500 text-center mt-4">
                No account? <span className="text-blue-500">Create one</span>
            </p>
        </div>
    )
}