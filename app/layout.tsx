import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vidaapp.co.za'),
  title: { default: 'Vida | Menopause Symptom Tracker & Wellness Companion', template: '%s | Vida' },
  description: 'Track menopause and perimenopause symptoms, spot personal patterns, prepare for healthcare appointments, and find supportive community with Vida.',
  applicationName: 'Vida',
  alternates: { canonical: '/' },
  keywords: ['menopause symptom tracker', 'perimenopause tracker', 'menopause support South Africa', 'menopause wellness'],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: '/',
    siteName: 'Vida',
    title: 'Vida | Understand your menopause patterns',
    description: 'A private menopause and perimenopause wellness companion for symptom tracking, pattern insights, community, and appointment preparation.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vida | Understand your menopause patterns',
    description: 'Track symptoms, spot patterns, and feel better prepared for your next healthcare conversation.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vida',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6b9e80',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vida',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    url: 'https://www.vidaapp.co.za',
    description: 'A menopause and perimenopause wellness companion for symptom tracking, pattern insights, community, and appointment preparation.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' },
  }

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
