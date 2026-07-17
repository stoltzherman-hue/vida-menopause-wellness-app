import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// Temporary diagnostic: reports whether Vapi env vars are present (booleans only).
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 })

  // List any env var NAMES that mention vapi/supabase (values never returned)
  const vapiKeys = Object.keys(process.env).filter((k) => /vapi/i.test(k))
  const sampleServerKeys = Object.keys(process.env).filter((k) => /SUPABASE_SERVICE|PAYFAST_MERCHANT_ID/i.test(k))

  return NextResponse.json(
    {
      buildMarker: 'v3-nocache',
      now: new Date().toISOString(),
      hasSecret: !!process.env.VAPI_SECRET,
      hasPublicKey: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
      hasAssistantId: !!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      // The exact names of any VAPI-related vars the running app can actually see:
      vapiKeysSeen: vapiKeys,
      // Sanity check that other known server vars are visible here:
      knownServerKeysSeen: sampleServerKeys,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  )
}
