export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { CompanionChat } from '@/components/ai/CompanionChat'
import type { ConversationMode } from '@/lib/ai/modes'

export const metadata: Metadata = { title: 'Meet Vida · AI Companion' }

export default async function CompanionPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const [{ data: sub }, { data: profile }] = await Promise.all([
    supabase.from('subscriptions').select('tier, status').eq('user_id', user!.id).maybeSingle(),
    supabase.from('user_profiles').select('display_name').eq('user_id', user!.id).maybeSingle(),
  ])

  const isPremium = sub?.tier === 'premium' && sub?.status === 'active'
  const firstName = (profile?.display_name ?? '').split(' ')[0] || null

  const { data: conversation } = await supabase
    .from('ai_conversations')
    .select('id, mode')
    .eq('user_id', user!.id)
    .eq('archived', false)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let initialMessages: { role: 'user' | 'assistant'; content: string }[] = []
  let initialConversationId: string | undefined
  let initialMode: ConversationMode = 'supportive_friend'

  if (conversation) {
    initialConversationId = conversation.id
    initialMode = (conversation.mode as ConversationMode) ?? 'supportive_friend'
    const { data: msgs } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(30)
    initialMessages = (msgs ?? []).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  }

  const isFirstVisit = !conversation

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>

      {/* Named persona header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexShrink: 0 }}>
        {/* Avatar */}
        <div className="companion-avatar" style={{ flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h8M8 14h5"/>
          </svg>
          {/* Online dot */}
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 14, height: 14, borderRadius: '50%',
            background: '#4aad90', border: '2px solid white',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 20, fontWeight: 700, color: '#1a1220', margin: 0,
            }}>Vida</h1>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#4aad90',
              background: 'rgba(74,173,144,0.12)', border: '1px solid rgba(74,173,144,0.28)',
              borderRadius: 9999, padding: '2px 8px', letterSpacing: '0.04em',
            }}>ONLINE</span>
            {isPremium && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: '#c9a96e',
                background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.28)',
                borderRadius: 9999, padding: '2px 8px', letterSpacing: '0.04em',
              }}>PREMIUM</span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#b8a9a0', margin: '3px 0 0', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Your menopause wellness companion · Educational support only
          </p>
        </div>
      </div>

      {/* First-visit warm intro card */}
      {isFirstVisit && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(45,139,122,0.07) 0%, rgba(155,138,184,0.07) 100%)',
          border: '1.5px solid rgba(45,139,122,0.18)',
          borderRadius: 20, padding: '20px 22px', marginBottom: 16, flexShrink: 0,
          animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <p style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 16, fontWeight: 700, color: '#1e3d35', margin: '0 0 8px',
          }}>
            Hi{firstName ? ` ${firstName}` : ''} — I&apos;m Vida 🌿
          </p>
          <p style={{ fontSize: 13, color: '#5a7a6a', margin: '0 0 14px', lineHeight: 1.65 }}>
            I&apos;m here to listen, support you, and help you make sense of what you&apos;re experiencing.
            I can discuss symptoms, help you prep for doctor appointments, and be a knowledgeable friend on your menopause journey.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              'What is perimenopause?',
              `Why am I so tired?`,
              'What helps hot flushes?',
              'Help me prep for my GP',
            ].map((prompt) => (
              <span key={prompt} style={{
                fontSize: 12, color: '#2d8b7a', fontWeight: 600,
                background: 'rgba(45,139,122,0.09)',
                border: '1px solid rgba(45,139,122,0.20)',
                borderRadius: 9999, padding: '6px 13px', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}>{prompt}</span>
            ))}
          </div>
        </div>
      )}

      {!isPremium && (
        <div style={{
          background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.22)',
          borderRadius: 14, padding: '11px 16px', marginBottom: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <p style={{ fontSize: 13, color: '#a08040', margin: 0, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Free plan: 10 messages included.{' '}
            <a href="/settings" style={{ color: '#c9a96e', fontWeight: 700 }}>Upgrade for unlimited →</a>
          </p>
        </div>
      )}

      <CompanionChat
        initialMessages={initialMessages}
        initialConversationId={initialConversationId}
        initialMode={initialMode}
        isPremium={isPremium}
      />
    </div>
  )
}
