'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, MessageCircle, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/check-in', label: 'Check-in', icon: Heart },
  { href: '/companion', label: 'Companion', icon: MessageCircle },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-3 mb-3 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(61,44,53,0.18),0_2px_8px_-2px_rgba(61,44,53,0.08)] border border-white/60">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-medium transition-all duration-200 min-h-[52px] min-w-[52px] justify-center',
                  active ? 'text-[#6b9e80]' : 'text-[#b8a9a0] hover:text-[#8a7a72]'
                )}
              >
                <div className={cn('rounded-xl p-1.5 transition-all duration-200', active ? 'bg-[#e8f2ec]' : '')}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
