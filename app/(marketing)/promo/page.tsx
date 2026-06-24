'use client'
import { useState } from 'react'
import Link from 'next/link'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

export default function PromoPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() }),
    })
    const json = await res.json()

    if (res.ok) {
      setSuccess(true)
    } else {
      setError(json.error?.message ?? 'Something went wrong.')
    }
    setLoading(false)
  }

  const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09070e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      {/* Orb */}
      <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,82,176,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 40 }}>
          <span style={{ fontFamily: PF, fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em' }}>
            vida<span style={{ color: '#9b7cc8' }}>.</span>
          </span>
        </Link>

        {success ? (
          <div style={{ ...glass, borderRadius: 24, padding: '40px 32px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(139,109,181,0.18)', border: '1px solid rgba(139,109,181,0.35)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(196,184,224,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Welcome, founding member
            </h1>
            <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 28px' }}>
              You have 1 year of Vida Premium — completely free. Thank you for being here at the beginning.
            </p>
            <Link href="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 14 }}>
              Go to my dashboard
            </Link>
          </div>
        ) : (
          <div style={{ ...glass, borderRadius: 24, padding: '40px 32px' }}>
            {/* Founding badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 9999, padding: '6px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e' }} />
              <span style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(201,169,110,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Founding member offer</span>
            </div>

            <h1 style={{ fontFamily: PF, fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              1 year of Premium, free
            </h1>
            <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, margin: '0 0 32px' }}>
              The first 100 members of Vida get full Premium access — AI companion, advanced insights, doctor reports — for a year, on us.
            </p>

            <form onSubmit={handleRedeem} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="auth-input"
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
                style={{ textAlign: 'center', letterSpacing: '0.15em', fontWeight: 400, fontSize: 16 }}
              />
              {error && (
                <div style={{ background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'rgba(232,160,160,0.9)', fontFamily: DM, fontWeight: 300 }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="btn-primary"
                style={{ opacity: loading || !code.trim() ? 0.5 : 1, cursor: loading || !code.trim() ? 'not-allowed' : 'pointer', fontSize: 14 }}
              >
                {loading ? 'Checking…' : 'Redeem code'}
              </button>
            </form>

            <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.2)', marginTop: 20 }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: 'rgba(155,124,200,0.7)', textDecoration: 'none' }}>Sign up first →</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
