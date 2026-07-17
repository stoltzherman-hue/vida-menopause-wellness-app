import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// Temporary diagnostic: reports whether Vapi env vars are present (booleans only).
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 })

  return NextResponse.json({
    hasSecret: !!process.env.VAPI_SECRET,
    hasPublicKey: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
    hasAssistantId: !!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
    publicKeyLen: (process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? '').length,
    assistantIdLen: (process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? '').length,
  })
}
