import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/db/client'
import { detectRedFlags } from '@/lib/safety/redFlags'
import { buildCompanionSystemPrompt } from '@/lib/ai/context'
import { verifySessionToken } from '@/lib/vapi'
import { SAVE_CHECKIN_TOOL, saveVoiceCheckin, hasCheckedInToday } from '@/lib/ai/checkinTool'
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

const CHECKIN_GUIDE = `Daily check-in: You can log her check-in hands-free. Run it as a warm, quick chat — but make sure you actually gather the core things before saving:
  1. Her mood / how she's feeling overall — ALWAYS ask this first, it's the heart of the check-in.
  2. How she slept (roughly how many hours).
  3. Her energy today.
  4. Any symptoms — hot flushes, night sweats, brain fog, mood swings, aches, etc.
Ask one at a time, keep it light and natural — not a survey. If she describes her mood in words, convert it to a 1–10 (roughly: "rough" ≈ 3, "okay" ≈ 5, "good" ≈ 7, "great" ≈ 9).
Do NOT call save_checkin until you have at least her mood PLUS a couple of the others. If something's missing, gently ask for it rather than saving early ("And how did you sleep?"). Only when you've got a real picture and she's ready, call save_checkin for today. Then confirm in one short, warm sentence what you logged and that today's check-in is complete (e.g. "All done — mood, sleep and your brain fog are logged for today. 💜"). Never invent values she didn't give.`

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
    const [base, checkedIn] = await Promise.all([
      buildCompanionSystemPrompt(supabase, session.uid, mode, VOICE_STYLE),
      hasCheckedInToday(session.uid),
    ])
    const reminder = checkedIn
      ? 'She has already done today\'s check-in, so there is no need to prompt another one.'
      : 'She has NOT done today\'s check-in yet — early on, gently offer to do a quick check-in together (but never push).'
    systemPrompt = [base, CHECKIN_GUIDE, reminder].join('\n\n')
    promptCache.set(cacheKey, { prompt: systemPrompt, exp: Date.now() + PROMPT_TTL_MS })
  }

  // Anthropic message content can be strings or content blocks (for tool turns)
  const anthropicMessages: Anthropic.MessageParam[] = convo.map((m) => ({
    role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
    content: m.content,
  }))
  if (anthropicMessages.length === 0) anthropicMessages.push({ role: 'user', content: 'Hello' })

  const id = `chatcmpl-${Date.now()}`
  const encoder = new TextEncoder()
  const send = (controller: ReadableStreamDefaultController, text: string) =>
    controller.enqueue(encoder.encode(sseChunk(id, { content: text }, null)))

  const model = 'claude-haiku-4-5-20251001'
  const common = { model, max_tokens: 220, temperature: 0.8, system: systemPrompt } as const

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(sseChunk(id, { role: 'assistant' }, null)))

        // First pass — tool available. Stream any spoken text; capture a tool call if made.
        const first = await anthropic.messages.create({
          ...common,
          tools: [SAVE_CHECKIN_TOOL],
          messages: anthropicMessages,
          stream: true,
        })

        let preText = ''
        let toolName = ''
        let toolId = ''
        let toolInput = ''
        for await (const event of first) {
          if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {
            toolName = event.content_block.name
            toolId = event.content_block.id
          } else if (event.type === 'content_block_delta') {
            if (event.delta.type === 'text_delta') {
              preText += event.delta.text
              send(controller, event.delta.text)
            } else if (event.delta.type === 'input_json_delta') {
              toolInput += event.delta.partial_json
            }
          }
        }

        // If Vida chose to log a check-in, run it and let her confirm naturally
        if (toolName === 'save_checkin') {
          let args: Record<string, unknown> = {}
          try { args = JSON.parse(toolInput || '{}') } catch { /* ignore */ }
          const summary = await saveVoiceCheckin(session.uid, args)
          promptCache.delete(cacheKey) // refresh "checked in today" for later turns

          const assistantBlocks: Anthropic.ContentBlockParam[] = []
          if (preText.trim()) assistantBlocks.push({ type: 'text', text: preText })
          assistantBlocks.push({ type: 'tool_use', id: toolId, name: toolName, input: args })

          const follow = await anthropic.messages.create({
            ...common,
            messages: [
              ...anthropicMessages,
              { role: 'assistant', content: assistantBlocks },
              { role: 'user', content: [{ type: 'tool_result', tool_use_id: toolId, content: summary }] },
            ],
            stream: true,
          })
          for await (const event of follow) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              send(controller, event.delta.text)
            }
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
