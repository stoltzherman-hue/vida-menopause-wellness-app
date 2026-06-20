import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { CompanionChat } from '@/components/ai/CompanionChat'
import type { ConversationMode } from '@/lib/ai/modes'

export const metadata: Metadata = { title: 'AI Companion' }

export default async function CompanionPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', user!.id)
    .single()

  const isPremium = sub?.tier === 'premium' && sub?.status === 'active'

  const { data: conversation } = await supabase
    .from('ai_conversations')
    .select('id, mode')
    .eq('user_id', user!.id)
    .eq('archived', false)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

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

    initialMessages = (msgs ?? []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">AI Companion</h1>
          <p className="text-xs text-[#a0aec0] mt-1">
            Educational support only — not medical advice
          </p>
        </div>
        {isPremium && (
          <span className="text-xs font-medium bg-[#5a8a6b]/10 text-[#5a8a6b] px-2 py-1 rounded-full flex-shrink-0">
            Premium
          </span>
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
