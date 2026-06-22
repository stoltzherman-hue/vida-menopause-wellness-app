export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community · Vida' }

const CIRCLES = [
  {
    id: 'perimenopause-journey',
    emoji: '🌸',
    title: 'Perimenopause Journey',
    subtitle: 'Sharing experiences through the transition',
    members: '2,847',
    active: 23,
    emojiBg: 'rgba(196,122,90,0.12)',
  },
  {
    id: 'hrt-treatment',
    emoji: '💊',
    title: 'HRT & Treatment',
    subtitle: 'Questions, experiences and support',
    members: '1,923',
    active: 18,
    emojiBg: 'rgba(45,139,122,0.12)',
  },
  {
    id: 'sleep-night-sweats',
    emoji: '🌙',
    title: 'Sleep & Night Sweats',
    subtitle: 'Tips for better rest',
    members: '1,456',
    active: 12,
    emojiBg: 'rgba(155,138,184,0.12)',
  },
  {
    id: 'mind-mood',
    emoji: '🧠',
    title: 'Mind & Mood',
    subtitle: 'Mental wellbeing through menopause',
    members: '1,234',
    active: 9,
    emojiBg: 'rgba(201,169,110,0.12)',
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

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 700, color: '#2d8b7a',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px',
        }}>COMMUNITY CIRCLES</p>

        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 28, fontWeight: 700, color: '#1a1220',
          margin: '0 0 10px',
        }}>Find your people</h1>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, color: '#b8a9a0', margin: 0, lineHeight: 1.6,
        }}>Join private topic circles with women at every stage</p>
      </div>

      {/* ── Profile setup CTA ── */}
      {user && !myProfile && (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45,139,122,0.08) 0%, rgba(155,138,184,0.06) 100%)',
            border: '1.5px solid rgba(45,139,122,0.22)',
            borderRadius: 20, padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(45,139,122,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#1e3d35', fontSize: 15, margin: 0 }}>Set up your community profile</p>
              <p style={{ color: '#4a7a6a', fontSize: 13, marginTop: 3, margin: '3px 0 0' }}>Choose a username to start posting and connecting →</p>
            </div>
          </div>
        </Link>
      )}

      {/* ── Circle cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CIRCLES.map((circle) => (
          <Link
            key={circle.id}
            href={`/community/${circle.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="glass lift"
              style={{
                borderRadius: 20, padding: 20,
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              {/* Emoji tile */}
              <div style={{
                width: 50, height: 50, borderRadius: 15,
                background: circle.emojiBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 24,
              }}>
                {circle.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 15, fontWeight: 600, color: '#1a1220',
                  margin: '0 0 3px',
                }}>{circle.title}</p>
                <p style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 13, color: '#b8a9a0',
                  margin: '0 0 6px', lineHeight: 1.4,
                }}>{circle.subtitle}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontSize: 12, color: '#b8a9a0',
                  }}>{circle.members} members</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#4aad90',
                      display: 'inline-block',
                      animation: 'dot-pulse 2s ease-in-out infinite',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                      fontSize: 12, color: '#4aad90', fontWeight: 600,
                    }}>{circle.active} active now</span>
                  </span>
                </div>
              </div>

              {/* Chevron */}
              <div style={{ flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4b5ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{
        textAlign: 'center', fontSize: 12, color: '#c4b5ae',
        marginTop: 36, lineHeight: 1.6,
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
      }}>
        Community is always free · Your health data stays completely private
      </p>
    </div>
  )
}
