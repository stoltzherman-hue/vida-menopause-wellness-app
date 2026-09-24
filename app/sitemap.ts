import type { MetadataRoute } from 'next'

const articles = [
  'what-is-perimenopause',
  'hot-flushes-night-sweats',
  'menopause-brain-fog',
  'sleep-and-menopause',
  'mood-anxiety-menopause',
  'exercise-menopause',
  'nutrition-menopause',
  'talking-to-your-doctor',
  'hrt-common-questions',
  'bone-health-menopause',
  'vaginal-health-menopause',
  'heart-health-menopause',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.vidaapp.co.za'
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/learn`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...articles.map((slug) => ({ url: `${base}/learn/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
