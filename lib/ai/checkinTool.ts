import { createAdminClient } from '@/lib/db/client'

// Anthropic tool definition — lets the voice companion log a daily check-in.
export const SAVE_CHECKIN_TOOL = {
  name: 'save_checkin',
  description:
    "Save the user's daily wellness check-in to her tracker. Call this only once she has shared at least a couple of details (mood, sleep, energy, or symptoms) and is happy to log it for today. Never invent values she did not give — omit anything she didn't mention.",
  input_schema: {
    type: 'object' as const,
    properties: {
      mood: { type: 'integer', minimum: 1, maximum: 10, description: 'Overall mood, 1 (low) to 10 (great)' },
      sleep_hours: { type: 'number', minimum: 0, maximum: 24, description: 'Hours slept last night' },
      sleep_quality: { type: 'integer', minimum: 1, maximum: 5, description: 'Sleep quality, 1 (poor) to 5 (great)' },
      energy: { type: 'integer', minimum: 1, maximum: 10, description: 'Energy level, 1 to 10' },
      hot_flash_count: { type: 'integer', minimum: 0, maximum: 100, description: 'Number of hot flushes today' },
      night_sweats_count: { type: 'integer', minimum: 0, maximum: 100, description: 'Number of night sweats' },
      symptoms: { type: 'array', items: { type: 'string' }, description: 'Symptoms mentioned, e.g. "brain fog", "anxiety", "headache"' },
      note: { type: 'string', description: 'A short free-text note in her own words, if she offered one' },
    },
    required: [],
  },
}

type CheckinArgs = {
  mood?: number
  sleep_hours?: number
  sleep_quality?: number
  energy?: number
  hot_flash_count?: number
  night_sweats_count?: number
  symptoms?: string[]
  note?: string
}

function todayInSA(): string {
  // Vida's audience is in South Africa (UTC+2); log against her local date
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' })
}

// Writes the check-in and returns a short human summary for Vida to confirm.
export async function saveVoiceCheckin(userId: string, args: CheckinArgs): Promise<string> {
  const supabase = createAdminClient()
  const date = todayInSA()

  const triggers = (args.symptoms ?? [])
    .filter((s) => typeof s === 'string' && s.trim())
    .map((s) => 'symptom:' + s.trim().toLowerCase().replace(/\s+/g, '_'))
    .slice(0, 20)

  const row: Record<string, unknown> = {
    user_id: userId,
    checkin_date: date,
    mood: args.mood ?? null,
    sleep_hours: args.sleep_hours ?? null,
    sleep_quality: args.sleep_quality ?? null,
    energy_level: args.energy ?? null,
    hot_flash_count: args.hot_flash_count ?? null,
    night_sweats_count: args.night_sweats_count ?? null,
    triggers,
    notes: args.note ?? null,
  }

  const { error } = await supabase.from('daily_checkins').upsert(row, { onConflict: 'user_id,checkin_date' })
  if (error) {
    console.error('[voice-checkin] save error', { code: error.code })
    return 'The check-in could not be saved just now — tell her you hit a snag and she can try again in a moment.'
  }

  const parts: string[] = []
  if (args.mood != null) parts.push(`mood ${args.mood}/10`)
  if (args.sleep_hours != null) parts.push(`${args.sleep_hours}h sleep`)
  if (args.energy != null) parts.push(`energy ${args.energy}/10`)
  if (args.hot_flash_count != null) parts.push(`${args.hot_flash_count} hot flushes`)
  if (args.night_sweats_count != null) parts.push(`${args.night_sweats_count} night sweats`)
  if ((args.symptoms ?? []).length) parts.push((args.symptoms as string[]).join(', '))
  const summary = parts.length ? parts.join(', ') : 'your check-in'
  return `Saved for today (${date}): ${summary}. Confirm warmly in one short sentence.`
}

// Has the user already logged a check-in for today (SA date)?
export async function hasCheckedInToday(userId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('checkin_date', todayInSA())
    .maybeSingle()
  return !!data
}
