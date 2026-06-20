import { AppShell } from '@/components/layout/AppShell'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')
  return <AppShell>{children}</AppShell>
}
