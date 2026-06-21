import type { Metadata } from 'next'
import { ToolsClient } from '@/components/tools/ToolsClient'

export const metadata: Metadata = { title: 'Wellness Tools · Vida' }

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 100px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1220', margin: 0 }}>
          Wellness Tools
        </h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 15 }}>
          In-the-moment support — breathing, grounding, and hot flush guidance.
        </p>
      </div>

      <ToolsClient />
    </div>
  )
}
