import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { payfastConfig, pfSignature, PAYFAST_HOST } from '@/lib/payfast'

export const dynamic = 'force-dynamic'

// Temporary diagnostic: renders an auto-submitting PayFast form.
// /api/payfast/diag?mode=once  → R5 once-off payment (no subscription fields)
// /api/payfast/diag?mode=sub   → R5 monthly subscription
export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 })

  const mode = req.nextUrl.searchParams.get('mode') ?? 'once'
  const { merchantId, merchantKey, passphrase } = payfastConfig()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

  const params: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${appUrl}/settings`,
    cancel_url: `${appUrl}/settings`,
    notify_url: `${appUrl}/api/webhooks/payfast`,
    m_payment_id: `diag-${Date.now()}`,
    amount: '5.00',
    item_name: 'Vida diagnostic test',
  }
  if (mode === 'sub') {
    params.subscription_type = '1'
    params.recurring_amount = '5.00'
    params.frequency = '3'
    params.cycles = '0'
  }
  params.signature = pfSignature(params, passphrase)

  const inputs = Object.entries(params)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v.replace(/"/g, '&quot;')}">`)
    .join('\n')

  const html = `<!doctype html><html><body style="font-family:sans-serif;padding:40px;background:#09070e;color:#fff">
<p>Submitting ${mode === 'sub' ? 'SUBSCRIPTION' : 'ONCE-OFF'} test payment to PayFast…</p>
<form id="pf" method="POST" action="${PAYFAST_HOST}/eng/process">${inputs}</form>
<script>document.getElementById('pf').submit()</script>
</body></html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
