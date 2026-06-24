import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { redirect } from 'next/navigation'
import { ProfileSetupClient } from '@/components/community/ProfileSetupClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Community Profile · Vida' }

export default async function CommunitySetupPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('community_profiles')
    .select('username')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) redirect('/community')

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('display_name, menopause_stage')
    .eq('user_id', user.id)
    .maybeSingle()

  const suggestedName = (userProfile?.display_name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 28)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 16px 100px' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #9b7cc8, #7a52b0)', margin: '0 auto 12px' }} />
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 26,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          marginTop: 0,
          marginBottom: 6,
        }}>Join the community</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>
          Choose how you&apos;ll appear to other members. Your health data always stays private.
        </p>
      </div>
      <ProfileSetupClient
        suggestedName={suggestedName}
        stage={userProfile?.menopause_stage ?? ''}
      />
    </div>
  )
}
