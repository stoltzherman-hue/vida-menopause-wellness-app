export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Learn · Vida' }

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

const ALL_ARTICLES = [
  {
    slug: 'what-is-perimenopause',
    category: 'Understanding',
    title: 'What is perimenopause? The complete guide',
    excerpt: 'Perimenopause can begin a decade before your last period. Here\'s what\'s actually happening hormonally, what to expect, and when to seek support.',
    readTime: 8,
    tags: ['perimenopause', 'unsure', 'overview'],
    color: '#9b7cc8',
  },
  {
    slug: 'hot-flushes-night-sweats',
    category: 'Symptoms',
    title: 'Hot flushes and night sweats: what\'s happening and what helps',
    excerpt: 'Why your thermostat feels broken, what triggers make them worse, and the full range of options — lifestyle through to hormonal treatments.',
    readTime: 6,
    tags: ['hot_flushes', 'hot flushes', 'night sweats', 'vasomotor'],
    color: '#e07a5f',
  },
  {
    slug: 'menopause-brain-fog',
    category: 'Symptoms',
    title: 'Menopause and brain fog: what\'s actually happening',
    excerpt: 'Forgetting words mid-sentence, walking into a room and blanking — brain fog is one of the most distressing and least-discussed symptoms.',
    readTime: 5,
    tags: ['brain_fog', 'brain fog', 'memory', 'cognitive'],
    color: '#9b7cc8',
  },
  {
    slug: 'sleep-and-menopause',
    category: 'Symptoms',
    title: 'Sleep and menopause: why it changes and what actually helps',
    excerpt: 'Multiple mechanisms disrupt sleep during perimenopause and beyond. Understanding which ones affect you most is the first step.',
    readTime: 7,
    tags: ['sleep', 'improve_sleep', 'insomnia', 'fatigue'],
    color: '#c4b8e0',
  },
  {
    slug: 'mood-anxiety-menopause',
    category: 'Mental health',
    title: 'The mood rollercoaster: anxiety, low mood and irritability',
    excerpt: 'Oestrogen plays a direct role in serotonin regulation. When it fluctuates, your mood follows. This is hormonal — not a character flaw.',
    readTime: 6,
    tags: ['anxiety', 'mood', 'support_mood', 'irritability', 'depression'],
    color: '#9b7cc8',
  },
  {
    slug: 'exercise-menopause',
    category: 'Lifestyle',
    title: 'Exercise during menopause: what the evidence says',
    excerpt: 'Strength training, yoga, and cardio each play different roles. Here\'s the evidence on which movement types help most with specific symptoms.',
    readTime: 5,
    tags: ['exercise', 'lifestyle', 'weight', 'manage_weight'],
    color: '#6b9e80',
  },
  {
    slug: 'nutrition-menopause',
    category: 'Lifestyle',
    title: 'Nutrition and menopause: foods that support you',
    excerpt: 'From phytoestrogens to calcium, omega-3s to ultra-processed foods — what the research actually supports and what\'s marketing noise.',
    readTime: 7,
    tags: ['nutrition', 'diet', 'weight', 'bone_health'],
    color: '#6b9e80',
  },
  {
    slug: 'talking-to-your-doctor',
    category: 'Treatment',
    title: 'How to talk to your doctor about menopause',
    excerpt: 'Many women leave appointments feeling dismissed. Here\'s how to prepare, what questions to ask, and how to advocate for yourself.',
    readTime: 6,
    tags: ['doctor', 'doctor_communication', 'appointment', 'advocacy'],
    color: '#c4b8e0',
  },
  {
    slug: 'hrt-common-questions',
    category: 'Treatment',
    title: 'HRT: the most common questions, answered clearly',
    excerpt: 'The evidence on hormone replacement therapy has shifted significantly in the last decade. Here\'s what we know now about safety and who it helps most.',
    readTime: 9,
    tags: ['hrt', 'hormones', 'treatment', 'considering', 'yes_hrt'],
    color: '#9b7cc8',
  },
  {
    slug: 'bone-health-menopause',
    category: 'Understanding',
    title: 'Bone health and menopause: what you need to know',
    excerpt: 'Bone density loss accelerates in the years around menopause. The good news: there\'s a lot you can do, and it\'s never too early to start.',
    readTime: 5,
    tags: ['bone_health', 'osteoporosis'],
    color: '#c4b8e0',
  },
  {
    slug: 'vaginal-health-menopause',
    category: 'Symptoms',
    title: 'Vaginal and sexual health during menopause',
    excerpt: 'Genitourinary syndrome of menopause affects over half of women and is very treatable — but rarely discussed. Here\'s what helps.',
    readTime: 5,
    tags: ['vaginal', 'sexual_health', 'sexual health', 'GSM'],
    color: '#c4959e',
  },
  {
    slug: 'heart-health-menopause',
    category: 'Understanding',
    title: 'Heart health and menopause: the link women aren\'t told about',
    excerpt: 'Oestrogen has a protective effect on the cardiovascular system. After menopause, heart disease risk rises. Here\'s what to watch for.',
    readTime: 6,
    tags: ['heart_health', 'cardiovascular', 'heart'],
    color: '#c47a5a',
  },
]

const CATEGORIES = ['All', 'Understanding', 'Symptoms', 'Mental health', 'Lifestyle', 'Treatment']

function getRecommended(
  symptoms: string[],
  goals: string[],
  stage: string | null,
  hrtStatus: string | null,
): typeof ALL_ARTICLES {
  const userTokens = [...symptoms, ...goals, stage ?? '', hrtStatus ?? '']
    .map((t) => t.toLowerCase().replace(/_/g, ' '))

  const scored = ALL_ARTICLES.map((a) => {
    const matches = a.tags.filter((tag) =>
      userTokens.some((ut) => ut.includes(tag.toLowerCase()) || tag.toLowerCase().includes(ut))
    ).length
    return { article: a, score: matches }
  })

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ article }) => article)
}

export default async function LearnPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  let recommended: typeof ALL_ARTICLES = []

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('primary_symptoms, goals, menopause_stage, hrt_status')
      .eq('user_id', user.id)
      .maybeSingle()

    recommended = getRecommended(
      profile?.primary_symptoms ?? [],
      profile?.goals ?? [],
      profile?.menopause_stage ?? null,
      profile?.hrt_status ?? null,
    )
  }

  const hasRecommendations = recommended.length > 0


  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Evidence-informed guides
        </p>
        <h1 style={{ fontFamily: PF, fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Everything about your menopause
        </h1>
        <p style={{ fontFamily: DM, fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.65 }}>
          Clear, honest guides — grounded in current evidence, not generalisations.
        </p>
      </div>

      {/* Personalised recommendations */}
      {hasRecommendations && (
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Recommended for you
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommended.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'rgba(155,124,200,0.06)',
                  border: '1px solid rgba(155,124,200,0.16)',
                  borderRadius: 18, padding: '18px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  cursor: 'pointer',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 5px' }}>
                      {article.category} · {article.readTime} min read
                    </p>
                    <p style={{ fontFamily: PF, fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                      {article.title}
                    </p>
                    <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>
                      {article.excerpt}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(155,124,200,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All articles */}
      <div>
        <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 14px' }}>
          All guides
        </p>

        {CATEGORIES.filter(c => c !== 'All').map((cat) => {
          const catArticles = ALL_ARTICLES.filter((a) => a.category === cat)
          if (catArticles.length === 0) return null
          return (
            <div key={cat} style={{ marginBottom: 28 }}>
              <p style={{
                fontFamily: DM, fontSize: 10, fontWeight: 400,
                color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
                letterSpacing: '0.1em', margin: '0 0 10px',
              }}>
                {cat}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {catArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: 14,
                      gap: 16, cursor: 'pointer',
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: PF, fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.78)', margin: '0 0 3px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                          {article.title}
                        </p>
                        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                          {article.readTime} min read
                        </p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 40, lineHeight: 1.7 }}>
        All content is educational and does not constitute medical advice.
        Always discuss symptoms and treatment with a qualified healthcare provider.
      </p>
    </div>
  )
}
