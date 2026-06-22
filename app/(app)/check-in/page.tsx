export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { CheckInForm } from '@/components/tracker/CheckInForm'

export const metadata: Metadata = { title: 'Daily Check-in · Vida' }

export default function CheckInPage() {
  return (
    <div style={{ minHeight: '100%' }}>
      <CheckInForm />
    </div>
  )
}
