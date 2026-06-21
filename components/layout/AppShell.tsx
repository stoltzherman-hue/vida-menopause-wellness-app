import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ef', position: 'relative' }}>

      {/* Deep multi-layer mesh gradient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 90% 70% at -8% -8%, rgba(45,139,122,0.38) 0%, transparent 55%)',
          'radial-gradient(ellipse 70% 60% at 108% 112%, rgba(196,149,158,0.32) 0%, transparent 52%)',
          'radial-gradient(ellipse 55% 50% at 58% 55%, rgba(155,138,184,0.16) 0%, transparent 50%)',
          'radial-gradient(ellipse 48% 40% at 88% 10%, rgba(201,169,110,0.13) 0%, transparent 48%)',
          'radial-gradient(ellipse 40% 35% at 20% 80%, rgba(196,122,90,0.09) 0%, transparent 45%)',
        ].join(', '),
      }} />

      {/* Subtle noise texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.018,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
      }} />

      {/* Portrait watermark — right side */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, right: 0,
        width: '38vw', maxWidth: 440,
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, #f7f3ef 0%, rgba(247,243,239,0.55) 32%, transparent 62%)',
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85&auto=format&fit=crop&crop=top"
          alt="" aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: 0.35 }}
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
