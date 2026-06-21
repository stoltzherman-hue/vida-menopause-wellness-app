import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', position: 'relative' }}>

      {/* Mesh gradient background — strong enough to show through glass cards */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 80% 65% at -5% -5%, rgba(107,158,128,0.45) 0%, transparent 58%)',
          'radial-gradient(ellipse 65% 55% at 105% 108%, rgba(196,149,158,0.38) 0%, transparent 54%)',
          'radial-gradient(ellipse 50% 45% at 55% 52%, rgba(184,169,201,0.18) 0%, transparent 52%)',
          'radial-gradient(ellipse 45% 38% at 85% 12%, rgba(201,169,110,0.14) 0%, transparent 48%)',
        ].join(', '),
      }} />

      {/* Portrait watermark */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, right: 0,
        width: '42vw', maxWidth: 480,
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, #fdf8f4 0%, rgba(253,248,244,0.4) 35%, transparent 60%)',
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85&auto=format&fit=crop&crop=top"
          alt="" aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: 0.42 }}
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
