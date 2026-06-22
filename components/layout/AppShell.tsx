import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', position: 'relative' }}>

      {/* Ambient orb — sage top-left */}
      <div style={{
        position: 'fixed', top: '-120px', left: '-120px',
        width: 680, height: 680,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,158,128,0.21) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-a 22s ease-in-out infinite',
      }} />

      {/* Ambient orb — rose bottom-right */}
      <div style={{
        position: 'fixed', bottom: '-140px', right: '-140px',
        width: 760, height: 760,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,149,158,0.17) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-b 28s ease-in-out infinite',
      }} />

      {/* Ambient orb — lavender center */}
      <div style={{
        position: 'fixed', top: '38%', left: '44%',
        width: 460, height: 460,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(155,138,184,0.10) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'orb-c 20s ease-in-out infinite',
      }} />

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
