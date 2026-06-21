import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { ProfileForm } from '@/components/settings/ProfileForm'

export const metadata: Metadata = { title: 'Edit Profile · Vida' }

export default async function ProfilePage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, menopause_stage, date_of_birth, goals')
    .eq('user_id', user?.id ?? '')
    .single()

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 16px 100px' }}>
      <a href="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#8a7a72', marginBottom: 24, textDecoration: 'none' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Settings
      </a>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: '0 0 28px' }}>Edit Profile</h1>
      <ProfileForm
        email={user?.email ?? ''}
        displayName={profile?.display_name ?? ''}
        menopauseStage={profile?.menopause_stage ?? ''}
        dateOfBirth={profile?.date_of_birth ?? ''}
        goals={profile?.goals ?? []}
      />
    </div>
  )
}
