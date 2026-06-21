import Link from 'next/link'
import { Heart, MessageCircle, Users, TrendingUp, Shield, Sparkles, ArrowRight, Activity } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Daily check-in',
    desc: 'Track symptoms, sleep, mood and triggers in under 2 minutes. See patterns emerge over time.',
    bg: 'linear-gradient(145deg, #fff7f3 0%, #fdf0e8 100%)',
    iconBg: 'rgba(196,122,90,0.12)',
    iconColor: '#c47a5a',
    accentColor: '#c47a5a',
  },
  {
    icon: TrendingUp,
    title: 'Pattern insights',
    desc: 'Understand what affects how you feel and why. 30-day trend charts that actually make sense.',
    bg: 'linear-gradient(145deg, #f2faf5 0%, #e8f4ec 100%)',
    iconBg: 'rgba(90,143,110,0.12)',
    iconColor: '#3d7a58',
    accentColor: '#3d7a58',
  },
  {
    icon: MessageCircle,
    title: 'AI companion',
    desc: 'A warm, evidence-informed coach — available any time. Supportive friend, wellness coach, or doctor prep mode.',
    bg: 'linear-gradient(145deg, #f4f0fc 0%, #ede8f8 100%)',
    iconBg: 'rgba(155,138,184,0.15)',
    iconColor: '#7b68aa',
    accentColor: '#7b68aa',
    premium: true,
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Forums and Circles with women at the exact same stage. Real conversations, zero judgment.',
    bg: 'linear-gradient(145deg, #e8f6f4 0%, #dff0ec 100%)',
    iconBg: 'rgba(45,139,122,0.12)',
    iconColor: '#2d8b7a',
    accentColor: '#2d8b7a',
  },
  {
    icon: Shield,
    title: 'Doctor prep',
    desc: 'Generate a clear symptom summary to bring to your appointment. Walk in feeling prepared and heard.',
    bg: 'linear-gradient(145deg, #fff7f3 0%, #fdf0e8 100%)',
    iconBg: 'rgba(196,122,90,0.12)',
    iconColor: '#c47a5a',
    accentColor: '#c47a5a',
    premium: true,
  },
  {
    icon: Sparkles,
    title: 'Privacy first',
    desc: 'Your health data is yours. Encrypted at rest, never sold, always deletable. No exceptions.',
    bg: 'linear-gradient(145deg, #fffbf0 0%, #fdf5e0 100%)',
    iconBg: 'rgba(201,169,110,0.14)',
    iconColor: '#a8843a',
    accentColor: '#a8843a',
  },
]

const stats = [
  { value: '12,000+', label: 'Women supported', icon: '👥' },
  { value: '4.9 ★', label: 'Average rating', icon: '⭐' },
  { value: '98%', label: 'Feel less alone', icon: '💚' },
  { value: 'Free', label: 'To get started', icon: '🎁' },
]

export default function MarketingHomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>

      {/* ── Navigation ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="m-nav-glass">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 26, fontWeight: 700, color: '#1a1220', letterSpacing: '-0.03em',
            }}>
              vida<span style={{ color: '#3d7a58' }}>.</span>
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
        minHeight: 'calc(100vh - 68px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 28px 100px',
        overflow: 'hidden',
      }}>
        {/* Background layers */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 100% 80% at 50% -25%, rgba(45,139,122,0.20) 0%, transparent 62%)',
            'radial-gradient(ellipse 70% 60% at 92% 115%, rgba(155,138,184,0.18) 0%, transparent 58%)',
            'radial-gradient(ellipse 50% 40% at 6% 90%, rgba(201,169,110,0.12) 0%, transparent 52%)',
            '#faf7f5',
          ].join(', '),
        }} />

        {/* Botanical portrait — right side, ethereal */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '48%',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to right, #faf7f5 0%, rgba(250,247,245,0.6) 28%, transparent 60%), linear-gradient(to top, #faf7f5 0%, transparent 30%)',
          }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80&auto=format&fit=crop&crop=top"
            alt="" aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: 0.50 }}
          />
        </div>

        {/* Decorative rings */}
        {[680, 500, 340].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: size, height: size,
            border: `1px solid rgba(45,139,122,${0.07 - i * 0.02})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -68%)',
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', maxWidth: 780, textAlign: 'center', zIndex: 2 }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            background: 'rgba(45,139,122,0.08)',
            border: '1px solid rgba(45,139,122,0.20)',
            borderRadius: 9999, padding: '9px 20px', marginBottom: 48,
          }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2e6044', letterSpacing: '-0.01em' }}>
              Trusted by 12,000+ women navigating menopause
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(44px, 6.5vw, 76px)',
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.035em', color: '#1a1220',
            marginBottom: 28,
          }}>
            You deserve to understand<br />
            <span className="gradient-text">what your body is doing.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(17px, 2vw, 20px)', color: '#6a5a62',
            maxWidth: 560, margin: '0 auto 52px', lineHeight: 1.75,
          }}>
            Vida is a wellness companion for women navigating perimenopause and menopause —
            combining community, symptom tracking, and an AI coach that actually <em>gets it</em>.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 40 }}>
            <Link href="/signup" className="m-btn m-btn-primary" style={{ fontSize: 16, padding: '17px 44px' }}>
              Start for free <ArrowRight size={17} />
            </Link>
            <Link href="/community" className="m-btn m-btn-outline" style={{ fontSize: 16, padding: '16px 40px' }}>
              Explore community
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#c0b4ac', letterSpacing: '0.01em' }}>
            Community is always free &middot; No credit card required
          </p>
        </div>
      </section>

      {/* ── Stats strip — inspired by the wellness product grid ── */}
      <div style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(90,143,110,0.10)',
        borderBottom: '1px solid rgba(90,143,110,0.10)',
        padding: '0 28px',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 0,
        }}>
          {stats.map(({ value, label, icon }, i) => (
            <div key={label} style={{
              textAlign: 'center',
              padding: '36px 24px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(90,143,110,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 32, fontWeight: 800, color: '#1a1220',
                lineHeight: 1, margin: 0, letterSpacing: '-0.03em',
              }}>{value}</p>
              <p style={{ fontSize: 13, color: '#9a8a92', marginTop: 6, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '110px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 76 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(45,139,122,0.08)', border: '1px solid rgba(45,139,122,0.16)',
            borderRadius: 99, padding: '7px 18px', marginBottom: 20,
          }}>
            <Activity size={13} color="#2d8b7a" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built for you</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(30px, 4.5vw, 52px)',
            fontWeight: 700, color: '#1a1220',
            letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 18,
          }}>
            Everything you need in one place
          </h2>
          <p style={{ color: '#6a5a62', fontSize: 18, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Built specifically for perimenopause and menopause — because generic wellness apps miss the point.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 18 }}>
          {features.map(({ icon: Icon, title, desc, bg, iconBg, iconColor, accentColor, premium }) => (
            <div key={title} className="m-feature-card" style={{ background: bg }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{
                  background: iconBg, borderRadius: 18, padding: 14,
                  display: 'inline-flex',
                  boxShadow: `0 4px 20px ${iconColor}22`,
                }}>
                  <Icon size={22} style={{ color: iconColor }} strokeWidth={1.8} />
                </div>
                {premium && (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    background: 'rgba(201,169,110,0.12)',
                    color: '#a8843a',
                    border: '1px solid rgba(201,169,110,0.24)',
                    borderRadius: 9999, padding: '5px 12px', letterSpacing: '0.02em',
                  }}>Premium</span>
                )}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontWeight: 700, fontSize: 21, color: '#1a1220',
                marginBottom: 12, letterSpacing: '-0.02em',
              }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#7a6a72', lineHeight: 1.75 }}>{desc}</p>
              <div style={{ marginTop: 20, height: 3, borderRadius: 99, background: `${accentColor}22`, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '65%', background: accentColor, borderRadius: 99, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial — deep plum with glowing accents ── */}
      <section style={{ padding: '0 28px 0', marginBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(155deg, #1a1220 0%, #2e1a2a 40%, #1e2a28 100%)',
            borderRadius: 44,
            padding: 'clamp(52px, 8vw, 88px) clamp(32px, 8vw, 100px)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
            boxShadow: '0 40px 120px rgba(26,18,32,0.40)',
          }}>
            {/* Glowing orbs */}
            <div style={{ position: 'absolute', top: -90, right: -90, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,139,122,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -70, left: -70, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,138,184,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '35%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Grid pattern overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />

            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(45,139,122,0.15)', border: '1px solid rgba(45,139,122,0.28)',
                borderRadius: 99, padding: '8px 20px', marginBottom: 36,
              }}>
                <span style={{ fontSize: 14 }}>🌿</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7dcca0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Real story</span>
              </div>

              <blockquote style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(20px, 3vw, 30px)',
                color: 'rgba(255,255,255,0.90)',
                lineHeight: 1.55, fontStyle: 'italic',
                maxWidth: 700, margin: '0 auto 48px',
                letterSpacing: '-0.01em',
              }}>
                &ldquo;For the first time I feel like someone actually understands what I&apos;m going through.
                Vida helped me track my patterns and finally have a proper conversation with my doctor.&rdquo;
              </blockquote>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3d7a58 0%, #9b8ab8 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 18,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                }}>S</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>Sarah, 51</p>
                  <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, marginTop: 3 }}>Perimenopause · 8 months with Vida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '110px 28px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(45,139,122,0.08)', border: '1px solid rgba(45,139,122,0.16)',
          borderRadius: 99, padding: '7px 18px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pricing</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700, color: '#1a1220',
          letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 16,
        }}>
          Simple, honest pricing
        </h2>
        <p style={{ color: '#6a5a62', fontSize: 17, marginBottom: 60, lineHeight: 1.7 }}>
          Community is always free. Premium unlocks your AI companion, advanced insights, and more.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, textAlign: 'left' }}>
          {/* Free */}
          <div style={{
            background: 'rgba(255,255,255,0.80)',
            border: '1.5px solid rgba(90,143,110,0.14)',
            borderRadius: 36, padding: '38px 36px',
            boxShadow: '0 2px 24px rgba(42,30,38,0.06)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#b0a0a8', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 12 }}>Free forever</p>
            <p style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 56, fontWeight: 800, color: '#1a1220', lineHeight: 1, marginBottom: 6,
              letterSpacing: '-0.04em',
            }}>$0</p>
            <p style={{ fontSize: 14, color: '#b0a0a8', marginBottom: 36 }}>No card needed</p>
            <ul style={{ listStyle: 'none', marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Community forums & Circles', 'Daily symptom check-in', 'Basic symptom history', 'Limited AI messages'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#4a3a42' }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(90,143,110,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: '#3d7a58', fontWeight: 800, fontSize: 11,
                  }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="m-btn m-btn-outline" style={{ width: '100%', fontSize: 15, padding: '15px 20px', borderRadius: 18 }}>
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div style={{
            background: 'linear-gradient(155deg, #1a1220 0%, #2e1a2a 45%, #1e2a28 100%)',
            borderRadius: 36, padding: '38px 36px',
            boxShadow: '0 20px 72px rgba(26,18,32,0.45)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,139,122,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,138,184,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.10em', margin: 0 }}>Premium</p>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'rgba(201,169,110,0.22)',
                  color: '#c9a96e',
                  border: '1px solid rgba(201,169,110,0.35)',
                  borderRadius: 9999, padding: '5px 14px',
                }}>Most popular</span>
              </div>
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 56, fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 6,
                letterSpacing: '-0.04em',
              }}>$12.99</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.30)', marginBottom: 36 }}>per month · cancel any time</p>
              <ul style={{ listStyle: 'none', marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Everything in Free', 'Unlimited AI companion', 'All 3 conversation modes', 'Advanced pattern insights', 'Doctor visit reports', 'Personalised wellness plan'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.78)' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(90,143,110,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: '#7dcca0', fontWeight: 800, fontSize: 11,
                    }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="m-btn" style={{
                width: '100%', fontSize: 15, padding: '16px 20px',
                background: 'white', color: '#1a1220', borderRadius: 18,
                fontWeight: 700, boxShadow: '0 6px 28px rgba(0,0,0,0.28)',
                justifyContent: 'center',
              }}>
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(90,143,110,0.10)', padding: '56px 28px', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 30, fontWeight: 700, color: '#1a1220', marginBottom: 24,
          letterSpacing: '-0.03em',
        }}>vida<span style={{ color: '#3d7a58' }}>.</span></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px', justifyContent: 'center', marginBottom: 24 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Community', '/community']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 14, color: '#b8a9a0', transition: 'color 0.2s' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#ccc0bb', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
          &copy; 2026 Vida Wellness &middot; Educational support only, not a substitute for medical advice.
          Always consult your healthcare provider for medical decisions.
        </p>
      </footer>
    </div>
  )
}
