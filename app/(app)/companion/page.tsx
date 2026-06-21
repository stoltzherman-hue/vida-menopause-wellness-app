import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { CompanionChat } from '@/components/ai/CompanionChat'
import type { ConversationMode } from '@/lib/ai/modes'

export const metadata: Metadata = { title: 'AI Companion · Vida' }

export default async function CompanionPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', user!.id)
    .maybeSingle()

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

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#3d2c35', margin: 0 }}>AI Companion</h1>
          <p style={{ fontSize: 12, color: '#b8a9a0', marginTop: 4 }}>Educational support only — not medical advice</p>
        </div>
        {isPremium && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#6b9e80',
            background: 'rgba(107,158,128,0.12)', border: '1px solid rgba(107,158,128,0.3)',
            borderRadius: 20, padding: '4px 12px',
          }}>PREMIUM</span>
        )}
      </div>
      <CompanionChat
        initialMessages={initialMessages}
        initialConversationId={initialConversationId}
        initialMode={initialMode}
        isPremium={isPremium}
      />
    </div>
  )
}
