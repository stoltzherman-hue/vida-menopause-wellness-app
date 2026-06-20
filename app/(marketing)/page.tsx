import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Users, TrendingUp, Shield, Sparkles } from 'lucide-react'

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[#fdf8f4] blob-bg overflow-x-hidden">

      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-[#ede0d8]/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-2xl font-bold text-[#3d2c35] tracking-tight">vida<span className="text-[#6b9e80]">.</span></span>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm" className="text-[#8a7a72]">Sign in</Button></Link>
            <Link href="/signup"><Button size="sm">Join free</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#6b9e80]/8 pointer-events-none" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full border border-[#c4959e]/8 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-[#e8f2ec] text-[#4a7a5b] text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6b9e80] animate-pulse" />
            Trusted by thousands of women navigating menopause
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#3d2c35] leading-[1.15] mb-6">
            You deserve to understand<br />
            <span className="gradient-text">what your body is doing.</span>
          </h1>
          <p className="text-lg text-[#8a7a72] max-w-xl mx-auto leading-relaxed mb-10">
            Vida is a wellness companion for women navigating perimenopause and menopause —
            combining community, symptom tracking, and an AI coach that actually <em>gets it</em>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/signup"><Button size="lg" className="w-full sm:w-auto px-10">Start for free</Button></Link>
            <Link href="/community"><Button size="lg" variant="outline" className="w-full sm:w-auto px-10">Explore community</Button></Link>
          </div>
          <p className="mt-5 text-sm text-[#b8a9a0]">Community is always free · No credit card required</p>
        </div>
      </section>

      <div className="bg-white/60 backdrop-blur-sm border-y border-[#ede0d8]/60 py-5">
        <div className="flex gap-12 justify-center flex-wrap px-6 text-sm text-[#8a7a72]">
          {[{stat:'12,000+',label:'women supported'},{stat:'4.9★',label:'average rating'},{stat:'98%',label:'feel less alone'},{stat:'Free',label:'to get started'}].map(({stat,label})=>(
            <div key={label} className="text-center">
              <p className="font-serif text-2xl font-bold text-[#3d2c35]">{stat}</p>
              <p className="text-xs text-[#b8a9a0] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3d2c35] mb-4">Everything you need in one place</h2>
          <p className="text-[#8a7a72] max-w-md mx-auto">Built specifically for perimenopause and menopause — because generic wellness apps miss the point.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {icon:Heart,title:'Daily check-in',desc:'Track symptoms, sleep, mood, and triggers in under 2 minutes. See what changes over time.',bg:'bg-[#fdf0ec]',iconColor:'#c47a5a',iconBg:'bg-[#f5e0d8]'},
            {icon:TrendingUp,title:'Pattern insights',desc:'See your symptom trends over 30 days. Understand what affects how you feel — and why.',bg:'bg-[#eef5f0]',iconColor:'#6b9e80',iconBg:'bg-[#d8eede]'},
            {icon:MessageCircle,title:'AI companion',desc:'A warm, evidence-informed coach available any time. Supportive friend, wellness coach, or doctor prep mode.',bg:'bg-[#f5f0fa]',iconColor:'#b8a9c9',iconBg:'bg-[#ede5f5]',premium:true},
            {icon:Users,title:'Community',desc:'Forums and Circles with women at the same stage. Real conversations, zero judgment.',bg:'bg-[#eef5f0]',iconColor:'#6b9e80',iconBg:'bg-[#d8eede]'},
            {icon:Shield,title:'Doctor prep',desc:'Generate a clear, concise symptom summary to bring to your appointment. Walk in prepared.',bg:'bg-[#fdf0ec]',iconColor:'#c47a5a',iconBg:'bg-[#f5e0d8]',premium:true},
            {icon:Sparkles,title:'Privacy first',desc:'Your health data is yours. Encrypted, never sold, always deletable. No exceptions.',bg:'bg-[#fdf8f0]',iconColor:'#c9a96e',iconBg:'bg-[#f5ecdc]'},
          ].map(({icon:Icon,title,desc,bg,iconColor,iconBg,premium})=>(
            <div key={title} className={`${bg} rounded-3xl p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300`}>
              <div className="flex items-start justify-between">
                <div className={`${iconBg} rounded-2xl p-3`}><Icon size={22} style={{color:iconColor}} strokeWidth={1.8}/></div>
                {premium&&<span className="text-[10px] bg-white/80 text-[#c9a96e] border border-[#c9a96e]/30 rounded-full px-2.5 py-1 font-medium">Premium</span>}
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#3d2c35] text-lg mb-1.5">{title}</h3>
                <p className="text-sm text-[#8a7a72] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_24px_-4px_rgba(107,158,128,0.15)]">
          <div className="text-4xl mb-4">🌿</div>
          <blockquote className="font-serif text-xl md:text-2xl text-[#3d2c35] leading-relaxed italic mb-6">
            &ldquo;For the first time I feel like someone actually understands what I&rsquo;m going through.
            Vida helped me track my patterns and finally have a proper conversation with my doctor.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6b9e80] to-[#c4959e] flex items-center justify-center text-white font-semibold text-sm">S</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#3d2c35]">Sarah, 51</p>
              <p className="text-xs text-[#b8a9a0]">Perimenopause · 8 months with Vida</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3d2c35] mb-3">Simple, honest pricing</h2>
        <p className="text-[#8a7a72] mb-10">Community is always free. Premium unlocks your AI companion, advanced insights, and more.</p>
        <div className="grid sm:grid-cols-2 gap-5 text-left">
          <div className="bg-white/80 rounded-3xl p-7 shadow-[0_2px_16px_-2px_rgba(61,44,53,0.08)] border border-[#ede0d8]/60">
            <p className="text-xs font-medium text-[#b8a9a0] uppercase tracking-widest mb-2">Free</p>
            <p className="font-serif text-4xl font-bold text-[#3d2c35] mb-1">$0</p>
            <p className="text-sm text-[#b8a9a0] mb-6">Always</p>
            <ul className="space-y-3 mb-7">
              {['Community forums & Circles','Daily symptom check-in','Basic symptom history','Limited AI messages'].map(f=>(
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#8a7a72]">
                  <span className="w-5 h-5 rounded-full bg-[#e8f2ec] flex items-center justify-center flex-shrink-0"><span className="text-[#6b9e80] text-xs">✓</span></span>{f}
                </li>
              ))}
            </ul>
            <Link href="/signup"><Button variant="outline" className="w-full">Get started free</Button></Link>
          </div>
          <div className="relative bg-gradient-to-br from-[#3d2c35] to-[#5a3d4a] rounded-3xl p-7 shadow-[0_8px_32px_-4px_rgba(61,44,53,0.3)] text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#6b9e80]/15 translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Premium</p>
                <span className="text-[10px] bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/30 rounded-full px-2.5 py-1 font-medium">Most popular</span>
              </div>
              <p className="font-serif text-4xl font-bold text-white mb-1">$12.99</p>
              <p className="text-sm text-white/50 mb-6">per month</p>
              <ul className="space-y-3 mb-7">
                {['Everything in Free','Unlimited AI companion','All 3 conversation modes','Advanced pattern insights','Doctor visit reports','Personalised wellness plan'].map(f=>(
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                    <span className="w-5 h-5 rounded-full bg-[#6b9e80]/30 flex items-center justify-center flex-shrink-0"><span className="text-[#6b9e80] text-xs">✓</span></span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"><Button className="w-full bg-white text-[#3d2c35] hover:bg-white/90 shadow-none">Start free trial</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ede0d8]/60 py-10 text-center">
        <p className="font-serif text-2xl font-bold text-[#3d2c35] mb-4">vida<span className="text-[#6b9e80]">.</span></p>
        <div className="flex gap-6 justify-center text-sm text-[#b8a9a0] mb-5">
          <Link href="/privacy" className="hover:text-[#8a7a72] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#8a7a72] transition-colors">Terms</Link>
          <Link href="/community" className="hover:text-[#8a7a72] transition-colors">Community</Link>
        </div>
        <p className="text-xs text-[#c8bdb8] max-w-md mx-auto">© 2026 Vida Wellness · Educational support only, not a substitute for medical advice. Always consult your healthcare provider for medical decisions.</p>
      </footer>
    </div>
  )
}
