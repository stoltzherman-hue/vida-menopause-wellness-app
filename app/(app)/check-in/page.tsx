import type { Metadata } from 'next'
import { CheckInForm } from '@/components/tracker/CheckInForm'
export const metadata: Metadata = { title: 'Daily Check-in' }
export default function CheckInPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]">Daily Check-in</h1>
        <p className="text-[#718096] mt-1">How are you doing today?</p>
      </div>
      <CheckInForm />
    </div>
  )
}
