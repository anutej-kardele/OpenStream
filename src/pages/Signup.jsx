import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Webhook } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createUser } from '../api'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [handle, setHandle] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async () => {
        if (!username.trim()) {
            setError('Enter a display name')
            return
        }
        if (!handle.trim()) {
            setError('Choose a handle')
            return
        }

        setError('')
        setSubmitting(true)

        try {
            const created = await createUser(username.trim(), handle.trim())
            await login(created.handle)
            navigate('/feed', { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col justify-center px-6">
            <div className="text-center mb-8">
                <Webhook size={40} className="text-blue-500 mx-auto mb-3" />
                <p className="text-xl font-medium text-white">Create your account</p>
                <p className="text-sm text-zinc-500 mt-1">Pick a name and a handle</p>
            </div>

            <label className="text-xs text-zinc-500">Display name</label>
            <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                placeholder="Ada Lovelace"
                className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-900 text-white
                   placeholder:text-zinc-600 outline-none border border-zinc-800"
            />

            <label className="text-xs text-zinc-500">Handle</label>
            <div className="flex items-center mt-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3">
                <span className="text-zinc-600 text-sm">@</span>
                <input
                    value={handle}
                    onChange={(e) => { setHandle(e.target.value); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="ada"
                    maxLength={20}
                    className="flex-1 py-2 pl-1 bg-transparent text-white
                       placeholder:text-zinc-600 outline-none"
                />
            </div>
            <p className="text-xs text-zinc-600 mt-1 mb-4">
                3–20 characters. Letters, numbers and underscores.
            </p>

            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

            <button
                onClick={submit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-medium disabled:opacity-40"
            >
                {submitting ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-xs text-zinc-500 text-center mt-4">
                Already here? <Link to="/login" className="text-blue-500">Sign in</Link>
            </p>
        </div>
    )
}