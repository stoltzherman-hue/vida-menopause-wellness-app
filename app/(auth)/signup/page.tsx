'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { signUpSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = signUpSchema.safeParse({ email, password, displayName })
    if (!parsed.success) { setError(parsed.error.issues[0].message); return }
    setLoading(true)
    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { display_name: parsed.data.displayName } },
    })
    setLoading(false)
    if (authError) { setError(authError.message); return }
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf8f4]">
      <Card className="w-full max-w-md"><CardContent className="py-12 text-center space-y-3">
        <div className="text-5xl">🌿</div>
        <h2 className="text-xl font-semibold text-[#2d3748]">Check your inbox</h2>
        <p className="text-[#718096]">We sent a confirmation link to <strong>{email}</strong>.</p>
      </CardContent></Card>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf8f4]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#5a8a6b]">Vida</h1>
          <p className="text-[#718096] mt-1">Join thousands of women navigating menopause</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Create your account</CardTitle><CardDescription>Free forever for community access</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}
              <div className="space-y-2"><Label htmlFor="displayName">Display name</Label><Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <p className="text-xs text-[#a0aec0]">Minimum 8 characters</p>
              </div>
              <p className="text-xs text-[#718096]">By creating an account you agree to our <Link href="/privacy" className="text-[#5a8a6b] hover:underline">Privacy Policy</Link>. Your health data is encrypted and never sold.</p>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create free account'}</Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-[#718096]">Already have an account?{' '}<Link href="/login" className="text-[#5a8a6b] font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
