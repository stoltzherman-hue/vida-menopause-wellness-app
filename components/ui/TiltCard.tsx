'use client'
import { useRef, useEffect, ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  maxTilt?: number
  glare?: boolean
  scale?: number
}

export function TiltCard({
  children,
  className,
  style,
  maxTilt = 12,
  glare = true,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const isTouch = useRef(false)

  useEffect(() => {
    isTouch.current = window.matchMedia('(pointer: coarse)').matches
    if (isTouch.current) return

    const card = cardRef.current
    if (!card) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let active = false

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function animate() {
      if (!active) return
      currentX = lerp(currentX, targetX, 0.1)
      currentY = lerp(currentY, targetY, 0.1)
      card!.style.transform = `perspective(900px) rotateX(${currentY}deg) rotateY(${currentX}deg) scale3d(${scale},${scale},${scale})`
      if (glareRef.current) {
        const gx = (targetX / maxTilt) * 50 + 50
        const gy = (targetY / maxTilt) * 50 + 50
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)`
        glareRef.current.style.opacity = '1'
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    function onMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = ((e.clientX - cx) / (rect.width / 2)) * maxTilt
      targetY = -((e.clientY - cy) / (rect.height / 2)) * maxTilt
    }

    function onEnter() {
      active = true
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    function onLeave() {
      active = false
      targetX = 0
      targetY = 0
      card!.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)'
      card!.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
      setTimeout(() => { if (card) card.style.transition = '' }, 560)
      if (glareRef.current) glareRef.current.style.opacity = '0'
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [maxTilt, scale, glare])

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            pointerEvents: 'none', opacity: 0,
            transition: 'opacity 0.3s',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}
