import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, TrendingUp, Pill, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: checkins }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, energy_level, sleep_quality, hot_flash_severity')
      .eq('user_id', user!.id)
      .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
  ])

  const list = checkins ?? []
  const dateSet = new Set(list.map((c) => c.checkin_date))
  const today = new Date().toISOString().split('T')[0]

  let streak = 0
  const cursor = new Date()
  if (dateSet.has(today)) {
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  } else {
    cursor.setDate(cursor.getDate() - 1)
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length
  const todayLogged = dateSet.has(today)
  const latestCheckin = list.at(-1)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">{greeting}</h1>
        <p className="text-[#718096] mt-1">
          {todayLogged ? "Great job logging today's check-in." : 'How are you feeling today?'}
        </p>
      </div>

      {!todayLogged ? (
        <Link href="/check-in">
          <Card className="border-[#5a8a6b]/20 bg-gradient-to-br from-[#5a8a6b]/5 to-[#c4959e]/5 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-full bg-[#5a8a6b]/10 p-3">
                <Heart className="text-[#5a8a6b]" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2d3748]">Log today&apos;s check-in</p>
                <p className="text-sm text-[#718096]">Track how you&apos;re feeling — takes under 2 minutes</p>
              </div>
              <ArrowRight size={20} className="text-[#5a8a6b]" />
            </CardContent>
          </Card>
        </Link>
      ) : latestCheckin ? (
        <Card className="border-[#5a8a6b]/20 bg-gradient-to-br from-[#5a8a6b]/5 to-[#c4959e]/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌿</span>
              <p className="font-semibold text-[#2d3748]">Today&apos;s snapshot</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Mood', value: latestCheckin.mood, color: '#5a8a6b' },
                { label: 'Energy', value: latestCheckin.energy_level, color: '#c47a5a' },
                { label: 'Sleep', value: latestCheckin.sleep_quality, color: '#c4959e' },
                { label: 'Hot flash', value: latestCheckin.hot_flash_severity, color: '#e07a5f' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold" style={{ color }}>
                    {value ?? '—'}
                  </p>
                  <p className="text-xs text-[#718096]">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-[#5a8a6b]">{streak || '—'}</p>
            <p className="text-xs text-[#718096] mt-1">Day streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-[#c47a5a]">{monthCount || '—'}</p>
            <p className="text-xs text-[#718096] mt-1">Check-ins this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <Link href="/tracker">
          <Card className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-[#c47a5a]/10 p-3">
                <TrendingUp size={20} className="text-[#c47a5a]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#2d3748]">Symptom tracker</p>
                <p className="text-sm text-[#718096]">
                  {list.length > 0 ? `${list.length} entries — view trends and patterns` : 'View trends and patterns'}
                </p>
              </div>
              <ArrowRight size={16} className="text-[#718096]" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/medication">
          <Card className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-[#c4959e]/10 p-3">
                <Pill size={20} className="text-[#c4959e]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#2d3748]">Medications & HRT</p>
                <p className="text-sm text-[#718096]">Manage and track adherence</p>
              </div>
              <ArrowRight size={16} className="text-[#718096]" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/companion">
          <Card className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-[#5a8a6b]/10 p-3">
                <MessageCircle size={20} className="text-[#5a8a6b]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[#2d3748]">AI Companion</p>
                  <Badge variant="secondary" className="text-[10px] py-0">Premium</Badge>
                </div>
                <p className="text-sm text-[#718096]">Your personal wellness coach</p>
              </div>
              <ArrowRight size={16} className="text-[#718096]" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="text-xs text-[#a0aec0] text-center px-4">
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
