import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Webhook } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getHealth } from '../api'

export default function Login() {
    const [handle, setHandle] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [serverStatus, setServerStatus] = useState('waking')

    const { login } = useAuth()
    const navigate = useNavigate()

    // Poll the API until it responds. On a cold start this can take
    // up to a minute while the container boots.
    useEffect(() => {
        let cancelled = false
        let attempts = 0

        const check = async () => {
            try {
                await getHealth()
                if (!cancelled) setServerStatus('ready')
            } catch {
                if (cancelled) return
                attempts += 1
                if (attempts >= 12) {
                    setServerStatus('unreachable')
                } else {
                    setTimeout(check, 5000)
                }
            }
        }

        check()
        return () => { cancelled = true }
    }, [])

    const signIn = async (value) => {
        if (!value.trim()) {
            setError('Enter a handle')
            return
        }

        setError('')
        setSubmitting(true)

        try {
            await login(value.trim())
            navigate('/feed', { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const tryDemo = () => {
        setHandle('sara')
        signIn('sara')
    }

    const statusDot = {
        waking: 'bg-amber-400',
        ready: 'bg-green-500',
        unreachable: 'bg-red-500',
    }[serverStatus]

    const statusText = {
        waking: 'Waking the server…',
        ready: 'Server ready',
        unreachable: 'Server unreachable',
    }[serverStatus]

    return (
        <div className="flex-1 flex flex-col justify-center px-6">
            <div className="text-center mb-8">
                <Webhook size={40} className="text-blue-500 mx-auto mb-3" strokeWidth={2} />
                <p className="text-xl font-medium text-white">OpenStream</p>
                <p className="text-sm text-zinc-500 mt-1">Sign in to continue</p>
            </div>

            <label htmlFor="handle" className="text-xs text-zinc-500">Handle</label>
            <input
                id="handle"
                name="handle"
                value={handle}
                onChange={(e) => { setHandle(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && signIn(handle)}
                placeholder="User Handle"
                className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-900 text-white
                   placeholder:text-zinc-600 outline-none border border-zinc-800"
            />

            {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

            <button
                onClick={() => signIn(handle)}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-medium disabled:opacity-40"
            >
                {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <button
                onClick={tryDemo}
                disabled={submitting}
                className="w-full mt-3 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm disabled:opacity-40"
            >
                Try the demo account
            </button>

            <p className="text-xs text-zinc-500 text-center mt-4">
                No account? <Link to="/signup" className="text-blue-500">Create one</Link>
            </p>

            <div className="mt-8 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${statusDot} ${serverStatus === 'waking' ? 'animate-pulse' : ''
                            }`}
                    />
                    <span className="text-xs text-zinc-500">{statusText}</span>
                </div>

                {serverStatus !== 'ready' && (
                    <p className="text-xs text-zinc-600 text-center mt-2 leading-relaxed">
                        The API runs on free hosting and sleeps when idle.
                        The first request can take up to a minute while it starts up.
                    </p>
                )}
            </div>
        </div>
    )
}