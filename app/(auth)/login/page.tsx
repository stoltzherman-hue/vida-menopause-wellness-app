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
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [btnActive, setBtnActive] = useState(false)

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

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    height: 52,
    borderRadius: 14,
    border: focused ? '1.5px solid #2d8b7a' : '1.5px solid rgba(237,224,216,0.9)',
    background: '#ffffff',
    padding: '0 18px',
    fontSize: 15,
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    color: '#1a1220',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(45,139,122,0.10)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

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
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse 55% 40% at 10% 8%, rgba(107,158,128,0.16) 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 88% 88%, rgba(196,149,158,0.13) 0%, transparent 50%)',
      }} />

      {/* Glass card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,0.55)',
        border: '1.5px solid rgba(255,255,255,0.80)',
        borderRadius: 28,
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        padding: '44px',
        boxShadow: '0 4px 28px rgba(61,44,53,0.07), 0 1px 0 rgba(255,255,255,0.95) inset',
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1220',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
          }}>
            vida<span style={{ color: '#2d8b7a' }}>.</span>
          </Link>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 26,
          fontWeight: 700,
          color: '#1a1220',
          margin: '0 0 6px 0',
          textAlign: 'center',
        }}>
          Welcome back
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14,
          color: '#8a7a72',
          textAlign: 'center',
          margin: '0 0 32px 0',
        }}>
          Your wellness journey continues
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{
              background: 'rgba(201,82,82,0.07)',
              border: '1px solid rgba(201,82,82,0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: 14,
              color: '#c0392b',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#1a1220',
              marginBottom: 8,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="you@example.com"
              required
              style={inputStyle(emailFocused)}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#1a1220',
              marginBottom: 8,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="••••••••"
              required
              style={inputStyle(passwordFocused)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => { setBtnHovered(false); setBtnActive(false) }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 999,
              border: 'none',
              background: loading ? '#a0c4bc' : 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading
                ? 'none'
                : btnHovered
                  ? '0 10px 32px rgba(45,139,122,0.38)'
                  : '0 6px 24px rgba(45,139,122,0.28)',
              transform: loading ? 'none' : btnActive ? 'scale(0.97)' : btnHovered ? 'translateY(-2px)' : 'none',
              transition: 'transform 0.15s, box-shadow 0.15s',
              marginTop: 4,
              letterSpacing: '0.01em',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 14,
            color: '#8a7a72',
            margin: '0 0 6px 0',
          }}>
            New to Vida?{' '}
            <Link href="/signup" style={{ color: '#2d8b7a', fontWeight: 600, textDecoration: 'none' }}>
              Join free
            </Link>
          </p>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 12,
            color: '#8a7a72',
            margin: 0,
          }}>
            Community is always free · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
