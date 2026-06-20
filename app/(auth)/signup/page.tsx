'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { signUpSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
      email: parsed.data.email, password: parsed.data.password,
      options: { data: { display_name: parsed.data.displayName } },
    })
    setLoading(false)
    if (authError) { setError(authError.message); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen blob-bg bg-[#fdf8f4] flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 max-w-sm w-full text-center shadow-[0_4px_24px_-4px_rgba(61,44,53,0.12)] border border-white/60">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="font-serif text-2xl font-bold text-[#3d2c35] mb-2">Check your inbox</h2>
          <p className="text-[#8a7a72] text-sm">We sent a confirmation link to <strong className="text-[#3d2c35]">{email}</strong>. Click it to activate your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen blob-bg bg-[#fdf8f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/"><span className="font-serif text-3xl font-bold text-[#3d2c35]">vida<span className="text-[#6b9e80]">.</span></span></Link>
          <p className="text-[#8a7a72] mt-2 text-sm">Join thousands of women navigating menopause</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_24px_-4px_rgba(61,44,53,0.12)] border border-white/60">
          <h1 className="font-serif text-2xl font-bold text-[#3d2c35] mb-6">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">{error}</div>}
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-[#3d2c35] text-sm font-medium">Your name</Label>
              <Input id="displayName" placeholder="How you'll appear in the community" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#3d2c35] text-sm font-medium">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#3d2c35] text-sm font-medium">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" placeholder="Min. 8 characters" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <p className="text-xs text-[#b8a9a0]">By joining you agree to our <Link href="/privacy" className="text-[#6b9e80] hover:underline">Privacy Policy</Link>. Your health data is encrypted and never sold.</p>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? 'Creating account…' : 'Create free account'}</Button>
          </form>
        </div>
        <p className="text-center text-sm text-[#8a7a72] mt-6">Already have an account?{' '}<Link href="/login" className="text-[#6b9e80] font-semibold hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
