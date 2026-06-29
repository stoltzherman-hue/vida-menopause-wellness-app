import Link from 'next/link'
import { MarketingFAQ } from '@/components/marketing/MarketingFAQ'
import { InstallBanner } from '@/components/marketing/InstallBanner'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

const features = [
  { title: 'Daily check-in',   desc: 'Track symptoms, sleep, mood and triggers in under 2 minutes. See patterns emerge over time.' },
  { title: 'Pattern insights', desc: 'Understand what affects how you feel and why. 30-day trend charts that reveal the connections invisible day-to-day.' },
  { title: 'AI companion',     desc: 'A warm, evidence-informed coach — available any time. Supportive friend, wellness coach, or doctor prep mode.', premium: true },
  { title: 'Community',        desc: 'Forums with women at the exact same stage. Real conversations, zero judgment — always free.' },
  { title: 'Doctor prep',      desc: 'Generate a clear symptom summary to bring to your appointment. Walk in feeling prepared and heard.', premium: true },
  { title: 'Privacy first',    desc: 'Your health data is yours. Encrypted at rest, never sold, always deletable. No exceptions.' },
]

const stats = [
  { value: 'Built', label: 'for perimenopause' },
  { value: 'Free',  label: 'to get started' },
  { value: '2 min', label: 'daily check-in' },
  { value: 'yours', label: 'data, always' },
]

const testimonials = [
  { quote: 'I finally have something to show my GP. After 6 months of dismissal, I walked in with my Vida symptom report and got HRT the same day.', name: 'Sarah', age: 51, duration: '8 months with Vida', initial: 'S' },
  { quote: 'The brain fog was so bad I thought I had early dementia. Seeing it mapped to my sleep quality made it make sense. I felt less scared.', name: 'Claire', age: 47, duration: '5 months with Vida', initial: 'C' },
  { quote: 'The community is everything. Women who actually get it — no one telling me to just try yoga. I don\'t feel alone anymore.', name: 'Yvonne', age: 53, duration: '11 months with Vida', initial: 'Y' },
  { quote: 'I identified that alcohol — even one glass — was triggering my worst night sweats. I wouldn\'t have made that connection without the tracker.', name: 'Marisol', age: 49, duration: '4 months with Vida', initial: 'M' },
  { quote: 'The AI companion mode where you prepare for a doctor visit is genuinely brilliant. It turned my anxious notes into something clear and confident.', name: 'Diane', age: 55, duration: '14 months with Vida', initial: 'D' },
  { quote: 'I\'m perimenopausal and everyone kept saying I was \'too young\'. Vida helped me document what was happening so I could say — no, this is real.', name: 'Priya', age: 42, duration: '6 months with Vida', initial: 'P' },
]

const steps = [
  { step: '01', title: 'Log your day in 2 minutes', body: 'Rate how you feel, tap the symptoms you experienced, note what helped or made things harder. It takes under 2 minutes and builds a powerful longitudinal record.' },
  { step: '02', title: 'Watch your patterns emerge', body: 'After a few weeks, trend charts reveal the connections between your sleep, mood, triggers, and symptoms that are invisible day-to-day.' },
  { step: '03', title: 'Get support and take action', body: 'Talk to Vida — your AI companion — for personalised guidance based on your data. Generate a symptom report for your next doctor appointment.' },
]

const freeFeatures = ['Community forums & Circles', 'Daily symptom check-in', 'Basic symptom history', 'Limited AI messages']
const premiumFeatures = ['Everything in Free', 'Unlimited AI companion', 'All 3 conversation modes', 'Advanced pattern insights', 'Doctor visit reports', 'Personalised wellness plan']

export default function MarketingHomePage() {
  const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09070e', fontFamily: DM, position: 'relative', overflowX: 'hidden' }}>

      {/* Top glow line */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(139,109,181,0.35) 40%, rgba(196,184,224,0.2) 70%, transparent 100%)', pointerEvents: 'none', zIndex: 100 }} />

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,82,176,0.14) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,149,158,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* Portrait watermark — fixed ambient layer, matches app screens */}
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

      {/* ── Navigation ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, ...glass, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: PF, fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
            vida<span style={{ color: '#9b7cc8' }}>.</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', padding: '8px 16px', borderRadius: 10, textDecoration: 'none', transition: 'color 0.18s' }}>
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', height: 'auto', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Join free
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(80px, 12vw, 140px) 32px clamp(64px, 8vw, 96px)', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left — text */}
        <div>
        {/* Live badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(139,109,181,0.10)', border: '1px solid rgba(139,109,181,0.22)', borderRadius: 9999, padding: '8px 18px', marginBottom: 40 }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(196,184,224,0.75)', letterSpacing: '0.01em' }}>Built for women navigating perimenopause &amp; menopause</span>
        </div>

        <h1 style={{ fontFamily: PF, fontSize: 'clamp(38px, 6vw, 76px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.88)', marginBottom: 28 }}>
          You deserve to understand<br />
          <span style={{ background: 'linear-gradient(135deg, #9b7cc8 0%, #c4b8e0 60%, #e8c4cc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            what your body is doing.
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.38)', maxWidth: 520, marginBottom: 48, lineHeight: 1.75, fontWeight: 300 }}>
          Vida is a wellness companion for women navigating perimenopause and menopause —
          combining community, symptom tracking, and an AI coach that actually gets it.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 15, padding: '14px 36px', height: 'auto', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Start for free
          </Link>
          <Link href="/community" className="btn-ghost" style={{ fontSize: 15, padding: '14px 32px', height: 'auto', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Explore community
          </Link>
        </div>

        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.22)' }}>
          Community is always free · No credit card required · Install on any device
        </p>
        </div>

        {/* Right — 3D floating glass panels */}
        <div style={{ position: 'relative', height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Glow orb behind panels */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 50%, rgba(122,82,176,0.28) 0%, transparent 68%)', pointerEvents: 'none' }} />

          {/* Panel 3 — back left */}
          <div className="glass-panel glass-panel-left" style={{
            position: 'absolute',
            width: 168,
            height: 300,
            left: '2%',
            top: '14%',
            borderRadius: 24,
            background: 'rgba(155,124,200,0.08)',
            border: '1px solid rgba(155,124,200,0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transform: 'perspective(900px) rotateY(18deg) rotateZ(-3deg)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '18px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 400, color: 'rgba(196,184,224,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontFamily: DM }}>Community</div>
              {['Perimenopause Journey', 'HRT & Treatment', 'Sleep & Night Sweats', 'Mind & Mood'].map((c, i) => (
                <div key={c} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 10px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: ['rgba(196,122,90,0.2)','rgba(139,109,181,0.2)','rgba(196,184,224,0.15)','rgba(201,169,110,0.15)'][i], flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 300, color: 'rgba(255,255,255,0.6)', fontFamily: DM, lineHeight: 1.3 }}>{c}</span>
                </div>
              ))}
            </div>
            {/* shine */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
          </div>

          {/* Panel 1 — front centre */}
          <div className="glass-panel glass-panel-main" style={{
            position: 'absolute',
            width: 200,
            height: 360,
            left: '50%',
            top: '50%',
            transform: 'perspective(900px) translateX(-50%) translateY(-50%) rotateY(-8deg) rotateZ(2deg)',
            borderRadius: 28,
            background: 'rgba(155,124,200,0.11)',
            border: '1px solid rgba(155,124,200,0.28)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(155,124,200,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
            overflow: 'hidden',
            zIndex: 10,
          }}>
            <div style={{ padding: '20px 16px' }}>
              <div style={{ fontSize: 9, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, fontFamily: DM }}>Today · Check-in</div>
              <div style={{ fontFamily: PF, fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.82)', marginBottom: 16, lineHeight: 1.3 }}>How are you feeling today?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
                {['Hot flushes', 'Brain fog', 'Sleep', 'Mood'].map((s, i) => (
                  <div key={s} style={{ background: i < 2 ? 'rgba(155,124,200,0.18)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i < 2 ? 'rgba(155,124,200,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: 300, color: i < 2 ? 'rgba(196,184,224,0.85)' : 'rgba(255,255,255,0.35)', fontFamily: DM }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: DM, marginBottom: 6 }}>Energy level</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #9b7cc8, #c4b8e0)', borderRadius: 9999 }} />
                </div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(155,124,200,0.22), rgba(122,82,176,0.15))', border: '1px solid rgba(155,124,200,0.3)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 300, color: 'rgba(196,184,224,0.7)', fontFamily: DM, lineHeight: 1.5 }}>Your sleep pattern suggests hormonal fluctuation. Consider logging triggers today.</div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
          </div>

          {/* Panel 2 — back right */}
          <div className="glass-panel glass-panel-right" style={{
            position: 'absolute',
            width: 162,
            height: 280,
            right: '2%',
            top: '22%',
            borderRadius: 22,
            background: 'rgba(155,124,200,0.07)',
            border: '1px solid rgba(155,124,200,0.15)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            transform: 'perspective(900px) rotateY(-20deg) rotateZ(4deg)',
            boxShadow: '0 20px 56px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 400, color: 'rgba(196,184,224,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontFamily: DM }}>AI Companion</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(155,124,200,0.15)', border: '1px solid rgba(155,124,200,0.2)', borderRadius: '12px 12px 12px 4px', padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 300, color: 'rgba(196,184,224,0.8)', fontFamily: DM, lineHeight: 1.5 }}>What helps with brain fog during perimenopause?</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px 12px 4px 12px', padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontFamily: DM, lineHeight: 1.5 }}>Based on your tracking, sleep quality and oestrogen fluctuation are likely connected...</div>
                </div>
                <div style={{ background: 'rgba(155,124,200,0.15)', border: '1px solid rgba(155,124,200,0.2)', borderRadius: '12px 12px 12px 4px', padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 300, color: 'rgba(196,184,224,0.8)', fontFamily: DM, lineHeight: 1.5 }}>Can you help me prepare for my GP?</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
          </div>
        </div>

      </section>

      {/* ── Stats strip ── */}
      <div style={{ ...glass, borderLeft: 'none', borderRight: 'none', padding: '28px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '20px 48px', justifyContent: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: PF, fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Built for you</p>
          <h2 style={{ fontFamily: PF, fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 14 }}>
            Everything you need in one place
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, maxWidth: 460, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            Built specifically for perimenopause and menopause — because generic wellness apps miss the point.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map(({ title, desc, premium }) => (
            <div key={title} style={{ ...glass, borderRadius: 20, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,109,181,0.15)', border: '1px solid rgba(139,109,181,0.25)' }} />
                {premium && (
                  <span style={{ fontSize: 10, fontWeight: 400, background: 'rgba(201,169,110,0.08)', color: 'rgba(201,169,110,0.75)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 9999, padding: '4px 10px', letterSpacing: '0.04em' }}>Premium</span>
                )}
              </div>
              <h3 style={{ fontFamily: PF, fontWeight: 300, fontSize: 19, color: 'rgba(255,255,255,0.82)', marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── Pricing ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Pricing</p>
        <h2 style={{ fontFamily: PF, fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
          Simple, honest pricing
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, marginBottom: 52, lineHeight: 1.65, fontWeight: 300 }}>
          Community is always free. Premium unlocks your AI companion, advanced insights, and more.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, textAlign: 'left' }}>
          {/* Free */}
          <div style={{ ...glass, borderRadius: 28, padding: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Free forever</p>
            <p style={{ fontFamily: PF, fontSize: 48, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1, marginBottom: 6, letterSpacing: '-0.03em' }}>R0</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 32, fontWeight: 300 }}>No card needed</p>
            <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {freeFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(139,109,181,0.14)', border: '1px solid rgba(139,109,181,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="rgba(196,184,224,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-ghost" style={{ width: '100%', fontSize: 14, padding: '14px 20px', height: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div style={{ background: 'rgba(139,109,181,0.10)', border: '1px solid rgba(139,109,181,0.25)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 28, padding: 36, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(122,82,176,0.18)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(196,184,224,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium</p>
                <span style={{ fontSize: 10, fontWeight: 400, background: 'rgba(201,169,110,0.10)', color: 'rgba(201,169,110,0.75)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 9999, padding: '4px 12px' }}>Most popular</span>
              </div>
              <p style={{ fontFamily: PF, fontSize: 48, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1, marginBottom: 6, letterSpacing: '-0.03em' }}>R149</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', marginBottom: 32, fontWeight: 300 }}>per month · cancel any time</p>
              <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {premiumFeatures.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(139,109,181,0.22)', border: '1px solid rgba(139,109,181,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="rgba(196,184,224,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary" style={{ width: '100%', fontSize: 14, padding: '14px 20px', height: 'auto', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Getting started</p>
          <h2 style={{ fontFamily: PF, fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 14 }}>
            How Vida works
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            From first check-in to genuine clarity — in three simple steps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {steps.map(({ step, title, body }) => (
            <div key={step} style={{ ...glass, borderRadius: 22, padding: '32px 26px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: PF, fontSize: 44, fontWeight: 300, color: 'rgba(155,124,200,0.10)', lineHeight: 1, userSelect: 'none' }}>{step}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,109,181,0.14)', border: '1px solid rgba(139,109,181,0.22)', marginBottom: 20 }} />
              <h3 style={{ fontFamily: PF, fontSize: 19, fontWeight: 300, color: 'rgba(255,255,255,0.82)', marginBottom: 12, lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, fontWeight: 300 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials grid ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>What women say</p>
          <h2 style={{ fontFamily: PF, fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Real women, real results
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {testimonials.map(({ quote, name, age, duration, initial }) => (
            <div key={name} style={{ ...glass, borderRadius: 22, padding: '26px 22px' }}>
              <div style={{ fontFamily: PF, fontSize: 32, color: 'rgba(155,124,200,0.25)', lineHeight: 1, marginBottom: 12, fontWeight: 300 }}>&ldquo;</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 22, fontWeight: 300 }}>{quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139,109,181,0.15)', border: '1px solid rgba(139,109,181,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(196,184,224,0.7)', fontFamily: PF, fontSize: 14, fontWeight: 300, flexShrink: 0 }}>{initial}</div>
                <div>
                  <p style={{ fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{name}, {age}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '2px 0 0', fontWeight: 300 }}>{duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Clinical credibility ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 96px) 32px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ ...glass, borderRadius: 32, padding: 'clamp(48px, 6vw, 72px) clamp(32px, 6vw, 80px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(122,82,176,0.12)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(196,149,158,0.06)' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,109,181,0.12)', border: '1px solid rgba(139,109,181,0.25)', borderRadius: 9999, padding: '7px 16px', marginBottom: 24 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(196,184,224,0.7)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(196,184,224,0.65)', letterSpacing: '0.06em' }}>Evidence-informed approach</span>
              </div>
              <h2 style={{ fontFamily: PF, fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
                Built on what actually works
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, marginBottom: 32, maxWidth: 480, fontWeight: 300 }}>
                Everything in Vida — from check-in questions to AI companion responses — is grounded in research on menopause symptom management, CBT, and behaviour change.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Wellness tools based on CBT for menopause — an approach some women find helps reduce hot flush distress',
                  'Pattern language drawn from NICE guidelines and peer-reviewed menopause research',
                  'Doctor Report format designed to give GPs the symptom data they need',
                  'Privacy-first: your health data is never sold, always encrypted, and fully deletable',
                ].map((text) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(139,109,181,0.14)', border: '1px solid rgba(139,109,181,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="7" height="7" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="rgba(196,184,224,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {[
                { stat: 'CBT', label: 'techniques that may help some women manage hot flush distress' },
                { stat: 'Many', label: 'women find tracking helps them have more confident GP conversations' },
                { stat: 'NICE', label: 'guidelines and peer-reviewed research inform every feature' },
                { stat: '100%', label: 'of your data stays private — never sold, always deletable' },
              ].map(({ stat, label }) => (
                <div key={stat} style={{ flex: '1 1 160px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '20px 18px' }}>
                  <p style={{ fontFamily: PF, fontSize: 32, fontWeight: 300, color: 'rgba(196,184,224,0.85)', margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>{stat}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, margin: 0, fontWeight: 300 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(72px, 10vw, 112px) 32px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 400, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>FAQ</p>
          <h2 style={{ fontFamily: PF, fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 14 }}>
            Questions women actually ask
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            From what perimenopause actually is, to whether your symptoms are normal, to how to talk to a doctor who dismisses you.
          </p>
        </div>
        <MarketingFAQ />
      </section>

      <InstallBanner />

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '52px 32px', textAlign: 'center', marginTop: 'clamp(72px, 10vw, 112px)', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.75)', marginBottom: 22, letterSpacing: '-0.02em' }}>vida<span style={{ color: '#9b7cc8' }}>.</span></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px', justifyContent: 'center', marginBottom: 22 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Community', '/community']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 300, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
          &copy; 2026 Vida Wellness · Educational support only, not a substitute for medical advice.
          Always consult your healthcare provider for medical decisions.
        </p>
      </footer>
    </div>
  )
}
