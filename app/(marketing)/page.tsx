import Link from 'next/link'
import { Heart, MessageCircle, Users, TrendingUp, Shield, Sparkles, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react'
import { MarketingFAQ } from '@/components/marketing/MarketingFAQ'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

const features = [
  { icon: Heart,        title: 'Daily check-in',     desc: 'Track symptoms, sleep, mood and triggers in under 2 minutes. See patterns emerge over time.',                                        bg: '#fff7f3', iconBg: 'rgba(196,122,90,0.12)',   iconColor: '#c47a5a' },
  { icon: TrendingUp,   title: 'Pattern insights',   desc: 'Understand what affects how you feel and why. 30-day trend charts and a calendar heat map that makes sense.',                       bg: '#f4faf6', iconBg: 'rgba(107,158,128,0.12)',  iconColor: '#5a8a6b' },
  { icon: MessageCircle,title: 'AI companion',       desc: 'A warm, evidence-informed coach — available any time. Supportive friend, wellness coach, or doctor prep mode.',                   bg: '#f6f3fc', iconBg: 'rgba(184,169,201,0.15)', iconColor: '#9b8ab8', premium: true },
  { icon: Users,        title: 'Community',          desc: 'Forums with women at the exact same stage. Real conversations, zero judgment — always free.',                                      bg: '#f4faf6', iconBg: 'rgba(107,158,128,0.12)',  iconColor: '#5a8a6b' },
  { icon: Shield,       title: 'Doctor prep',        desc: 'Generate a clear symptom summary to bring to your appointment. Walk in feeling prepared and heard.',                              bg: '#fff7f3', iconBg: 'rgba(196,122,90,0.12)',   iconColor: '#c47a5a', premium: true },
  { icon: Sparkles,     title: 'Privacy first',      desc: 'Your health data is yours. Encrypted at rest, never sold, always deletable. No exceptions.',                                      bg: '#fffbf2', iconBg: 'rgba(201,169,110,0.12)', iconColor: '#a8843a' },
]

const stats = [
  { value: '12,000+', label: 'women supported' },
  { value: '4.9 ★',  label: 'average rating' },
  { value: '98%',    label: 'feel less alone' },
  { value: 'Free',   label: 'to get started' },
]

const SYMPTOMS = ['Hot flushes', 'Brain fog', 'Low mood', 'Night sweats', 'Fatigue', 'Anxiety', 'Joint pain', 'Insomnia', 'Irritability', 'Palpitations']
const SYMPTOM_COLORS = ['#e07a5f','#2d8b7a','#9b8ab8','#c4959e','#c47a5a','#9b8ab8','#e07a5f','#c4959e','#c47a5a','#2d8b7a']

export default function MarketingHomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>

      {/* ── Navigation ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="m-nav-glass">
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1220', letterSpacing: '-0.02em' }}>
              vida<span style={{ color: '#2d8b7a' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/learn" style={{ fontSize: 14, fontWeight: 600, color: '#6a5a6a', padding: '8px 14px', display: 'none' }} className="nav-learn-link">Learn</Link>
              <Link href="/login"  className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero — two-column on desktop ── */}
      <section className="hero-grid" style={{
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(56px, 8vw, 100px) 32px clamp(64px, 8vw, 96px)',
        position: 'relative',
      }}>

        {/* Ambient background blobs — contained, no overflow issues */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', borderRadius: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,158,128,0.18) 0%, transparent 70%)', }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,149,158,0.14) 0%, transparent 70%)', }} />
        </div>

        {/* Left — text */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(45,139,122,0.09)', border: '1px solid rgba(45,139,122,0.20)', borderRadius: 9999, padding: '8px 18px', marginBottom: 36 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2d6b5a', letterSpacing: '-0.01em' }}>Trusted by 12,000+ women navigating menopause</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: '-0.03em', color: '#1a1220',
            marginBottom: 24,
          }}>
            You deserve to understand<br />
            <span className="gradient-text">what your body is doing.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#6a5a6a', maxWidth: 520, marginBottom: 44, lineHeight: 1.75 }}>
            Vida is a wellness companion for women navigating perimenopause and menopause —
            combining community, symptom tracking, and an AI coach that actually <em>gets it</em>.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginBottom: 28 }}>
            <Link href="/signup" className="m-btn m-btn-primary" style={{ fontSize: 16, padding: '15px 40px' }}>
              Start for free <ArrowRight size={16} />
            </Link>
            <Link href="/community" className="m-btn m-btn-outline" style={{ fontSize: 16, padding: '14px 34px' }}>
              Explore community
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#b8a9a0' }}>Community is always free &middot; No credit card required</p>
        </div>

        {/* Right — visual symptom card mockup (desktop only) */}
        <div className="hero-visual-col" style={{ position: 'relative', zIndex: 1 }}>
          {/* Main card */}
          <div style={{
            background: 'rgba(255,255,255,0.72)', border: '1.5px solid rgba(255,255,255,0.85)',
            borderRadius: 28, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 24px 80px rgba(26,18,32,0.14)',
            padding: '28px 26px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(45,139,122,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} strokeWidth={1.8} style={{ color: '#2d8b7a' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1a1220', fontSize: 15, margin: 0 }}>Today&apos;s check-in</p>
                <p style={{ fontSize: 12, color: '#b8a9a0', margin: '2px 0 0' }}>Takes 2 minutes</p>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(45,139,122,0.10)', border: '1px solid rgba(45,139,122,0.20)', borderRadius: 9999, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#2d8b7a' }}>STEP 2 / 5</div>
            </div>

            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 16, fontWeight: 700, color: '#1e3d35', marginBottom: 16 }}>What are you experiencing today?</p>

            {/* Symptom pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {SYMPTOMS.map((s, i) => {
                const selected = i === 0 || i === 2 || i === 4
                return (
                  <span key={s} style={{
                    borderRadius: 22, padding: '7px 14px', fontSize: 12, fontWeight: selected ? 600 : 500,
                    background: selected ? SYMPTOM_COLORS[i] : 'rgba(237,224,216,0.45)',
                    color: selected ? 'white' : '#8a7a72',
                    border: selected ? 'none' : '1px solid rgba(237,224,216,0.7)',
                    boxShadow: selected ? `0 2px 8px ${SYMPTOM_COLORS[i]}40` : 'none',
                  }}>{s}</span>
                )
              })}
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, borderRadius: 9999, background: 'rgba(237,224,216,0.5)', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #2d8b7a, #6b9e80)', borderRadius: 9999 }} />
            </div>
          </div>

          {/* Floating insight card */}
          <div style={{
            position: 'absolute', bottom: -20, right: -24,
            background: 'linear-gradient(135deg, #1e6b55 0%, #2d8b7a 100%)',
            borderRadius: 20, padding: '16px 18px',
            boxShadow: '0 12px 32px rgba(45,139,122,0.38)',
            maxWidth: 200,
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Your insight</p>
            <p style={{ fontSize: 13, color: 'white', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
              Hot flushes peaked on days 3–5 this cycle
            </p>
          </div>

          {/* Floating streak badge */}
          <div style={{
            position: 'absolute', top: -16, left: -16,
            background: 'white', borderRadius: 16, padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(26,18,32,0.12)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <div>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 800, color: '#2d8b7a', margin: 0, lineHeight: 1 }}>14</p>
              <p style={{ fontSize: 10, color: '#b8a9a0', margin: 0, fontWeight: 600 }}>Day streak</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(237,224,216,0.55)', borderBottom: '1px solid rgba(237,224,216,0.55)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '20px 48px', justifyContent: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 30, fontWeight: 700, color: '#1a1220', lineHeight: 1.1 }}>{value}</p>
              <p style={{ fontSize: 13, color: '#b8a9a0', marginTop: 3 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Built for you</p>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
            Everything you need in one place
          </h2>
          <p style={{ color: '#8a7a72', fontSize: 17, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Built specifically for perimenopause and menopause — because generic wellness apps miss the point.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {features.map(({ icon: Icon, title, desc, bg, iconBg, iconColor, premium }) => (
            <div key={title} className="m-feature-card" style={{ background: bg }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ background: iconBg, borderRadius: 16, padding: 13, display: 'inline-flex' }}>
                  <Icon size={22} style={{ color: iconColor }} strokeWidth={1.8} />
                </div>
                {premium && (
                  <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(201,169,110,0.1)', color: '#a8843a', border: '1px solid rgba(201,169,110,0.22)', borderRadius: 9999, padding: '5px 11px' }}>Premium</span>
                )}
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, fontSize: 20, color: '#1a1220', marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ padding: '0 32px', marginBottom: 0 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(148deg, #1a1220 0%, #2a1830 55%, #1e2830 100%)',
            borderRadius: 40,
            padding: 'clamp(48px, 7vw, 80px) clamp(32px, 7vw, 96px)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(45,139,122,0.14)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(196,149,158,0.10)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 48, marginBottom: 32 }}>🌿</div>
              <blockquote style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(18px, 2.8vw, 26px)',
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.6, fontStyle: 'italic',
                maxWidth: 680, margin: '0 auto 44px',
              }}>
                &ldquo;For the first time I feel like someone actually understands what I&apos;m going through.
                Vida helped me track my patterns and finally have a proper conversation with my doctor.&rdquo;
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #2d8b7a 0%, #c4959e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 17, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>S</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Sarah, 51</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>Perimenopause · 8 months with Vida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Pricing</p>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
          Simple, honest pricing
        </h2>
        <p style={{ color: '#8a7a72', fontSize: 17, marginBottom: 52, lineHeight: 1.6 }}>
          Community is always free. Premium unlocks your AI companion, advanced insights, and more.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, textAlign: 'left' }}>
          {/* Free */}
          <div style={{ background: 'white', border: '1.5px solid rgba(237,224,216,0.8)', borderRadius: 32, padding: 36, boxShadow: '0 2px 20px rgba(61,44,53,0.06)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#c0b4ac', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Free forever</p>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 50, fontWeight: 700, color: '#1a1220', lineHeight: 1, marginBottom: 6 }}>$0</p>
            <p style={{ fontSize: 14, color: '#c0b4ac', marginBottom: 32 }}>No card needed</p>
            <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {['Community forums & Circles', 'Daily symptom check-in', 'Basic symptom history', 'Limited AI messages'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: '#6a5a62' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8f2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2d8b7a', fontWeight: 700, fontSize: 12 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="m-btn m-btn-outline" style={{ width: '100%', fontSize: 15, padding: '14px 20px', justifyContent: 'center' }}>
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div style={{ background: 'linear-gradient(148deg, #1a1220 0%, #2a1830 55%, #1e2830 100%)', borderRadius: 32, padding: 36, boxShadow: '0 16px 60px rgba(26,18,32,0.35)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, borderRadius: '50%', background: 'rgba(45,139,122,0.12)' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(196,149,158,0.08)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium</p>
                <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(201,169,110,0.18)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.28)', borderRadius: 9999, padding: '5px 13px' }}>Most popular</span>
              </div>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 50, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 6 }}>$12.99</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>per month · cancel any time</p>
              <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {['Everything in Free', 'Unlimited AI companion', 'All 3 conversation modes', 'Advanced pattern insights', 'Doctor visit reports', 'Personalised wellness plan'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(45,139,122,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4aad90', fontWeight: 700, fontSize: 12 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="m-btn" style={{ width: '100%', fontSize: 15, padding: '15px 20px', background: 'white', color: '#1a1220', borderRadius: 16, fontWeight: 700, boxShadow: '0 4px 24px rgba(0,0,0,0.22)', justifyContent: 'center' }}>
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Getting started</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
              How Vida works
            </h2>
            <p style={{ color: '#8a7a72', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              From first check-in to genuine clarity — in three simple steps.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              step: '01',
              icon: '✏️',
              title: 'Log your day in 2 minutes',
              body: 'Rate how you feel, tap the symptoms you experienced, note what helped or made things harder. It takes under 2 minutes and builds a powerful longitudinal record.',
              color: '#2d8b7a',
              bg: 'rgba(45,139,122,0.06)',
              border: 'rgba(45,139,122,0.14)',
            },
            {
              step: '02',
              icon: '📊',
              title: 'Watch your patterns emerge',
              body: 'After a few weeks, Vida\'s calendar heat map and trend charts reveal the connections between your sleep, mood, triggers, and symptoms that are invisible day-to-day.',
              color: '#c47a5a',
              bg: 'rgba(196,122,90,0.06)',
              border: 'rgba(196,122,90,0.14)',
            },
            {
              step: '03',
              icon: '💬',
              title: 'Get support and take action',
              body: 'Talk to Vida — your AI companion — for personalised guidance based on your data. Join the community. Generate a symptom report for your next doctor appointment.',
              color: '#9b8ab8',
              bg: 'rgba(155,138,184,0.06)',
              border: 'rgba(155,138,184,0.14)',
            },
          ].map(({ step, icon, title, body, color, bg, border }, i) => (
            <ScrollReveal key={step} delay={i * 120}>
              <div style={{
                background: bg, border: `1.5px solid ${border}`,
                borderRadius: 28, padding: '32px 28px', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 28, right: 28,
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 48, fontWeight: 800, color: `${color}18`, lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {step}
                </div>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1220', marginBottom: 12, lineHeight: 1.3 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: '#6a5a6a', lineHeight: 1.7 }}>{body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Knowledge hub teaser ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 96px) 32px 0' }}>
        <ScrollReveal>
          <div style={{
            background: 'rgba(255,255,255,0.72)', border: '1.5px solid rgba(237,224,216,0.7)',
            borderRadius: 36, padding: 'clamp(36px, 5vw, 60px)',
            display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'center',
          }} className="learn-teaser-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(45,139,122,0.08)', border: '1px solid rgba(45,139,122,0.16)', borderRadius: 9999, padding: '7px 16px', marginBottom: 24 }}>
                <BookOpen size={13} style={{ color: '#2d8b7a' }} strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2d6b5a', letterSpacing: '0.04em' }}>Knowledge Hub</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16 }}>
                Understand what&apos;s happening in your body
              </h2>
              <p style={{ fontSize: 16, color: '#6a5a6a', lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                12 in-depth guides on symptoms, stages, lifestyle, and treatment — written clearly, grounded in evidence. Because you deserve real answers, not vague reassurances.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                {[
                  'Hot flushes, night sweats & what actually helps',
                  'The mood rollercoaster: anxiety, low mood & irritability',
                  'HRT: common questions answered clearly',
                  'How to talk to your doctor and be heard',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={16} style={{ color: '#2d8b7a', flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                    <span style={{ fontSize: 14, color: '#5a4a5a', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/learn" className="m-btn m-btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
                Explore the knowledge hub <ArrowRight size={15} />
              </Link>
            </div>
            <div className="learn-teaser-cards">
              {[
                { icon: '🔥', cat: 'Symptoms', title: 'Hot flushes & night sweats', color: '#e07a5f', bg: '#fff7f3' },
                { icon: '🧠', cat: 'Symptoms', title: 'Brain fog explained', color: '#9b8ab8', bg: '#f6f3fc' },
                { icon: '💊', cat: 'Treatment', title: 'HRT: common questions', color: '#c47a5a', bg: '#fff7f3' },
                { icon: '🌙', cat: 'Symptoms', title: 'Sleep & menopause', color: '#c4959e', bg: '#fdf4f5' },
                { icon: '💛', cat: 'Mental health', title: 'Mood & anxiety', color: '#c9a96e', bg: '#fffbf2' },
                { icon: '🏃‍♀️', cat: 'Lifestyle', title: 'Exercise & movement', color: '#2d8b7a', bg: '#f4faf6' },
              ].map(({ icon, cat, title, color, bg }) => (
                <div key={title} className="learn-mini-card" style={{ background: bg }}>
                  <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>{cat}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1220', lineHeight: 1.35 }}>{title}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Testimonials grid ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>What women say</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              Real women, real results
            </h2>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {[
            {
              quote: 'I finally have something to show my GP. After 6 months of dismissal, I walked in with my Vida symptom report and got HRT the same day.',
              name: 'Sarah', age: 51, duration: '8 months with Vida', initial: 'S', color: '#2d8b7a',
            },
            {
              quote: 'The brain fog was so bad I thought I had early dementia. Seeing it mapped to my sleep quality in the tracker made it make sense. I felt less scared.',
              name: 'Claire', age: 47, duration: '5 months with Vida', initial: 'C', color: '#9b8ab8',
            },
            {
              quote: 'The community is everything. Women who actually get it — no one telling me to just try yoga. I don\'t feel alone anymore.',
              name: 'Yvonne', age: 53, duration: '11 months with Vida', initial: 'Y', color: '#c47a5a',
            },
            {
              quote: 'I identified that alcohol — even one glass — was triggering my worst night sweats. I wouldn\'t have made that connection without the tracker.',
              name: 'Marisol', age: 49, duration: '4 months with Vida', initial: 'M', color: '#c4959e',
            },
            {
              quote: 'The AI companion mode where you prepare for a doctor visit is genuinely brilliant. It turned my anxious notes into something clear and confident.',
              name: 'Diane', age: 55, duration: '14 months with Vida', initial: 'D', color: '#c9a96e',
            },
            {
              quote: 'I\'m perimenopausal and everyone kept saying I was \'too young\'. Vida helped me document what was happening so I could say — no, this is real.',
              name: 'Priya', age: 42, duration: '6 months with Vida', initial: 'P', color: '#5a8a6b',
            },
          ].map(({ quote, name, age, duration, initial, color }, i) => (
            <ScrollReveal key={name} delay={i * 80}>
              <div style={{
                background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(237,224,216,0.65)',
                borderRadius: 24, padding: '28px 24px', backdropFilter: 'blur(12px)',
              }}>
                <div style={{ fontSize: 28, color: `${color}40`, fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 14 }}>&ldquo;</div>
                <p style={{ fontSize: 14, color: '#4a3a42', lineHeight: 1.75, marginBottom: 22 }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${color}20`, border: `1.5px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{initial}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1220', margin: 0 }}>{name}, {age}</p>
                    <p style={{ fontSize: 12, color: '#b8a9a0', margin: '2px 0 0' }}>{duration}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
              Questions women actually ask
            </h2>
            <p style={{ color: '#8a7a72', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              From what perimenopause actually is, to whether your symptoms are normal, to how to talk to a doctor who dismisses you.
            </p>
          </div>
        </ScrollReveal>
        <MarketingFAQ />
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/learn" style={{ fontSize: 15, color: '#2d8b7a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Read all guides in the knowledge hub <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(237,224,216,0.6)', padding: '52px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1a1220', marginBottom: 22 }}>vida<span style={{ color: '#2d8b7a' }}>.</span></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px', justifyContent: 'center', marginBottom: 22 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Community', '/community']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 14, color: '#b8a9a0' }}>{label}</Link>
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
