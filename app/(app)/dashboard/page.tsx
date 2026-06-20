import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Heart, TrendingUp, Pill, MessageCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Good morning</h1>
        <p className="text-[#718096] mt-1">How are you feeling today?</p>
      </div>

      <Link href="/check-in">
        <Card className="border-[#5a8a6b]/20 bg-gradient-to-br from-[#5a8a6b]/5 to-[#c4959e]/5 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-full bg-[#5a8a6b]/10 p-3"><Heart className="text-[#5a8a6b]" size={24} /></div>
            <div className="flex-1">
              <p className="font-semibold text-[#2d3748]">Log today&apos;s check-in</p>
              <p className="text-sm text-[#718096]">Track how you&apos;re feeling — takes under 2 minutes</p>
            </div>
            <ArrowRight size={20} className="text-[#5a8a6b]" />
          </CardContent>
        </Card>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-[#5a8a6b]">—</p><p className="text-xs text-[#718096] mt-1">Day streak</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-[#c47a5a]">—</p><p className="text-xs text-[#718096] mt-1">Check-ins this month</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {[
          { href: '/tracker', icon: TrendingUp, color: '#c47a5a', title: 'Symptom tracker', desc: 'View trends and patterns' },
          { href: '/medication', icon: Pill, color: '#c4959e', title: 'Medications & HRT', desc: 'Manage and track adherence' },
        ].map(({ href, icon: Icon, color, title, desc }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full p-3" style={{ backgroundColor: `${color}15` }}><Icon size={20} style={{ color }} /></div>
                <div className="flex-1"><p className="font-medium text-[#2d3748]">{title}</p><p className="text-sm text-[#718096]">{desc}</p></div>
                <ArrowRight size={16} className="text-[#718096]" />
              </CardContent>
            </Card>
          </Link>
        ))}
        <Link href="/companion">
          <Card className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-[#5a8a6b]/10 p-3"><MessageCircle size={20} className="text-[#5a8a6b]" /></div>
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
