import crypto from 'crypto'

export function vapiConfig() {
  const secret = process.env.VAPI_SECRET
  if (!secret) throw new Error('VAPI_SECRET is not configured')
  return {
    secret,
    publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? '',
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? '',
  }
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Short-lived signed token that proves a voice session was authorised server-side.
// Carried in Vapi call metadata and verified by the custom-LLM endpoint.
export function signSessionToken(payload: { uid: string; mode: string; exp: number }): string {
  const secret = vapiConfig().secret
  const body = b64url(JSON.stringify(payload))
  const sig = b64url(crypto.createHmac('sha256', secret).update(body).digest())
  return `${body}.${sig}`
}

export function verifySessionToken(token: string): { uid: string; mode: string; exp: number } | null {
  const secret = process.env.VAPI_SECRET
  if (!secret || !token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  const expected = b64url(crypto.createHmac('sha256', secret).update(body).digest())
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const payload = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// Verify the shared secret Vapi sends on webhook calls (configured as the
// server "secret" in the Vapi dashboard, delivered as the x-vapi-secret header).
export function verifyWebhookSecret(headerValue: string | null): boolean {
  const secret = process.env.VAPI_SECRET
  if (!secret || !headerValue) return false
  if (headerValue.length !== secret.length) return false
  return crypto.timingSafeEqual(Buffer.from(headerValue), Buffer.from(secret))
}
