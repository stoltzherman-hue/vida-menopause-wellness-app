import type { Metadata } from 'next'
import Link from 'next/link'
import { LearnClient } from '@/components/marketing/LearnClient'

export const metadata: Metadata = {
  title: 'Menopause Knowledge Hub · Vida',
  description: 'Evidence-informed guides, symptom explainers, and expert answers to the questions women are actually asking about perimenopause and menopause.',
}

const articles = [
  {
    slug: 'what-is-perimenopause',
    category: 'Understanding',
    title: 'What is perimenopause? The complete guide',
    excerpt: 'Perimenopause can begin a decade before your last period. Here\'s what\'s actually happening hormonally, what to expect, and when to seek support.',
    readTime: 8,
    icon: 'P',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'hot-flushes-night-sweats',
    category: 'Symptoms',
    title: 'Hot flushes and night sweats: what\'s happening and what helps',
    excerpt: 'Why your thermostat feels broken, what triggers make them worse, and the full range of options — lifestyle through to hormonal and non-hormonal treatments.',
    readTime: 6,
    icon: 'H',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'menopause-brain-fog',
    category: 'Symptoms',
    title: 'Menopause and brain fog: what\'s actually happening',
    excerpt: 'Forgetting words mid-sentence, walking into a room and blanking — brain fog is one of the most distressing and least-discussed symptoms. Here\'s the science.',
    readTime: 5,
    icon: 'B',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'sleep-and-menopause',
    category: 'Symptoms',
    title: 'Sleep and menopause: why it changes and what actually helps',
    excerpt: 'Multiple mechanisms disrupt sleep during perimenopause and beyond. Understanding which ones affect you most is the first step to fixing them.',
    readTime: 7,
    icon: 'S',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'mood-anxiety-menopause',
    category: 'Mental health',
    title: 'The mood rollercoaster: anxiety, low mood and irritability',
    excerpt: 'Oestrogen plays a direct role in serotonin regulation. When it fluctuates, your mood follows. This is hormonal — not a character flaw.',
    readTime: 6,
    icon: 'M',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'exercise-menopause',
    category: 'Lifestyle',
    title: 'Exercise during menopause: what the evidence says',
    excerpt: 'Strength training, yoga, and cardio each play different roles. Here\'s the evidence on which types of movement help most with specific symptoms.',
    readTime: 5,
    icon: 'E',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'nutrition-menopause',
    category: 'Lifestyle',
    title: 'Nutrition and menopause: foods that support you',
    excerpt: 'From phytoestrogens to calcium, omega-3s to ultra-processed foods — what the research actually supports and what\'s marketing noise.',
    readTime: 7,
    icon: 'N',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'talking-to-your-doctor',
    category: 'Treatment',
    title: 'How to talk to your doctor about menopause',
    excerpt: 'Many women leave appointments feeling dismissed. Here\'s how to prepare, what to bring, what questions to ask, and how to advocate for yourself.',
    readTime: 6,
    icon: 'T',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'hrt-common-questions',
    category: 'Treatment',
    title: 'HRT: the most common questions, answered clearly',
    excerpt: 'The evidence on hormone replacement therapy has shifted significantly in the last decade. Here\'s what we know now about safety, types, and who it helps most.',
    readTime: 9,
    icon: 'H',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'bone-health-menopause',
    category: 'Understanding',
    title: 'Bone health and menopause: what you need to know',
    excerpt: 'Bone density loss accelerates in the years around menopause. The good news: there\'s a lot you can do, and it\'s never too early to start.',
    readTime: 5,
    icon: 'B',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'vaginal-health-menopause',
    category: 'Symptoms',
    title: 'Vaginal and sexual health during menopause',
    excerpt: 'Genitourinary syndrome of menopause (GSM) affects over half of women and is very treatable — but rarely discussed. Here\'s what helps.',
    readTime: 5,
    icon: 'V',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
  },
  {
    slug: 'heart-health-menopause',
    category: 'Understanding',
    title: 'Heart health and menopause: the link women aren\'t told about',
    excerpt: 'Oestrogen has a protective effect on the cardiovascular system. After menopause, heart disease risk rises. Here\'s what to watch for and how to protect yourself.',
    readTime: 6,
    icon: 'H',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
  },
]

export default function LearnPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09070e', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(24px)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
              vida<span style={{ color: '#9b7cc8' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/learn" style={{ fontSize: 14, fontWeight: 300, color: '#9b7cc8', padding: '8px 14px' }}>Learn</Link>
              <Link href="/login" className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(52px, 7vw, 88px) 32px clamp(40px, 5vw, 60px)',
      }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(155,124,200,0.09)', border: '1px solid rgba(155,124,200,0.2)',
            borderRadius: 9999, padding: '7px 16px', marginBottom: 28,
          }}>
            <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Evidence-informed · Written for women</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20,
          }}>
            Everything you need to know<br />
            <span className="gradient-text">about your menopause.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 560, marginBottom: 36 }}>
            Clear, honest guides written for women navigating perimenopause and menopause —
            grounded in current evidence, not generalisations.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/signup" className="m-btn m-btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
              Track your symptoms free
            </Link>
            <Link href="/community" className="m-btn m-btn-outline" style={{ fontSize: 15, padding: '12px 28px' }}>
              Join the community
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats strip */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.09)', borderBottom: '1px solid rgba(255,255,255,0.09)',
        padding: '22px 32px', marginBottom: 0,
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '12px 40px', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { n: '12', label: 'In-depth guides' },
            { n: '47', label: 'Symptoms covered' },
            { n: '9', label: 'FAQ questions answered' },
            { n: '100%', label: 'Free to read' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', display: 'block', lineHeight: 1.2 }}>{n}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', fontWeight: 300 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Article grid + FAQ (client for filter tabs) */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) 32px 80px' }}>
        <LearnClient articles={articles} />
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.09)', padding: '40px 32px', textAlign: 'center' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', display: 'block', marginBottom: 12, textDecoration: 'none' }}>
          vida<span style={{ color: '#9b7cc8' }}>.</span>
        </Link>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
          Content on this site is educational and does not constitute medical advice.
          Always discuss symptoms and treatment options with a qualified healthcare provider.
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 24 }}>
          © 2026 Vida Health Ltd · <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.32)' }}>Privacy</Link> · <Link href="/terms" style={{ color: 'rgba(255,255,255,0.32)' }}>Terms</Link>
        </p>
      </footer>
    </div>
  )
}
