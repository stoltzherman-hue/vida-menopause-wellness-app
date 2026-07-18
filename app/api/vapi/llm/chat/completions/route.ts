import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/db/client'
import { detectRedFlags } from '@/lib/safety/redFlags'
import { buildCompanionSystemPrompt } from '@/lib/ai/context'
import { verifySessionToken } from '@/lib/vapi'
import type { ConversationMode } from '@/lib/ai/modes'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// Run next to Vapi + Anthropic (US East) to cut per-turn network latency
export const preferredRegion = ['iad1']

// Reused across warm invocations
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VOICE_STYLE = `You are having a real spoken conversation on the phone — not answering questions, not reading from a script. Talk the way a warm, easy friend would.

How to speak:
- React first. Before anything else, respond to what she just said with a little warmth or acknowledgement ("Oh, that sounds exhausting", "Mm, I hear you").
- Keep each turn short and natural — usually one to three sentences — so she can jump back in. This is a back-and-forth, not a monologue.
- Do NOT end every turn with a question. Sometimes just reflect, affirm, or offer a small thought and leave a little space for her to fill.
- Vary how you open — never start the same way twice in a row.
- Use contractions and everyday words. Never read out lists or long clinical detail out loud.
- If she gives a short answer, keep it light and flowing rather than interrogating her.
- It's okay to be brief. A gentle "I'm right here" can be a whole turn.`

// Per-user context cache so we don't re-query the database on every single turn
// (that round-trip was the main source of the awkward pause before Vida replies).
const promptCache = new Map<string, { prompt: string; exp: number }>()
const PROMPT_TTL_MS = 3 * 60 * 1000

type ChatMsg = { role: string; content: string }

function extractToken(body: Record<string, unknown>): string | null {
  const call = body?.call as { metadata?: Record<string, unknown> } | undefined
  const meta = (call?.metadata ?? (body?.metadata as Record<string, unknown>)) ?? {}
  const token = meta?.token
  return typeof token === 'string' ? token : null
}

function sseChunk(id: string, delta: { role?: string; content?: string }, finish: string | null): string {
  const payload = {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: 'vida-voice',
    choices: [{ index: 0, delta, finish_reason: finish }],
  }
  return `data: ${JSON.stringify(payload)}\n\n`
}

function streamText(text: string): Response {
  const id = `chatcmpl-${Date.now()}`
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sseChunk(id, { role: 'assistant', content: text }, null)))
      controller.enqueue(encoder.encode(sseChunk(id, {}, 'stop')))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Identity + authorisation come from the signed session token minted by /api/vapi/start
  const token = extractToken(body)
  const session = token ? verifySessionToken(token) : null
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const messages = (Array.isArray(body.messages) ? body.messages : []) as ChatMsg[]
  const convo = messages.filter((m) => m.role === 'user' || m.role === 'assistant')
  const lastUser = [...convo].reverse().find((m) => m.role === 'user')?.content ?? ''

  // Safety gate — runs before any generation, exactly like the text companion
  const flag = detectRedFlags(lastUser)
  if (flag.flagged && flag.escalationMessage) {
    return streamText(flag.escalationMessage)
  }

  const mode = (session.mode as ConversationMode) ?? 'supportive_friend'
  const cacheKey = `${session.uid}:${mode}`
  const cached = promptCache.get(cacheKey)
  let systemPrompt: string
  if (cached && cached.exp > Date.now()) {
    systemPrompt = cached.prompt
  } else {
    const supabase = createAdminClient()
    systemPrompt = await buildCompanionSystemPrompt(supabase, session.uid, mode, VOICE_STYLE)
    promptCache.set(cacheKey, { prompt: systemPrompt, exp: Date.now() + PROMPT_TTL_MS })
  }

  const anthropicMessages = convo.map((m) => ({
    role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
    content: m.content,
  }))

  const id = `chatcmpl-${Date.now()}`
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 220,
          temperature: 0.8,
          system: systemPrompt,
          messages: anthropicMessages.length ? anthropicMessages : [{ role: 'user', content: 'Hello' }],
          stream: true,
        })
        controller.enqueue(encoder.encode(sseChunk(id, { role: 'assistant' }, null)))
        for await (const event of anthropicStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(sseChunk(id, { content: event.delta.text }, null)))
          }
        }
        controller.enqueue(encoder.encode(sseChunk(id, {}, 'stop')))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        console.error('[vapi-llm] provider error', err)
        controller.enqueue(encoder.encode(sseChunk(id, { content: 'I am having trouble hearing you right now. Let us try again in a moment.' }, 'stop')))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      }
      controller.close()
    },
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}
