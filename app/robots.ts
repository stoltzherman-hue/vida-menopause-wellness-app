import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/learn/'],
      disallow: ['/api/', '/dashboard/', '/settings/', '/onboarding/'],
    },
    sitemap: 'https://www.vidaapp.co.za/sitemap.xml',
    host: 'https://www.vidaapp.co.za',
  }
}
