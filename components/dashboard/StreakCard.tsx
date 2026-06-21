'use client'

interface Props {
  streak: number
  longestStreak: number
  totalCheckins: number
}

const MILESTONES = [3, 7, 14, 30]

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today'
  if (streak === 1) return 'Day 1 — great start!'
  if (streak >= 30) return '30 days — you\'re unstoppable!'
  if (streak >= 14) return 'Two weeks — incredible!'
  if (streak >= 7) return 'One week! You\'re building a habit'
  if (streak >= 3) return '3 days strong!'
  return `${streak} days — keep going!`
}

export function StreakCard({ streak, longestStreak, totalCheckins }: Props) {
  const message = getMotivationalMessage(streak)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #4a7a5b 0%, #6b9e80 50%, #2d8b7a 100%)',
      borderRadius: 22,
      padding: '22px 24px',
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(74,122,91,0.30)',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 110, height: 110, borderRadius: '50%',
        background: 'rgba(255,255,255,0.09)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top row: flame + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>🔥</span>
            <div>
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 32, fontWeight: 800, color: 'white',
                margin: 0, lineHeight: 1,
              }}>{streak}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0', fontWeight: 500 }}>
                {streak === 1 ? 'day streak' : 'day streak'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Best: <span style={{ color: 'white', fontWeight: 700 }}>{longestStreak}</span></p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Total: <span style={{ color: 'white', fontWeight: 700 }}>{totalCheckins}</span></p>
          </div>
        </div>

        {/* Motivational message */}
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.92)',
          fontWeight: 600, margin: '0 0 16px', lineHeight: 1.4,
        }}>{message}</p>

        {/* Milestone badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MILESTONES.map(m => {
            const achieved = streak >= m
            return (
              <div key={m} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: achieved ? 'rgba(201,169,110,0.28)' : 'rgba(255,255,255,0.10)',
                border: achieved ? '1.5px solid rgba(201,169,110,0.55)' : '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 10, padding: '5px 10px',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 13 }}>{achieved ? '🏅' : '⬜'}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: achieved ? '#f4d185' : 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.02em',
                }}>{m}d</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
