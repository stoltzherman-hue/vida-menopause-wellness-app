import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { payfastConfig, pfSignature, PAYFAST_HOST } from '@/lib/payfast'

export const dynamic = 'force-dynamic'

// Rebuild a record with extra entries inserted after a given key (field order matters to PayFast)
function insertAfter(
  obj: Record<string, string>,
  afterKey: string,
  extra: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v
    if (k === afterKey) Object.assign(out, extra)
  }
  return out
}

// Temporary diagnostic: renders an auto-submitting PayFast form.
// /api/payfast/diag?mode=once  → R5 once-off payment (no subscription fields)
// /api/payfast/diag?mode=sub   → R5 monthly subscription
export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Sign in first' }, { status: 401 })

  const mode = req.nextUrl.searchParams.get('mode') ?? 'once'
  const skip = (req.nextUrl.searchParams.get('skip') ?? '').split(',')
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
  if (mode === 'full') {
    // Exact replica of the real checkout params (R149 subscription)
    const full: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/settings?upgraded=1`,
      cancel_url: `${appUrl}/settings/upgrade`,
      notify_url: `${appUrl}/api/webhooks/payfast`,
      email_address: user.email ?? '',
      m_payment_id: `${user.id}:${Date.now()}`,
      amount: '149.00',
      item_name: 'Vida Premium (monthly)',
      custom_str1: user.id,
      subscription_type: '1',
      recurring_amount: '149.00',
      frequency: '3',
      cycles: '0',
    }
    for (const key of Object.keys(params)) delete params[key]
    for (const [k, v] of Object.entries(full)) {
      if (!skip.includes(k)) params[k] = v
    }
    if (skip.includes('colon')) params.m_payment_id = `diag-${Date.now()}`
    if (skip.includes('parens')) params.item_name = 'Vida Premium monthly'
  }
  if (mode === 'real') {
    // Byte-for-byte what the live checkout route now sends
    const real: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/settings?upgraded=1`,
      cancel_url: `${appUrl}/settings/upgrade`,
      notify_url: `${appUrl}/api/webhooks/payfast`,
      email_address: user.email ?? '',
      m_payment_id: `vida-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: '149.00',
      item_name: 'Vida Premium Monthly',
      custom_str1: user.id,
      subscription_type: '1',
      recurring_amount: '149.00',
      frequency: '3',
      cycles: '0',
    }
    for (const key of Object.keys(params)) delete params[key]
    Object.assign(params, real)
  }
  params.signature = pfSignature(params, passphrase)

  if (mode === 'probe') {
    // Server-side matrix: POST variants to PayFast, report status per variant
    const base: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/settings`,
      cancel_url: `${appUrl}/settings`,
      notify_url: `${appUrl}/api/webhooks/payfast`,
      m_payment_id: '',
      amount: '5.00',
      item_name: 'Vida diagnostic test',
      subscription_type: '1',
      recurring_amount: '5.00',
      frequency: '3',
      cycles: '0',
    }
    const variants: Array<[string, Record<string, string>]> = [
      ['base-sub-R5', { ...base }],
      ['amount-149', { ...base, amount: '149.00', recurring_amount: '149.00' }],
      ['with-email', { ...base }],
      ['with-custom_str1', { ...base }],
      ['returnurl-query', { ...base, return_url: `${appUrl}/settings?upgraded=1` }],
      ['itemname-premium', { ...base, item_name: 'Vida Premium Monthly' }],
      ['real-combo', {
        ...base,
        return_url: `${appUrl}/settings?upgraded=1`,
        cancel_url: `${appUrl}/settings/upgrade`,
        amount: '149.00',
        recurring_amount: '149.00',
        item_name: 'Vida Premium Monthly',
      }],
    ]
    // email/custom need correct field ordering — rebuild those two properly
    variants[2][1] = insertAfter(base, 'notify_url', { email_address: user.email ?? '' })
    variants[3][1] = insertAfter(base, 'item_name', { custom_str1: user.id })
    variants[6][1] = insertAfter(
      insertAfter(variants[6][1], 'notify_url', { email_address: user.email ?? '' }),
      'item_name', { custom_str1: user.id },
    )

    const results: Record<string, number | string> = {}
    for (const [name, v] of variants) {
      v.m_payment_id = `probe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const signed = { ...v, signature: pfSignature(v, passphrase) }
      const body = new URLSearchParams(signed).toString()
      try {
        const res = await fetch(`${PAYFAST_HOST}/eng/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
          redirect: 'manual',
        })
        results[name] = res.status
      } catch (e) {
        results[name] = String(e)
      }
    }
    return NextResponse.json(results)
  }

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
