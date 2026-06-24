'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { signUpSchema } from '@/lib/validations'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', height: 50, borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
  padding: '0 18px', fontSize: 15,
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  color: 'rgba(255,255,255,0.82)', outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 300,
  color: 'rgba(255,255,255,0.55)', marginBottom: 8,
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
}

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

  const backdrop = (
    <>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(ellipse 55% 40% at 10% 8%, rgba(155,124,200,0.12) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 88% 88%, rgba(122,82,176,0.10) 0%, transparent 50%)' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '52%', height: '100%',
        overflow: 'hidden', pointerEvents: 'none',
        opacity: 0.08,
        maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://media.craiyon.com/2025-05-26/0f6O-Dn9Qrme3fztiJ5JmQ.webp" alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
    </>
  )

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#09070e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
        {backdrop}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 28, backdropFilter: 'blur(24px)', padding: '48px 36px', textAlign: 'center', maxWidth: 420, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(155,124,200,0.18)', border: '1px solid rgba(155,124,200,0.3)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 16 }}>Check your inbox</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            We sent a confirmation link to <strong style={{ color: 'rgba(255,255,255,0.88)' }}>{email}</strong>.<br/>Click it to activate your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09070e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', overflow: 'hidden' }}>
      {backdrop}

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 38, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
            vida<span style={{ color: '#9b7cc8' }}>.</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 10, fontSize: 14, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Join thousands of women navigating menopause</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 28, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', padding: '36px 32px' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginTop: 0, marginBottom: 28 }}>Create your account</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div style={{ background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: 'rgba(232,160,160,0.9)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{error}</div>
            )}

            <div>
              <label style={labelStyle}>Your name</label>
              <input className="auth-input" style={inputStyle} placeholder="How you'll appear in the community" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input className="auth-input" style={inputStyle} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input className="auth-input" style={inputStyle} type="password" autoComplete="new-password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', margin: 0 }}>
              By joining you agree to our{' '}
              <Link href="/privacy" style={{ color: '#c4b8e0' }}>Privacy Policy</Link>.
              Your health data is encrypted and never sold.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', height: 52, borderRadius: 16, border: 'none',
                background: loading ? 'rgba(155,124,200,0.4)' : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
                color: '#fff', fontSize: 16, fontWeight: 300,
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(155,124,200,0.28)',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 24, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#c4b8e0', fontWeight: 300 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
