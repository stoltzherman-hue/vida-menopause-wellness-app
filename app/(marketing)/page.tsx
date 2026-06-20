import Link from 'next/link'
import { Heart, MessageCircle, Users, TrendingUp, Shield, Sparkles, ArrowRight } from 'lucide-react'

const features = [
  { icon: Heart, title: 'Daily check-in', desc: 'Track symptoms, sleep, mood and triggers in under 2 minutes. See patterns emerge over time.', bg: '#fff7f3', iconBg: 'rgba(196,122,90,0.12)', iconColor: '#c47a5a' },
  { icon: TrendingUp, title: 'Pattern insights', desc: 'Understand what affects how you feel and why. 30-day trend charts that actually make sense.', bg: '#f4faf6', iconBg: 'rgba(107,158,128,0.12)', iconColor: '#5a8a6b' },
  { icon: MessageCircle, title: 'AI companion', desc: 'A warm, evidence-informed coach — available any time. Supportive friend, wellness coach, or doctor prep mode.', bg: '#f6f3fc', iconBg: 'rgba(184,169,201,0.15)', iconColor: '#9b8ab8', premium: true },
  { icon: Users, title: 'Community', desc: 'Forums and Circles with women at the exact same stage. Real conversations, zero judgment.', bg: '#f4faf6', iconBg: 'rgba(107,158,128,0.12)', iconColor: '#5a8a6b' },
  { icon: Shield, title: 'Doctor prep', desc: 'Generate a clear symptom summary to bring to your appointment. Walk in feeling prepared and heard.', bg: '#fff7f3', iconBg: 'rgba(196,122,90,0.12)', iconColor: '#c47a5a', premium: true },
  { icon: Sparkles, title: 'Privacy first', desc: 'Your health data is yours. Encrypted at rest, never sold, always deletable. No exceptions.', bg: '#fffbf2', iconBg: 'rgba(201,169,110,0.12)', iconColor: '#a8843a' },
]

const stats = [
  { value: '12,000+', label: 'women supported' },
  { value: '4.9 ★', label: 'average rating' },
  { value: '98%', label: 'feel less alone' },
  { value: 'Free', label: 'to get started' },
]

export default function MarketingHomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>

      {/* ── Navigation ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="m-nav-glass">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.02em' }}>
              vida<span style={{ color: '#6b9e80' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/login" className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 28px 100px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 110% 75% at 50% -15%, rgba(107,158,128,0.22) 0%, transparent 65%), radial-gradient(ellipse 75% 65% at 90% 110%, rgba(196,149,158,0.16) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 8% 85%, rgba(201,169,110,0.1) 0%, transparent 55%), #fdf8f4',
      }}>
        {/* Decorative rings */}
        {[600, 440, 290].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: size, height: size,
            border: `1px solid rgba(107,158,128,${0.06 - i * 0.015})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -65%)',
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', maxWidth: 820, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(107,158,128,0.1)', border: '1px solid rgba(107,158,128,0.2)', borderRadius: 9999, padding: '8px 18px', marginBottom: 44 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#4a7a5b', letterSpacing: '-0.01em' }}>Trusted by 12,000+ women navigating menopause</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(46px, 7vw, 80px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.03em', color: '#3d2c35',
            marginBottom: 26,
          }}>
            You deserve to understand<br />
            <span className="gradient-text">what your body is doing.</span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 2.2vw, 20px)', color: '#8a7a72', maxWidth: 580, margin: '0 auto 52px', lineHeight: 1.7 }}>
            Vida is a wellness companion for women navigating perimenopause and menopause —
            combining community, symptom tracking, and an AI coach that actually <em>gets it</em>.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
            <Link href="/signup" className="m-btn m-btn-primary" style={{ fontSize: 16, padding: '16px 42px' }}>
              Start for free <ArrowRight size={16} />
            </Link>
            <Link href="/community" className="m-btn m-btn-outline" style={{ fontSize: 16, padding: '15px 38px' }}>
              Explore community
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#c0b4ac', letterSpacing: '0.01em' }}>Community is always free &middot; No credit card required</p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(237,224,216,0.55)', borderBottom: '1px solid rgba(237,224,216,0.55)', padding: '30px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '24px 48px', justifyContent: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 30, fontWeight: 700, color: '#3d2c35', lineHeight: 1.1 }}>{value}</p>
              <p style={{ fontSize: 13, color: '#b8a9a0', marginTop: 3 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b9e80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Built for you</p>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(30px, 4.5vw, 50px)', fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 18 }}>
            Everything you need in one place
          </h2>
          <p style={{ color: '#8a7a72', fontSize: 18, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Built specifically for perimenopause and menopause — because generic wellness apps miss the point.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 18 }}>
          {features.map(({ icon: Icon, title, desc, bg, iconBg, iconColor, premium }) => (
            <div key={title} className="m-feature-card" style={{ background: bg }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ background: iconBg, borderRadius: 16, padding: 13, display: 'inline-flex' }}>
                  <Icon size={22} style={{ color: iconColor }} strokeWidth={1.8} />
                </div>
                {premium && (
                  <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(201,169,110,0.1)', color: '#a8843a', border: '1px solid rgba(201,169,110,0.22)', borderRadius: 9999, padding: '5px 11px', letterSpacing: '0.02em' }}>Premium</span>
                )}
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, fontSize: 20, color: '#3d2c35', marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ padding: '0 28px 0', marginBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(148deg, #3a2832 0%, #52364a 55%, #5e3f54 100%)',
            borderRadius: 40,
            padding: 'clamp(48px, 8vw, 80px) clamp(32px, 8vw, 96px)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(107,158,128,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(196,149,158,0.1)' }} />
            <div style={{ position: 'absolute', top: '40%', left: '15%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,169,110,0.06)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 48, marginBottom: 32, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>🌿</div>
              <blockquote style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(20px, 3vw, 28px)',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.55, fontStyle: 'italic',
                maxWidth: 680, margin: '0 auto 44px',
              }}>
                &ldquo;For the first time I feel like someone actually understands what I&apos;m going through.
                Vida helped me track my patterns and finally have a proper conversation with my doctor.&rdquo;
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6b9e80 0%, #c4959e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 17, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>S</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Sarah, 51</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 2 }}>Perimenopause · 8 months with Vida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '100px 28px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b9e80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Pricing</p>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, color: '#3d2c35', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 14 }}>
          Simple, honest pricing
        </h2>
        <p style={{ color: '#8a7a72', fontSize: 17, marginBottom: 56, lineHeight: 1.6 }}>
          Community is always free. Premium unlocks your AI companion, advanced insights, and more.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, textAlign: 'left' }}>
          {/* Free */}
          <div style={{ background: 'white', border: '1.5px solid rgba(237,224,216,0.8)', borderRadius: 32, padding: 36, boxShadow: '0 2px 20px rgba(61,44,53,0.06)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#c0b4ac', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Free forever</p>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 52, fontWeight: 700, color: '#3d2c35', lineHeight: 1, marginBottom: 6 }}>$0</p>
            <p style={{ fontSize: 14, color: '#c0b4ac', marginBottom: 32 }}>No card needed</p>
            <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {['Community forums & Circles', 'Daily symptom check-in', 'Basic symptom history', 'Limited AI messages'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: '#6a5a62' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8f2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6b9e80', fontWeight: 700, fontSize: 12 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="m-btn m-btn-outline" style={{ width: '100%', fontSize: 15, padding: '14px 20px' }}>
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div style={{ background: 'linear-gradient(148deg, #3a2832 0%, #52364a 55%, #5e3f54 100%)', borderRadius: 32, padding: 36, boxShadow: '0 16px 60px rgba(58,40,50,0.4)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(107,158,128,0.1)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium</p>
                <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(201,169,110,0.2)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 9999, padding: '5px 13px' }}>Most popular</span>
              </div>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 52, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 6 }}>$12.99</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>per month · cancel any time</p>
              <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {['Everything in Free', 'Unlimited AI companion', 'All 3 conversation modes', 'Advanced pattern insights', 'Doctor visit reports', 'Personalised wellness plan'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: 'rgba(255,255,255,0.78)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(107,158,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6b9e80', fontWeight: 700, fontSize: 12 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="m-btn" style={{ width: '100%', fontSize: 15, padding: '15px 20px', background: 'white', color: '#3d2c35', borderRadius: 16, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.22)', justifyContent: 'center' }}>
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(237,224,216,0.6)', padding: '52px 28px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 28, fontWeight: 700, color: '#3d2c35', marginBottom: 22 }}>vida<span style={{ color: '#6b9e80' }}>.</span></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px', justifyContent: 'center', marginBottom: 22 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Community', '/community']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 14, color: '#b8a9a0', transition: 'color 0.2s' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#ccc0bb', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
          &copy; 2026 Vida Wellness &middot; Educational support only, not a substitute for medical advice.
          Always consult your healthcare provider for medical decisions.
        </p>
      </footer>
    </div>
  )
}
