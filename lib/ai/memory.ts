import { getAiProvider } from './provider'

export interface MemoryEntry {
  key: string
  value: string
}

const EXTRACT_SYSTEM = `You extract key personal facts from a conversation between a user and an AI wellness companion.
Return ONLY a JSON object. Include only facts clearly expressed — never infer or invent.
Keys to extract (omit key entirely if not mentioned):
- primary_concern: her main health concern or worry right now
- biggest_challenge: what she finds hardest day-to-day
- treatment_hope: what she wants from treatment or is considering
- most_distressing_symptom: the symptom she finds most upsetting
- doctor_context: anything about her GP, specialist, or upcoming appointments
- life_context: relevant personal context (work, family, relationships, stress)
- feeling_about_menopause: her emotional framing (scared, frustrated, accepting, etc.)
- support_network: who she has around her (or doesn't)

Rules:
- Max 15 words per value. Be concrete and specific, not generic.
- Only use information clearly stated in the USER messages, not assistant messages.
- Return {} if nothing meaningful to extract.
- Return valid JSON only, no other text.`

export async function extractMemories(
  userMessages: string[],
): Promise<MemoryEntry[]> {
  if (userMessages.length === 0) return []

  const transcript = userMessages.map((m) => `User: ${m}`).join('\n')

  const provider = getAiProvider()
  let raw: string
  try {
    const result = await provider.chat(
      [{ role: 'user', content: `Extract key facts from these user messages:\n\n${transcript}` }],
      { systemPrompt: EXTRACT_SYSTEM, maxTokens: 200 },
    )
    raw = result.content.trim()
  } catch {
    return []
  }

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return []
  }

  const entries: MemoryEntry[] = []
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string' && value.trim().length > 0) {
      entries.push({ key, value: value.trim() })
    }
  }
  return entries
}

export function buildMemoryContext(memories: MemoryEntry[]): string {
  if (memories.length === 0) return ''

  const lines = ['--- WHAT SHE HAS PREVIOUSLY SHARED ---']

  const labels: Record<string, string> = {
    primary_concern: 'Her primary concern',
    biggest_challenge: 'Biggest day-to-day challenge',
    treatment_hope: 'What she hopes for / is considering treatment-wise',
    most_distressing_symptom: 'Most distressing symptom for her',
    doctor_context: 'Doctor / appointments context',
    life_context: 'Life context',
    feeling_about_menopause: 'Her emotional framing',
    support_network: 'Support around her',
  }

  for (const { key, value } of memories) {
    const label = labels[key] ?? key
    lines.push(`${label}: ${value}`)
  }

  lines.push('--- END MEMORY ---')
  lines.push('')
  lines.push(
    'Reference this memory naturally — the way a trusted friend who remembers would. ' +
    'If something she said weeks ago is relevant, gently reflect it back ("you mentioned before that…", ' +
    '"last time you said…"). Do not list or summarise these facts unprompted. ' +
    'Never reference the memory structure itself.',
  )

  return lines.join('\n')
}
