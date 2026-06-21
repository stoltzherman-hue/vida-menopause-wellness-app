'use client'
import { useRef, useEffect } from 'react'

export function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainCardRef = useRef<HTMLDivElement>(null)
  const insightRef = useRef<HTMLDivElement>(null)
  const streakRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    let mx = 0, my = 0
    let cx = 0, cy = 0

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

    function animate() {
      cx = lerp(cx, mx, 0.06)
      cy = lerp(cy, my, 0.06)
      if (mainCardRef.current) {
        mainCardRef.current.style.transform = `perspective(1200px) rotateX(${cy * 0.6}deg) rotateY(${cx * 0.6}deg) translateZ(0px)`
      }
      if (insightRef.current) {
        insightRef.current.style.transform = `translateX(${cx * 1.8}px) translateY(${cy * 1.8}px) translateZ(30px)`
      }
      if (streakRef.current) {
        streakRef.current.style.transform = `translateX(${cx * 2.8}px) translateY(${cy * 2.8}px) translateZ(50px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    function onMove(e: MouseEvent) {
      const w = window.innerWidth
      const h = window.innerHeight
      mx = (e.clientX / w - 0.5) * 20
      my = (e.clientY / h - 0.5) * -16
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-visual-col" style={{ position: 'relative', zIndex: 1 }}>
      {/* Main card */}
      <div ref={mainCardRef} style={{
        background: 'rgba(255,255,255,0.78)',
        borderRadius: 28,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.85)',
        padding: '28px 26px 24px',
        boxShadow: '0 8px 32px rgba(30,61,53,0.10), 0 2px 8px rgba(30,61,53,0.06), 0 40px 80px rgba(30,61,53,0.08)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#e8f5f2,#d0ede8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#1e3d35', margin: 0 }}>Today&rsquo;s Check-in</p>
            <p style={{ fontSize: 12, color: '#8a7a72', margin: 0 }}>2 min · 5 questions</p>
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#5c4a42', marginBottom: 10 }}>How are you feeling?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
          {['Energised ✨','Calm 🌿','Tired 😴','Foggy 🌫️','Warm 🌡️'].map((s, i) => (
            <span key={s} style={{
              fontSize: 12, padding: '6px 13px', borderRadius: 20,
              background: i === 0 ? '#2d8b7a' : i === 2 ? 'rgba(45,139,122,0.12)' : 'rgba(61,44,53,0.06)',
              color: i === 0 ? 'white' : '#5c4a42',
              fontWeight: i === 0 ? 600 : 400,
              border: i === 0 ? 'none' : '1px solid rgba(61,44,53,0.1)',
            }}>{s}</span>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#5c4a42', marginBottom: 8 }}>Sleep quality</p>
        <div style={{ height: 8, borderRadius: 8, background: 'rgba(61,44,53,0.08)', overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: '72%', borderRadius: 8, background: 'linear-gradient(90deg, #2d8b7a, #5bb3a5)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#8a7a72' }}>Poor</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#2d8b7a' }}>7.2 / 10</span>
          <span style={{ fontSize: 11, color: '#8a7a72' }}>Excellent</span>
        </div>

        <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(45,139,122,0.08), rgba(45,139,122,0.04))', border: '1px solid rgba(45,139,122,0.14)' }}>
          <p style={{ fontSize: 12, color: '#2d8b7a', margin: 0, fontWeight: 600 }}>✦ Vida insight</p>
          <p style={{ fontSize: 12, color: '#5c4a42', margin: '4px 0 0', lineHeight: 1.5 }}>Your sleep quality improved 18% this week — keep up the evening walk habit.</p>
        </div>
      </div>

      {/* Floating insight card */}
      <div ref={insightRef} style={{
        position: 'absolute', bottom: -20, right: -24,
        background: 'linear-gradient(135deg, #1e6b55 0%, #2d8b7a 100%)',
        borderRadius: 18,
        padding: '14px 16px',
        boxShadow: '0 12px 40px rgba(30,107,85,0.35), 0 2px 8px rgba(0,0,0,0.15)',
        maxWidth: 210,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pattern detected</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, lineHeight: 1.45 }}>Hot flushes peaked on days 3–5 this cycle</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>Based on 6 weeks of data</p>
      </div>

      {/* Floating streak badge */}
      <div ref={streakRef} style={{
        position: 'absolute', top: -16, left: -16,
        background: 'white',
        borderRadius: 16,
        padding: '10px 14px',
        boxShadow: '0 8px 28px rgba(30,61,53,0.14), 0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 8,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg, #ff6b35, #f7c59f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔥</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e3d35', margin: 0 }}>14-day streak</p>
          <p style={{ fontSize: 11, color: '#8a7a72', margin: 0 }}>Keep it up!</p>
        </div>
      </div>
    </div>
  )
}
