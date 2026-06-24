export const dynamic = 'force-dynamic'

import { AppShell } from '@/components/layout/AppShell'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: '#09070e', padding: 32 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(155,124,200,0.15)', border: '1px solid rgba(155,124,200,0.25)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 12 }}>Setup required</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 8 }}>
            Supabase environment variables are not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your Vercel project settings.
          </p>
        </div>
      </div>
    )
  }

  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createSupabaseServerClient()
  await supabase.from('user_profiles').select('onboarding_completed').eq('user_id', user.id).single()

  return <AppShell>{children}</AppShell>
}
