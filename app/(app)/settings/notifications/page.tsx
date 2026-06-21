export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { NotificationPreferences } from '@/components/settings/NotificationPreferences'

export const metadata: Metadata = { title: 'Notifications · Vida' }

export default function NotificationsPage() {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 16px 100px' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: '0 0 6px' }}>
        Notifications
      </h1>
      <p style={{ fontSize: 14, color: '#8a7a72', margin: '0 0 28px' }}>
        Choose what Vida reminds you about, and when.
      </p>
      <NotificationPreferences />
    </div>
  )
}
