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
    if (authError) {
      if (authError.message.toLowerCase().includes('email') && authError.message.toLowerCase().includes('confirm')) {
        setError('Please confirm your email first. Check your inbox for the confirmation link.')
      } else {
        setError(authError.message || 'Invalid email or password')
      }
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-bg">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 32, fontWeight: 700, color: '#3d2c35' }}>
              vida<span style={{ color: '#6b9e80' }}>.</span>
            </span>
          </Link>
          <p style={{ color: '#8a7a72', marginTop: 8, fontSize: 15 }}>Welcome back</p>
        </div>

        <div className="auth-card">
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#3d2c35', marginTop: 0, marginBottom: 24 }}>Sign in</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <div className="auth-error">{error}</div>
            )}
            <div>
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8a7a72', marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#6b9e80', fontWeight: 600, textDecoration: 'none' }}>Join free</Link>
        </p>
      </div>
    </div>
  )
}
