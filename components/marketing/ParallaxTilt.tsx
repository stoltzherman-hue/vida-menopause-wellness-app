'use client'
import { useEffect, useRef } from 'react'

export function ParallaxTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let targetX = 0, targetY = 0
    let curX = 0, curY = 0

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
    }
    function onLeave() { targetX = 0; targetY = 0 }

    function tick() {
      curX += (targetX - curX) * 0.06
      curY += (targetY - curY) * 0.06
      el!.style.transform = `perspective(1100px) rotateY(${curX * 4}deg) rotateX(${curY * -3}deg)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} style={{ transformStyle: 'preserve-3d', willChange: 'transform', width: '100%', height: '100%' }}>
      {children}
    </div>
  )
}
