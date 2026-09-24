import { ImageResponse } from 'next/og'

export const alt = 'Vida menopause wellness companion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 86, background: 'linear-gradient(135deg, #09070e 0%, #211432 60%, #3a2148 100%)', color: 'white' }}>
      <div style={{ fontSize: 38, color: '#c4b8e0', marginBottom: 42 }}>vida.</div>
      <div style={{ fontSize: 70, lineHeight: 1.08, maxWidth: 920 }}>Understand what your body is doing.</div>
      <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.7)', marginTop: 30 }}>Menopause tracking, patterns and support — in one private place.</div>
    </div>,
    size,
  )
}
