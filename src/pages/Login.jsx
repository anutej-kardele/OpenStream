import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Webhook } from 'lucide-react'

export default function Login() {
    const [handle, setHandle] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async () => {
        if (!handle.trim()) {
            setError('Enter a handle')
            return
        }

        setError('')
        setSubmitting(true)

        try {
            await login(handle.trim())
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
                <Webhook size={40} className="text-blue-500 mx-auto mb-3" strokeWidth={2} />
                <p className="text-xl font-medium text-white">OpenStream</p>
                <p className="text-sm text-zinc-500 mt-1">Sign in to continue</p>
            </div>

            <label className="text-xs text-zinc-500">Handle</label>
            <input
                value={handle}
                onChange={(e) => { setHandle(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="User Handle"
                className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-900 text-white
                   placeholder:text-zinc-600 outline-none border border-zinc-800"
            />

            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

            <button
                onClick={submit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-medium disabled:opacity-40"
            >
                {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-xs text-zinc-500 text-center mt-4">
                No password yet — sign in with any existing handle.
            </p>

            <button
                onClick={async () => {
                    setError('')
                    setHandle('sara')
                    setSubmitting(true)
                    try {
                        await login('sara')
                        navigate('/feed', { replace: true })
                    } catch (err) {
                        setError(err.message)
                    } finally {
                        setSubmitting(false)
                    }
                }}
                disabled={submitting}
                className="w-full mt-3 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm disabled:opacity-40"
            >
                Try the demo account
            </button>
        </div>
    )
}