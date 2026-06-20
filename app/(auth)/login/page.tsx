'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/db/client'
import { loginSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) { setError(parsed.error.issues[0].message); return }
    setLoading(true)
    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data)
    setLoading(false)
    if (authError) { setError('Invalid email or password'); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen blob-bg bg-[#fdf8f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/"><span className="font-serif text-3xl font-bold text-[#3d2c35]">vida<span className="text-[#6b9e80]">.</span></span></Link>
          <p className="text-[#8a7a72] mt-2 text-sm">Welcome back</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[0_4px_24px_-4px_rgba(61,44,53,0.12)] border border-white/60">
          <h1 className="font-serif text-2xl font-bold text-[#3d2c35] mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">{error}</div>}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#3d2c35] text-sm font-medium">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#3d2c35] text-sm font-medium">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          </form>
        </div>
        <p className="text-center text-sm text-[#8a7a72] mt-6">Don&apos;t have an account?{' '}<Link href="/signup" className="text-[#6b9e80] font-semibold hover:underline">Join free</Link></p>
      </div>
    </div>
  )
}
