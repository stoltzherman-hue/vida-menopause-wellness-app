import crypto from 'crypto'

export const PAYFAST_SANDBOX = process.env.PAYFAST_SANDBOX === 'true'

export const PAYFAST_HOST = PAYFAST_SANDBOX
  ? 'https://sandbox.payfast.co.za'
  : 'https://www.payfast.co.za'

export const PAYFAST_API_HOST = 'https://api.payfast.co.za'

export const PREMIUM_MONTHLY_ZAR = '149.00'

export function payfastConfig() {
  const merchantId = process.env.PAYFAST_MERCHANT_ID
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY
  const passphrase = process.env.PAYFAST_PASSPHRASE
  if (!merchantId || !merchantKey || !passphrase) {
    throw new Error('PayFast environment variables are not configured')
  }
  return { merchantId, merchantKey, passphrase }
}

// PHP-style urlencode: spaces become '+', uppercase hex escapes
export function pfEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

// Signature over params in insertion order (form/ITN convention)
export function pfSignature(params: Record<string, string>, passphrase: string): string {
  const str = Object.entries(params)
    .filter(([, v]) => v !== '' && v != null)
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join('&')
  return crypto.createHash('md5').update(`${str}&passphrase=${pfEncode(passphrase)}`).digest('hex')
}

// Signature for the subscriptions API: params sorted alphabetically, passphrase merged in
export function pfApiSignature(params: Record<string, string>, passphrase: string): string {
  const all: Record<string, string> = { ...params, passphrase }
  const str = Object.keys(all)
    .sort()
    .map((k) => `${k}=${pfEncode(all[k])}`)
    .join('&')
  return crypto.createHash('md5').update(str).digest('hex')
}

// Validate an ITN payload signature (fields in received order, signature excluded)
export function verifyItnSignature(orderedParams: Array<[string, string]>, passphrase: string): boolean {
  const received = orderedParams.find(([k]) => k === 'signature')?.[1]
  if (!received) return false
  const str = orderedParams
    .filter(([k, v]) => k !== 'signature' && v !== '')
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join('&')
  const expected = crypto.createHash('md5').update(`${str}&passphrase=${pfEncode(passphrase)}`).digest('hex')
  return expected === received
}

// Server-to-server confirmation that the ITN really came from PayFast
export async function validateItnWithPayfast(rawBody: string): Promise<boolean> {
  const res = await fetch(`${PAYFAST_HOST}/eng/query/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: rawBody,
  })
  const text = await res.text()
  return text.trim() === 'VALID'
}
