'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { loginSchema } from '@/lib/validations'
import Link from 'next/link'

export default function LoginPage() {
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
    if (authError) {
      setLoading(false)
      if (authError.message.toLowerCase().includes('confirm')) {
        setError('Please confirm your email first — check your inbox for the confirmation link.')
      } else {
        setError(authError.message || 'Invalid email or password')
      }
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#09070e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse 55% 45% at 12% 10%, rgba(122,82,176,0.16) 0%, transparent 60%), radial-gradient(ellipse 45% 35% at 88% 85%, rgba(196,149,158,0.09) 0%, transparent 55%)',
      }} />

      {/* Portrait watermark */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '52%', height: '100%',
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        opacity: 0.08,
        maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://media.craiyon.com/2025-05-26/0f6O-Dn9Qrme3fztiJ5JmQ.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>

      {/* Top glow line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(139,109,181,0.35) 40%, rgba(196,184,224,0.2) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Glass card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 28,
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        padding: '48px 40px',
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 30, fontWeight: 300,
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
          }}>
            vida<span style={{ color: '#9b7cc8' }}>.</span>
          </Link>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 24, fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          margin: '0 0 6px 0',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          Welcome back
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, fontWeight: 300,
          color: 'rgba(255,255,255,0.32)',
          textAlign: 'center',
          margin: '0 0 36px 0',
        }}>
          Your wellness journey continues
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{
              background: 'rgba(217,95,95,0.08)',
              border: '1px solid rgba(217,95,95,0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 13,
              color: '#e8a0a0',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 300,
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 400,
              color: 'rgba(255,255,255,0.42)', marginBottom: 8,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              Email
            </label>
            <input
              className="auth-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 400,
              color: 'rgba(255,255,255,0.42)', marginBottom: 8,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              Password
            </label>
            <input
              className="auth-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 13, fontWeight: 300,
            color: 'rgba(255,255,255,0.32)',
            margin: '0 0 6px 0',
          }}>
            New to Vida?{' '}
            <Link href="/signup" style={{ color: '#c4b8e0', fontWeight: 400, textDecoration: 'none' }}>
              Join free
            </Link>
          </p>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11, fontWeight: 300,
            color: 'rgba(255,255,255,0.18)',
            margin: 0, letterSpacing: '0.02em',
          }}>
            Community is always free · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
