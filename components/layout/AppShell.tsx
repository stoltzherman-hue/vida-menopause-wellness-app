import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fdf8f4',
      position: 'relative',
    }}>
      {/* Ambient colour wash */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 50% 36% at 12% 6%, rgba(107,158,128,0.11) 0%, transparent 58%)',
          'radial-gradient(ellipse 42% 30% at 88% 90%, rgba(196,149,158,0.09) 0%, transparent 52%)',
        ].join(', '),
      }} />

      {/* Portrait watermark — right half, full height */}
      <div style={{
        position: 'fixed',
        top: 0, bottom: 0,
        right: 0,
        width: '52vw',
        maxWidth: 520,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* Soft left-edge fade so portrait blends into page */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, #fdf8f4 0%, transparent 28%)',
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85&auto=format&fit=crop&crop=top"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            opacity: 0.38,
          }}
        />
      </div>

      <main style={{ flex: 1, paddingBottom: 90, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
