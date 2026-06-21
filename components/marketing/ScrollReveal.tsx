'use client'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => el.classList.add('reveal-visible'), delay)
          obs.disconnect()
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal-hidden${className ? ' ' + className : ''}`}>
      {children}
    </div>
  )
}
