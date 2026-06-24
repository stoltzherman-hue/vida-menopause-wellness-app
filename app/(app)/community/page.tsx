export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community · Vida' }

const CIRCLES = [
  {
    id: 'perimenopause-journey',
    initial: 'P',
    title: 'Perimenopause Journey',
    subtitle: 'Sharing experiences through the transition',
    members: '2,847',
    active: 23,
    accentColor: 'rgba(196,122,90,0.18)',
  },
  {
    id: 'hrt-treatment',
    initial: 'H',
    title: 'HRT & Treatment',
    subtitle: 'Questions, experiences and support',
    members: '1,923',
    active: 18,
    accentColor: 'rgba(139,109,181,0.18)',
  },
  {
    id: 'sleep-night-sweats',
    initial: 'S',
    title: 'Sleep & Night Sweats',
    subtitle: 'Tips for better rest',
    members: '1,456',
    active: 12,
    accentColor: 'rgba(196,184,224,0.14)',
  },
  {
    id: 'mind-mood',
    initial: 'M',
    title: 'Mind & Mood',
    subtitle: 'Mental wellbeing through menopause',
    members: '1,234',
    active: 9,
    accentColor: 'rgba(201,169,110,0.14)',
  },
]

export default async function CommunityPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: myProfile }] = await Promise.all([
    user
      ? supabase.from('community_profiles').select('username').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px',
        }}>Community Circles</p>

        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
          margin: '0 0 10px', letterSpacing: '-0.02em',
        }}>Find your people</h1>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6,
        }}>Join private topic circles with women at every stage</p>
      </div>

      {/* Profile setup CTA */}
      {user && !myProfile && (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div className="glass-violet" style={{
            borderRadius: 20, padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(139,109,181,0.14)',
              border: '1px solid rgba(139,109,181,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(196,184,224,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 400, color: 'rgba(255,255,255,0.82)', fontSize: 14, margin: 0, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Set up your community profile</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 300, marginTop: 3, margin: '3px 0 0', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Choose a username to start posting and connecting</p>
            </div>
          </div>
        </Link>
      )}

      {/* Circle cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CIRCLES.map((circle) => (
          <Link key={circle.id} href={`/community/${circle.id}`} style={{ textDecoration: 'none' }}>
            <div className="glass lift" style={{ borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>

              {/* Playfair initial instead of emoji */}
              <div style={{
                width: 50, height: 50, borderRadius: 15,
                background: circle.accentColor,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 22, fontWeight: 300,
                  color: 'rgba(255,255,255,0.62)',
                  lineHeight: 1,
                }}>{circle.initial}</span>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.82)',
                  margin: '0 0 3px',
                }}>{circle.title}</p>
                <p style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.35)',
                  margin: '0 0 6px', lineHeight: 1.4,
                }}>{circle.subtitle}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>{circle.members} members</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9b7cc8', display: 'inline-block', animation: 'dot-pulse 2s ease-in-out infinite' }} />
                    <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 11, fontWeight: 300, color: 'rgba(196,184,224,0.6)' }}>{circle.active} active now</span>
                  </span>
                </div>
              </div>

              {/* Chevron */}
              <div style={{ flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.18)', marginTop: 36, lineHeight: 1.6, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        Community is always free · Your health data stays completely private
      </p>
    </div>
  )
}
