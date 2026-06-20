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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e2d9d0] bg-white/95 backdrop-blur-sm dark:bg-[#1a1f2e]/95 dark:border-[#353a4d] md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={cn('flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-colors min-h-[44px] min-w-[44px] justify-center', active ? 'text-[#5a8a6b] font-semibold' : 'text-[#718096] hover:text-[#5a8a6b]')}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
