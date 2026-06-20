import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { aiMessageSchema } from '@/lib/validations'
import { detectRedFlags } from '@/lib/safety/redFlags'
import { getAiProvider } from '@/lib/ai/provider'

const SYSTEM_PROMPT = `You are Vida's AI companion — a warm, knowledgeable, and deeply empathetic wellness supporter for women navigating menopause and perimenopause.

Critical rules:
- NEVER diagnose a medical condition
- NEVER prescribe or recommend starting, stopping, or changing medication doses
- NEVER tell a user to ignore or dismiss symptoms
- NEVER claim certainty from correlations — use "your data suggests a pattern"
- ALWAYS recommend discussing medical decisions with a healthcare provider
- ALWAYS note this is educational support, not medical advice
- Escalate red flags immediately

Tone: warm, respectful, encouraging, mature.`

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = aiMessageSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: { message: 'Validation failed' } }, { status: 422 })

  const { message, conversationId, mode } = parsed.data

  const flagResult = detectRedFlags(message)
  if (flagResult.flagged) {
    return NextResponse.json({ data: { role: 'assistant', content: flagResult.escalationMessage, flagged: true, flagLabel: flagResult.label } })
  }

  let convId = conversationId
  if (!convId) {
    const { data: conv } = await supabase.from('ai_conversations').insert({ user_id: user.id, mode: mode ?? 'supportive_friend' }).select('id').single()
    convId = conv?.id
  }

  if (convId) {
    const { data: conv } = await supabase.from('ai_conversations').select('user_id').eq('id', convId).single()
    if (conv?.user_id !== user.id) return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 })
  }

  const { data: history } = await supabase.from('ai_messages').select('role,content').eq('conversation_id', convId).order('created_at', { ascending: true }).limit(10)

  const messages = [
    ...(history ?? []).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const provider = getAiProvider()
  let aiContent: string
  let inputTokens = 0, outputTokens = 0
  try {
    const response = await provider.chat(messages, { systemPrompt: SYSTEM_PROMPT, maxTokens: 800 })
    aiContent = response.content; inputTokens = response.inputTokens; outputTokens = response.outputTokens
  } catch {
    console.error('[ai] Provider error')
    return NextResponse.json({ error: { message: 'AI service unavailable' } }, { status: 503 })
  }

  if (convId) {
    supabase.from('ai_messages').insert([
      { conversation_id: convId, role: 'user', content: message },
      { conversation_id: convId, role: 'assistant', content: aiContent, input_tokens: inputTokens, output_tokens: outputTokens },
    ]).then(() => {})
  }

  return NextResponse.json({ data: { role: 'assistant', content: aiContent, conversationId: convId } })
}
