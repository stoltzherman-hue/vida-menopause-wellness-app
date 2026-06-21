import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fdf8f4',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient colour blobs */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 55% 38% at 12% 6%, rgba(107,158,128,0.10) 0%, transparent 58%)',
          'radial-gradient(ellipse 45% 32% at 85% 88%, rgba(196,149,158,0.09) 0%, transparent 52%)',
        ].join(', '),
      }} />

      {/* Woman portrait — fixed full-height right panel */}
      <div style={{
        position: 'fixed',
        right: '-4vw',
        top: 0,
        bottom: 0,
        width: '56vw',
        maxWidth: 560,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-woman.svg"
          alt=""
          aria-hidden="true"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.62,
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
