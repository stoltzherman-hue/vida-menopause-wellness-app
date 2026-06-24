import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#09070e', position: 'relative', overflow: 'hidden' }}>

      {/* Top glow line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(139,109,181,0.35) 40%, rgba(196,184,224,0.2) 70%, transparent 100%)',
        pointerEvents: 'none', zIndex: 30,
      }} />

      {/* Ambient orb — violet top-left */}
      <div style={{
        position: 'fixed', top: '-160px', left: '-160px',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(122,82,176,0.16) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-a 22s ease-in-out infinite',
      }} />

      {/* Ambient orb — rose bottom-right */}
      <div style={{
        position: 'fixed', bottom: '-160px', right: '-160px',
        width: 780, height: 780,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,149,158,0.09) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-b 28s ease-in-out infinite',
      }} />

      {/* Ambient orb — lavender center */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%',
        width: 500, height: 500,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(155,138,184,0.08) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-c 20s ease-in-out infinite',
      }} />

      {/* Portrait watermark — global ambient layer */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '52%', height: '100%',
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        opacity: 0.08,
        maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 82%, transparent 100%)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.craiyon.com/2025-05-26/0f6O-Dn9Qrme3fztiJ5JmQ.webp"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* Desktop sidebar — hidden on mobile via CSS */}
      <DesktopSidebar />

      {/* Main content */}
      <main className="app-main" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </main>

      {/* Mobile bottom nav — hidden on desktop via CSS */}
      <div className="mobile-nav-wrap">
        <MobileNav />
      </div>
    </div>
  )
}
