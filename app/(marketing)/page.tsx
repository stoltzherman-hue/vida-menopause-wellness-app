import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MessageCircle, Users, TrendingUp, Shield, Sparkles } from 'lucide-react'

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="sticky top-0 z-40 border-b border-[#e2d9d0] bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#5a8a6b]">Vida</span>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/signup"><Button size="sm">Join free</Button></Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2d3748] leading-tight">
          You deserve to understand<br />
          <span className="text-[#5a8a6b]">what your body is doing.</span>
        </h1>
        <p className="mt-6 text-lg text-[#718096] max-w-xl mx-auto">
          Vida is a wellness companion for women navigating perimenopause and menopause —
          combining community support, symptom tracking, and an AI coach that actually gets it.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup"><Button size="lg" className="w-full sm:w-auto">Start for free</Button></Link>
          <Link href="/community"><Button size="lg" variant="outline" className="w-full sm:w-auto">Explore community</Button></Link>
        </div>
        <p className="mt-4 text-sm text-[#a0aec0]">Community is always free. No credit card required.</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-[#2d3748] mb-10">Everything you need in one place</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Heart, title: 'Daily check-in', desc: 'Track symptoms, sleep, mood, and triggers in under 2 minutes.', color: '#c47a5a' },
            { icon: TrendingUp, title: 'Pattern insights', desc: 'See your symptom trends over time. Understand what affects how you feel.', color: '#5a8a6b' },
            { icon: MessageCircle, title: 'AI companion', desc: 'A warm, evidence-informed coach available 24/7. Text or voice.', color: '#c4959e', premium: true },
            { icon: Users, title: 'Community', desc: 'Connect with women at the same stage. Free forums and Circles.', color: '#5a8a6b' },
            { icon: Shield, title: 'Doctor prep', desc: 'Generate a clear symptom report to bring to your appointment.', color: '#c47a5a', premium: true },
            { icon: Sparkles, title: 'Privacy first', desc: 'Your health data is yours. Encrypted, not sold, always deletable.', color: '#718096' },
          ].map(({ icon: Icon, title, desc, color, premium }) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2" style={{ backgroundColor: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#2d3748]">{title}</h3>
                    {premium && <span className="text-[10px] bg-[#c47a5a]/10 text-[#c47a5a] rounded-full px-2 py-0.5 font-medium">Premium</span>}
                  </div>
                </div>
                <p className="text-sm text-[#718096]">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#2d3748] mb-4">Simple, honest pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <Card><CardContent className="p-6 space-y-3">
            <p className="font-semibold text-[#2d3748]">Free</p>
            <p className="text-3xl font-bold text-[#5a8a6b]">$0</p>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>✓ Community forums & Circles</li>
              <li>✓ Daily symptom check-in</li>
              <li>✓ Basic symptom history</li>
              <li>✓ Limited AI messages / month</li>
            </ul>
            <Link href="/signup"><Button variant="outline" className="w-full mt-2">Get started</Button></Link>
          </CardContent></Card>
          <Card className="border-[#5a8a6b]/30"><CardContent className="p-6 space-y-3">
            <p className="font-semibold text-[#2d3748]">Premium</p>
            <p className="text-3xl font-bold text-[#5a8a6b]">$12.99<span className="text-base font-normal text-[#718096]">/mo</span></p>
            <ul className="text-sm text-[#718096] space-y-1">
              <li>✓ Everything in Free</li>
              <li>✓ Unlimited AI companion</li>
              <li>✓ Voice conversations</li>
              <li>✓ Advanced pattern insights</li>
              <li>✓ Doctor visit reports</li>
            </ul>
            <Link href="/signup"><Button className="w-full mt-2">Start free trial</Button></Link>
          </CardContent></Card>
        </div>
      </section>

      <footer className="border-t border-[#e2d9d0] py-8 text-center text-sm text-[#a0aec0]">
        <p>© 2026 Vida Wellness · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link></p>
        <p className="mt-2 text-xs">Vida provides educational wellness support only. Not a substitute for medical advice.</p>
      </footer>
    </div>
  )
}
