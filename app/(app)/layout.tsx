import { AppShell } from '@/components/layout/AppShell'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', background: '#fdf8f4', padding: 32 }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>⚙️</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1220', marginBottom: 12 }}>Setup required</h1>
          <p style={{ fontSize: 15, color: '#6a5a6a', lineHeight: 1.7, marginBottom: 8 }}>
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
