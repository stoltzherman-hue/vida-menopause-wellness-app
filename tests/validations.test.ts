import { checkinSchema, medicationSchema, aiMessageSchema } from '@/lib/validations'

describe('checkinSchema', () => {
  it('validates a full valid check-in', () => {
    const result = checkinSchema.safeParse({ checkinDate: '2026-06-20', mood: 7, energyLevel: 5, sleepHours: 7, sleepQuality: 3, triggers: ['Stress'] })
    expect(result.success).toBe(true)
  })
  it('rejects invalid date format', () => {
    expect(checkinSchema.safeParse({ checkinDate: '20/06/2026', triggers: [] }).success).toBe(false)
  })
  it('rejects mood outside 1-10', () => {
    expect(checkinSchema.safeParse({ checkinDate: '2026-06-20', mood: 11, triggers: [] }).success).toBe(false)
  })
})

describe('medicationSchema', () => {
  it('validates a medication entry', () => {
    const result = medicationSchema.safeParse({ name: 'Estradiol patch', dose: '100mcg', route: 'transdermal', frequency: 'twice weekly', timeOfDay: ['morning'], category: 'estrogen' })
    expect(result.success).toBe(true)
  })
  it('rejects invalid category', () => {
    expect(medicationSchema.safeParse({ name: 'Something', category: 'magic_pill' }).success).toBe(false)
  })
})

describe('aiMessageSchema', () => {
  it('validates a simple message', () => {
    expect(aiMessageSchema.safeParse({ message: 'Hello, how are you?' }).success).toBe(true)
  })
  it('rejects empty message', () => {
    expect(aiMessageSchema.safeParse({ message: '' }).success).toBe(false)
  })
  it('rejects message over 4000 chars', () => {
    expect(aiMessageSchema.safeParse({ message: 'a'.repeat(4001) }).success).toBe(false)
  })
})
