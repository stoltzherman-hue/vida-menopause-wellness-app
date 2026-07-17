import type { SupabaseClient } from '@supabase/supabase-js'
import { MODE_SYSTEM_PROMPTS, type ConversationMode } from './modes'
import { buildMemoryContext } from './memory'

type Profile = {
  menopause_stage?: string | null
  goals?: string[] | null
  hrt_status?: string | null
  primary_symptoms?: string[] | null
} | null

type Checkin = {
  checkin_date: string
  mood: number | null
  sleep_hours: number | null
  hot_flash_severity: number | null
  triggers: string[] | null
}

export function buildPersonalContext(profile: Profile, recentCheckins: Checkin[]): string {
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

// Assemble the full system prompt (mode + personal context + memories) for a user.
// Shared by the text companion (/api/ai) and the voice companion (/api/vapi/llm).
export async function buildCompanionSystemPrompt(
  supabase: SupabaseClient,
  userId: string,
  mode: ConversationMode,
  extraSystem?: string,
): Promise<string> {
  const baseSystemPrompt = MODE_SYSTEM_PROMPTS[mode] ?? MODE_SYSTEM_PROMPTS['supportive_friend']

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [{ data: existingMemories }, { data: profile }, { data: recentCheckins }] = await Promise.all([
    supabase
      .from('ai_memories')
      .select('key, value')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(12),
    supabase
      .from('user_profiles')
      .select('menopause_stage, goals, hrt_status, primary_symptoms')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, sleep_hours, hot_flash_severity, triggers')
      .eq('user_id', userId)
      .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: false })
      .limit(7),
  ])

  const personalContext = buildPersonalContext(profile ?? null, recentCheckins ?? [])
  const memoryContext = buildMemoryContext(existingMemories ?? [])

  return [baseSystemPrompt, personalContext, memoryContext, extraSystem]
    .filter(Boolean)
    .join('\n\n')
}
