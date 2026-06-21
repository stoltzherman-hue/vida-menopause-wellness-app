import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fdf8f4' }} className="blob-bg">
      <main style={{ flex: 1, paddingBottom: 90 }}>{children}</main>
      <MobileNav />
    </div>
  )
}
