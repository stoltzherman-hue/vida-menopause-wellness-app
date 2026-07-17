import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { aiMessageSchema } from '@/lib/validations'
import { detectRedFlags } from '@/lib/safety/redFlags'
import { getAiProvider } from '@/lib/ai/provider'
import type { ConversationMode } from '@/lib/ai/modes'
import { buildCompanionSystemPrompt } from '@/lib/ai/context'
import { extractMemories } from '@/lib/ai/memory'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = aiMessageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: 'Validation failed' } }, { status: 422 })
  }

  const { message, conversationId, mode } = parsed.data
  const resolvedMode: ConversationMode = (mode as ConversationMode) ?? 'supportive_friend'

  // Red-flag detection before AI call
  const flagResult = detectRedFlags(message)
  if (flagResult.flagged) {
    return NextResponse.json({
      data: {
        role: 'assistant',
        content: flagResult.escalationMessage,
        flagged: true,
        flagLabel: flagResult.label,
      },
    })
  }

  const systemPrompt = await buildCompanionSystemPrompt(supabase, user.id, resolvedMode)

  // Get or create conversation
  let convId = conversationId
  if (!convId) {
    const { data: conv } = await supabase
      .from('ai_conversations')
      .insert({ user_id: user.id, mode: resolvedMode })
      .select('id')
      .single()
    convId = conv?.id
  }

  // Verify ownership
  if (convId) {
    const { data: conv } = await supabase
      .from('ai_conversations')
      .select('user_id')
      .eq('id', convId)
      .single()
    if (conv?.user_id !== user.id) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 })
    }
  }

  // Fetch recent messages for context (last 10)
  const { data: history } = await supabase
    .from('ai_messages')
    .select('role,content')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true })
    .limit(10)

  const messages = [
    ...(history ?? []).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  // Call AI provider
  const provider = getAiProvider()
  let aiContent: string
  let inputTokens = 0
  let outputTokens = 0

  try {
    const response = await provider.chat(messages, { systemPrompt, maxTokens: 800 })
    aiContent = response.content
    inputTokens = response.inputTokens
    outputTokens = response.outputTokens
  } catch {
    console.error('[ai] Provider error')
    return NextResponse.json({ error: { message: 'AI service unavailable' } }, { status: 503 })
  }

  // Persist messages and extract memories — fire-and-forget for latency
  if (convId) {
    supabase.from('ai_messages').insert([
      { conversation_id: convId, role: 'user', content: message },
      { conversation_id: convId, role: 'assistant', content: aiContent, input_tokens: inputTokens, output_tokens: outputTokens },
    ]).then(() => {})
  }

  // Extract and upsert memories from this turn async — never blocks response
  const allUserMessages = [
    ...(history ?? []).filter((m) => m.role === 'user').map((m) => m.content),
    message,
  ]
  extractMemories(allUserMessages).then(async (entries) => {
    if (entries.length === 0) return
    await supabase.from('ai_memories').upsert(
      entries.map((e) => ({
        user_id: user.id,
        key: e.key,
        value: e.value,
        source: 'ai_conversation',
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'user_id,key' },
    )
  }).catch(() => {})

  return NextResponse.json({
    data: {
      role: 'assistant',
      content: aiContent,
      conversationId: convId,
    },
  })
}
