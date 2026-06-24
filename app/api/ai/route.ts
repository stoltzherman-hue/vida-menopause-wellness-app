import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { aiMessageSchema } from '@/lib/validations'
import { detectRedFlags } from '@/lib/safety/redFlags'
import { getAiProvider } from '@/lib/ai/provider'
import { MODE_SYSTEM_PROMPTS } from '@/lib/ai/modes'
import type { ConversationMode } from '@/lib/ai/modes'
import { extractMemories, buildMemoryContext } from '@/lib/ai/memory'

function buildPersonalContext(
  profile: { menopause_stage?: string | null; goals?: string[] | null; hrt_status?: string | null; primary_symptoms?: string[] | null } | null,
  recentCheckins: Array<{ checkin_date: string; mood: number | null; sleep_hours: number | null; hot_flash_severity: number | null; triggers: string[] | null }>,
): string {
  if (!profile && recentCheckins.length === 0) return ''

  const lines: string[] = ['--- USER CONTEXT (use this to personalise your response) ---']

  if (profile?.menopause_stage) {
    lines.push(`Menopause stage: ${profile.menopause_stage.replace(/_/g, ' ')}`)
  }
  if (profile?.hrt_status && profile.hrt_status !== 'prefer_not') {
    const hrtMap: Record<string, string> = {
      yes_hrt: 'Currently on HRT/HT',
      yes_non_hormonal: 'On non-hormonal prescription medication',
      yes_supplements: 'Taking supplements only',
      no: 'Not currently on any medication',
      considering: 'Considering starting treatment',
    }
    lines.push(`Treatment status: ${hrtMap[profile.hrt_status] ?? profile.hrt_status}`)
  }
  if (profile?.primary_symptoms?.length) {
    lines.push(`Reported symptoms: ${profile.primary_symptoms.slice(0, 6).join(', ')}`)
  }
  if (profile?.goals?.length) {
    const goalMap: Record<string, string> = {
      manage_hot_flashes: 'manage hot flashes',
      improve_sleep: 'improve sleep',
      support_mood: 'support mood and anxiety',
      reduce_brain_fog: 'reduce brain fog',
      manage_weight: 'manage weight changes',
      bone_health: 'support bone health',
      heart_health: 'support heart health',
      sexual_health: 'improve sexual health',
      doctor_communication: 'communicate better with her doctor',
      track_patterns: 'understand symptom patterns',
      community: 'connect with others',
      feel_less_alone: 'feel less alone',
    }
    const goalLabels = profile.goals.map((g) => goalMap[g] ?? g)
    lines.push(`Her wellness goals: ${goalLabels.join(', ')}`)
  }

  if (recentCheckins.length > 0) {
    lines.push('')
    lines.push('Recent check-in data (last 7 days):')
    const recent = recentCheckins.slice(0, 7)
    const moodVals = recent.filter((c) => c.mood != null).map((c) => c.mood as number)
    const sleepVals = recent.filter((c) => c.sleep_hours != null).map((c) => c.sleep_hours as number)
    const hotFlashDays = recent.filter((c) => (c.hot_flash_severity ?? 0) > 0).length

    if (moodVals.length) {
      const avg = (moodVals.reduce((a, b) => a + b, 0) / moodVals.length).toFixed(1)
      lines.push(`- Average mood: ${avg}/10 over ${moodVals.length} days`)
    }
    if (sleepVals.length) {
      const avg = (sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length).toFixed(1)
      lines.push(`- Average sleep: ${avg} hours`)
    }
    if (hotFlashDays > 0) {
      lines.push(`- Hot flushes reported on ${hotFlashDays} of last ${recent.length} days`)
    }

    // Symptom frequency from triggers
    const symptomCounts: Record<string, number> = {}
    recent.forEach((c) => {
      ;(c.triggers ?? []).forEach((t) => {
        if (t.startsWith('symptom:')) {
          const s = t.slice(8)
          symptomCounts[s] = (symptomCounts[s] ?? 0) + 1
        }
      })
    })
    const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
    if (topSymptoms.length) {
      lines.push(`- Most frequent symptoms this week: ${topSymptoms.map(([s, n]) => `${s} (${n} days)`).join(', ')}`)
    }

    // Sleep-mood pattern
    const lowSleep = recent.filter((c) => (c.sleep_hours ?? 8) < 6 && c.mood != null)
    const goodSleep = recent.filter((c) => (c.sleep_hours ?? 0) >= 7 && c.mood != null)
    if (lowSleep.length >= 2 && goodSleep.length >= 2) {
      const lowMoodAvg = lowSleep.reduce((a, c) => a + (c.mood ?? 0), 0) / lowSleep.length
      const goodMoodAvg = goodSleep.reduce((a, c) => a + (c.mood ?? 0), 0) / goodSleep.length
      if (goodMoodAvg - lowMoodAvg > 1.5) {
        lines.push(`- Pattern detected: mood averages ${goodMoodAvg.toFixed(1)}/10 on days with 7+ hours sleep vs ${lowMoodAvg.toFixed(1)}/10 on days with under 6 hours`)
      }
    }
  }

  lines.push('--- END USER CONTEXT ---')
  lines.push('')
  lines.push('Reference this context naturally when relevant — not robotically. If she asks about sleep or mood and you have data, reference it specifically. Use "your data suggests" not "your data shows". Never summarise back all her stats unprompted.')

  return lines.join('\n')
}

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
  const baseSystemPrompt = MODE_SYSTEM_PROMPTS[resolvedMode] ?? MODE_SYSTEM_PROMPTS['supportive_friend']

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

  // Fetch user profile, recent check-ins, and memories in parallel
  const { data: existingMemories } = await supabase
    .from('ai_memories')
    .select('key, value')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(12)

  // Fetch user profile and recent check-ins in parallel for personalisation
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [{ data: profile }, { data: recentCheckins }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('menopause_stage, goals, hrt_status, primary_symptoms')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, sleep_hours, hot_flash_severity, triggers')
      .eq('user_id', user.id)
      .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: false })
      .limit(7),
  ])

  const personalContext = buildPersonalContext(profile, recentCheckins ?? [])
  const memoryContext = buildMemoryContext(existingMemories ?? [])
  const systemPrompt = [baseSystemPrompt, personalContext, memoryContext]
    .filter(Boolean)
    .join('\n\n')

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
