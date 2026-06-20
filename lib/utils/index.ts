import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isoDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function sanitizeForLog(obj: Record<string, unknown>): Record<string, unknown> {
  const REDACTED_KEYS = ['password','token','secret','apiKey','journalText','notes','content','body','symptomNotes','aiResponse','chatContent']
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      REDACTED_KEYS.some((rk) => k.toLowerCase().includes(rk.toLowerCase())) ? '[REDACTED]' : v,
    ])
  )
}
