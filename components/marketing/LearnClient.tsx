'use client'
import { useState } from 'react'
import Link from 'next/link'
import { TiltCard } from '@/components/ui/TiltCard'

interface Article {
  slug: string
  category: string
  title: string
  excerpt: string
  readTime: number
  icon: string
  color: string
  bg: string
}

interface Props { articles: Article[] }

const CATEGORIES = ['All', 'Understanding', 'Symptoms', 'Lifestyle', 'Treatment', 'Mental health']

export function LearnClient({ articles }: Props) {
  const [active, setActive] = useState('All')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered = active === 'All' ? articles : articles.filter((a) => a.category === active)

  return (
    <>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: '9px 20px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              background: active === cat ? '#1a1220' : 'rgba(237,224,216,0.55)',
              color: active === cat ? 'white' : '#6a5a6a',
              transition: 'all 0.18s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 80 }}>
        {filtered.map((article) => (
          <Link key={article.slug} href={`/learn/${article.slug}`} style={{ textDecoration: 'none' }}>
            <TiltCard className="learn-card" style={{ background: article.bg }} maxTilt={7} scale={1.02}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 32 }}>{article.icon}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: article.color, background: `${article.color}15`,
                  padding: '5px 11px', borderRadius: 9999,
                }}>
                  {article.category}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 18, fontWeight: 700, color: '#1a1220',
                lineHeight: 1.35, marginBottom: 10,
              }}>
                {article.title}
              </h3>
              <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.65, marginBottom: 18 }}>
                {article.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#b8a9a0', fontWeight: 500 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {article.readTime} min read
              </div>
            </TiltCard>
          </Link>
        ))}
      </div>

      {/* FAQ section */}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#1a1220',
          textAlign: 'center', marginBottom: 12,
        }}>
          Frequently asked questions
        </h2>
        <p style={{ textAlign: 'center', color: '#8a7a72', fontSize: 16, marginBottom: 44, lineHeight: 1.65 }}>
          Real answers to questions women ask most about menopause.
        </p>

        {LEARN_FAQS.map((faq, i) => (
          <div key={i} className={`faq-item${openFaq === i ? ' faq-open' : ''}`}>
            <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
              <span>{faq.q}</span>
              <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="faq-body">
              <p className="faq-answer">{faq.a}</p>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 15, color: '#8a7a72', marginBottom: 20 }}>Still have questions? Ask Vida — our AI companion.</p>
          <Link href="/signup" className="m-btn m-btn-primary" style={{ fontSize: 15, padding: '14px 36px' }}>
            Talk to Vida free
          </Link>
        </div>
      </div>
    </>
  )
}

const LEARN_FAQS = [
  {
    q: 'At what age does menopause typically start?',
    a: 'The average age of menopause in the UK and US is 51, but it can occur anywhere from the late 30s to late 50s. Perimenopause — the transition — typically begins 4–10 years earlier, so symptoms can start in the early-to-mid 40s. Early menopause (before 45) and premature ovarian insufficiency (before 40) affect roughly 5–8% of women and warrant prompt medical attention.',
  },
  {
    q: 'Can I still get pregnant during perimenopause?',
    a: 'Yes. Fertility declines during perimenopause but ovulation can still occur unpredictably. Contraception is recommended until 12 months after your last period (if over 50) or 24 months after (if under 50). Unplanned pregnancy in perimenopause is more common than most people realise.',
  },
  {
    q: 'Why do I feel so different to other women experiencing menopause?',
    a: 'Because menopause is genuinely different for every woman. Genetics, ethnicity, lifestyle, stress levels, weight, and prior health all influence the experience. Research shows Black women typically experience more severe and longer-lasting hot flushes; Asian women report them less frequently. There is no "normal" menopause — only your menopause.',
  },
  {
    q: 'What should I bring to a menopause appointment with my GP?',
    a: 'The most useful thing is a dated symptom log covering at least 4–6 weeks. Include: which symptoms occurred, their severity, what made them worse or better, sleep quality, mood, and any patterns you\'ve noticed. Vida automatically builds this record from your daily check-ins — you can use your logged history directly. Also note any family history of osteoporosis, heart disease, or hormone-sensitive cancers.',
  },
  {
    q: 'Are there non-hormonal treatments for hot flushes?',
    a: 'Yes. Several non-hormonal options have good evidence: certain antidepressants (SSRIs/SNRIs) at low doses, gabapentin, oxybutynin, and the newer neurokinin-3 receptor antagonists (like fezolinetant) specifically for hot flushes. Cognitive Behavioural Therapy (CBT) also has strong evidence for both hot flushes and menopause-related anxiety. Lifestyle changes — particularly reducing alcohol, caffeine, and stress — can also meaningfully reduce frequency.',
  },
  {
    q: 'How does Vida keep my health data private?',
    a: 'Your health data is encrypted at rest and in transit, never sold to third parties, and always deletable. Community identity is kept completely separate from your private health tracking — your symptom data is never linked to your public profile. You can export or delete all your data at any time from Settings.',
  },
]
