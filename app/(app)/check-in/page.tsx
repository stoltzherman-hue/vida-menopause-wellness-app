import type { Metadata } from 'next'
import { CheckInForm } from '@/components/tracker/CheckInForm'

export const metadata: Metadata = { title: 'Daily Check-in · Vida' }

export default function CheckInPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: 0 }}>Daily Check-in</h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 15 }}>How are you doing today?</p>
      </div>
      <CheckInForm />
    </div>
  )
}
