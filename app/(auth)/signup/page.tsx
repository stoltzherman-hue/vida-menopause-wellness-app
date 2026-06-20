'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { signUpSchema } from '@/lib/validations'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = signUpSchema.safeParse({ email, password, displayName })
    if (!parsed.success) { setError(parsed.error.issues[0].message); return }
    setLoading(true)
    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { display_name: parsed.data.displayName } },
    })
    setLoading(false)
    if (authError) { setError(authError.message); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="auth-bg">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#3d2c35', marginBottom: 12 }}>Check your inbox</h2>
          <p style={{ color: '#8a7a72', fontSize: 15, lineHeight: 1.65 }}>
            We sent a confirmation link to <strong style={{ color: '#3d2c35' }}>{email}</strong>. Click it to activate your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-bg">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 34, fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.02em' }}>
            vida<span style={{ color: '#6b9e80' }}>.</span>
          </Link>
          <p style={{ color: '#a09098', marginTop: 8, fontSize: 15 }}>Join thousands of women navigating menopause</p>
        </div>

        <div className="auth-card">
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', marginBottom: 28, letterSpacing: '-0.01em' }}>Create your account</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div className="auth-error">{error}</div>}

            <div>
              <label className="auth-label" htmlFor="displayName">Your name</label>
              <input id="displayName" className="auth-input" placeholder="How you'll appear in the community" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            </div>

            <div>
              <label className="auth-label" htmlFor="email">Email</label>
              <input id="email" className="auth-input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="auth-label" htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" autoComplete="new-password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <p style={{ fontSize: 12, color: '#b8a9a0', lineHeight: 1.6 }}>
              By joining you agree to our{' '}
              <Link href="/privacy" style={{ color: '#6b9e80' }}>Privacy Policy</Link>.
              Your health data is encrypted and never sold.
            </p>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#a09098', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#6b9e80', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
