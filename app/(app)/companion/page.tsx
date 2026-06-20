import type { Metadata } from 'next'
import { CompanionChat } from '@/components/ai/CompanionChat'
export const metadata: Metadata = { title: 'AI Companion' }
export default function CompanionPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#2d3748]">AI Companion</h1>
        <p className="text-xs text-[#a0aec0] mt-1">Educational support only — not medical advice. Always consult your healthcare provider for medical decisions.</p>
      </div>
      <CompanionChat />
    </div>
  )
}
