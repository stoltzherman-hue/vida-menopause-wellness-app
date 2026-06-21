import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5', position: 'relative' }}>

      {/* Layered mesh gradient — vivid but calm */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 85% 70% at -8% -10%, rgba(45,139,122,0.28) 0%, transparent 55%)',
          'radial-gradient(ellipse 70% 60% at 110% 115%, rgba(155,138,184,0.22) 0%, transparent 52%)',
          'radial-gradient(ellipse 55% 45% at 58% 50%, rgba(184,169,201,0.10) 0%, transparent 50%)',
          'radial-gradient(ellipse 40% 32% at 88% 8%, rgba(201,169,110,0.10) 0%, transparent 46%)',
          'radial-gradient(ellipse 35% 28% at 18% 88%, rgba(196,122,90,0.08) 0%, transparent 44%)',
        ].join(', '),
      }} />

      {/* Subtle botanical watermark — portrait on right */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, right: 0,
        width: '40vw', maxWidth: 460,
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, #faf7f5 0%, rgba(250,247,245,0.5) 30%, transparent 65%)',
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80&auto=format&fit=crop&crop=top"
          alt="" aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: 0.32 }}
        />
      </div>

      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Main content */}
      <main className="app-main" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="mobile-nav-wrap">
        <MobileNav />
      </div>
    </div>
  )
}
