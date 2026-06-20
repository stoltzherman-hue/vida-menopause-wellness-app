import { MobileNav } from './MobileNav'
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
      <MobileNav />
    </div>
  )
}
