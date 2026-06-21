export const dynamic = 'force-dynamic'

import { AppShell } from '@/components/layout/AppShell'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createSupabaseServerClient()
  await supabase.from('user_profiles').select('onboarding_completed').eq('user_id', user.id).single()

  return <AppShell>{children}</AppShell>
}
