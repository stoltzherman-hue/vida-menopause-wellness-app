import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Temporary diagnostic: reports whether Vapi env vars are present (booleans /
// names only — never values). No auth so it can be hit on a direct deploy URL.
export async function GET() {
  const vapiKeys = Object.keys(process.env).filter((k) => /vapi/i.test(k))
  const sampleServerKeys = Object.keys(process.env).filter((k) => /SUPABASE_SERVICE|PAYFAST_MERCHANT_ID/i.test(k))

  return NextResponse.json(
    {
      buildMarker: 'v4-noauth',
      now: new Date().toISOString(),
      hasSecret: !!process.env.VAPI_SECRET,
      hasPublicKey: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
      hasAssistantId: !!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      vapiKeysSeen: vapiKeys,
      knownServerKeysSeen: sampleServerKeys,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  )
}
