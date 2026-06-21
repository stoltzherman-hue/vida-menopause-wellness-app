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
      background: '#fdf8f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(ellipse 55% 40% at 10% 8%, rgba(107,158,128,0.16) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 88% 88%, rgba(196,149,158,0.13) 0%, transparent 50%)' }} />

      {/* Hero woman watermark */}
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '48vw', maxWidth: 480, pointerEvents: 'none', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-woman.svg" alt="" aria-hidden="true" style={{ height: '100vh', width: 'auto', opacity: 0.45 }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 38, fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.02em', textDecoration: 'none' }}>
            vida<span style={{ color: '#6b9e80' }}>.</span>
          </Link>
          <p style={{ color: '#8a7a72', marginTop: 10, fontSize: 15, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Welcome back</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.88)',
          border: '1.5px solid rgba(237,224,216,0.8)',
          borderRadius: 28,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '36px 32px',
          boxShadow: '0 8px 40px rgba(61,44,53,0.09), 0 2px 8px rgba(61,44,53,0.05)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', marginTop: 0, marginBottom: 28 }}>Sign in</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div style={{ background: 'rgba(201,82,82,0.07)', border: '1px solid rgba(201,82,82,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#c0392b', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{error}</div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 8, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', height: 50, borderRadius: 14, border: '1.5px solid #e8ddd6', background: 'rgba(255,255,255,0.9)', padding: '0 18px', fontSize: 15, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', color: '#3d2c35', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 8, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', height: 50, borderRadius: 14, border: '1.5px solid #e8ddd6', background: 'rgba(255,255,255,0.9)', padding: '0 18px', fontSize: 15, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', color: '#3d2c35', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 52, borderRadius: 16, border: 'none',
                background: loading ? '#a0b8a8' : 'linear-gradient(135deg, #6b9e80 0%, #4a7a5b 100%)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(107,158,128,0.38)',
                marginTop: 6,
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8a7a72', marginTop: 24, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#6b9e80', fontWeight: 700, textDecoration: 'none' }}>Join free</Link>
        </p>
      </div>
    </div>
  )
}
