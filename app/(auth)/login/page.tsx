'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { loginSchema } from '@/lib/validations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) { setError(parsed.error.issues[0].message); return }
    setLoading(true)
    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data)
    setLoading(false)
    if (authError) { setError('Invalid email or password'); return }
    router.push('/dashboard')
  }

  return (
    <div className="auth-bg">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 34, fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.02em' }}>
            vida<span style={{ color: '#6b9e80' }}>.</span>
          </Link>
          <p style={{ color: '#a09098', marginTop: 8, fontSize: 15 }}>Welcome back</p>
        </div>

        <div className="auth-card">
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', marginBottom: 28, letterSpacing: '-0.01em' }}>Sign in</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div className="auth-error">{error}</div>}

            <div>
              <label className="auth-label" htmlFor="email">Email</label>
              <input id="email" className="auth-input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="auth-label" htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" autoComplete="current-password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#a09098', marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#6b9e80', fontWeight: 600 }}>Join free</Link>
        </p>
      </div>
    </div>
  )
}
