export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { CompanionChat } from '@/components/ai/CompanionChat'
import type { ConversationMode } from '@/lib/ai/modes'

export const metadata: Metadata = { title: 'AI Companion · Vida' }

export default async function CompanionPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const [{ data: sub }, { data: profile }] = await Promise.all([
    supabase.from('subscriptions').select('tier, status').eq('user_id', user!.id).maybeSingle(),
    supabase.from('user_profiles').select('display_name').eq('user_id', user!.id).maybeSingle(),
  ])

  const isPremium = sub?.tier === 'premium' && sub?.status === 'active'

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

  if (initialMessages.length === 0) {
    initialMessages = [
      { role: 'assistant', content: "Hello, I'm here to support you on your menopause wellness journey. How can I help you today?" },
      { role: 'user', content: "I've been having more hot flushes lately" },
      { role: 'assistant', content: "I understand — hot flushes can be really disruptive. Your check-in data suggests they've been more frequent this week. Some things that may help include staying cool, loose breathable clothing, and avoiding triggers like caffeine and alcohol. Would you like to explore any of these?" },
    ]
  }

  return (
    <div style={{
      padding: '20px 24px 0',
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 60px)', overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: 16 }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px',
        }}>AI Companion</p>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
          margin: 0, letterSpacing: '-0.02em',
        }}>Your wellness guide</h1>
      </div>

      {/* Mode tabs — text only */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 16, flexShrink: 0, flexWrap: 'wrap' }}>
        {[
          { label: 'Supportive', mode: 'supportive_friend' },
          { label: 'Wellness coach', mode: 'wellness_coach' },
          { label: 'Doctor prep', mode: 'doctor_prep' },
        ].map(({ label, mode }) => {
          const active = initialMode === mode
          return (
            <span key={mode} style={{
              background: active ? 'rgba(139,109,181,0.14)' : 'rgba(255,255,255,0.03)',
              border: active ? '1px solid rgba(139,109,181,0.35)' : '1px solid rgba(255,255,255,0.07)',
              color: active ? 'rgba(196,184,224,0.9)' : 'rgba(255,255,255,0.32)',
              borderRadius: 9999, padding: '8px 16px',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 12, fontWeight: active ? 400 : 300,
              display: 'inline-block',
            }}>{label}</span>
          )
        })}
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <div style={{
          background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.18)',
          borderRadius: 14, padding: '11px 16px', marginBottom: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <p style={{ fontSize: 12, color: 'rgba(201,169,110,0.75)', margin: 0, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300 }}>
            Free plan: 10 messages included.{' '}
            <a href="/settings" style={{ color: '#c9a96e', fontWeight: 400 }}>Upgrade for unlimited</a>
          </p>
        </div>
      )}

      {/* Chat */}
      <CompanionChat
        initialMessages={initialMessages}
        initialConversationId={initialConversationId}
        initialMode={initialMode}
        isPremium={isPremium}
      />
    </div>
  )
}
