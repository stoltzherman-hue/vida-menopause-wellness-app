import type { Metadata } from 'next'
import { CheckInForm } from '@/components/tracker/CheckInForm'

export const metadata: Metadata = { title: 'Daily Check-in · Vida' }

const TIPS = [
  { icon: '🌿', title: 'Tracking works', body: 'Women who log daily for 2+ weeks report 3× more clarity about their symptom triggers.' },
  { icon: '🧠', title: 'Patterns emerge', body: 'Your data is private and personal. Over time, Vida surfaces insights only visible in your specific data.' },
  { icon: '💬', title: 'Share with your GP', body: 'Your logged history is the most useful thing you can bring to a menopause appointment.' },
  { icon: '🔥', title: 'Streaks matter', body: 'Even 5 minutes a day builds a picture that would otherwise take months to see.' },
]

export default function CheckInPage() {
  const tip = TIPS[new Date().getDay() % TIPS.length]

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 20px 100px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1220', margin: 0 }}>
          Daily Check-in
        </h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 15 }}>How are you doing today?</p>
      </div>

      {/* Two-column layout — stacked on mobile, side-by-side on desktop */}
      <div className="checkin-layout">

        {/* Form column */}
        <div className="checkin-form-col">
          <CheckInForm />
        </div>

        {/* Right panel — desktop only */}
        <div className="checkin-side-col">

          {/* Daily tip card */}
          <div style={{
            background: 'rgba(255,255,255,0.32)', border: '1.5px solid rgba(255,255,255,0.58)',
            borderRadius: 22, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            padding: '24px 22px', marginBottom: 14,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              Did you know
            </p>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{tip.icon}</div>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 17, fontWeight: 700, color: '#1e3d35', margin: '0 0 8px', lineHeight: 1.3 }}>
              {tip.title}
            </p>
            <p style={{ fontSize: 14, color: '#5a7a6a', margin: 0, lineHeight: 1.65 }}>
              {tip.body}
            </p>
          </div>

          {/* What to track card */}
          <div style={{
            background: 'linear-gradient(148deg, #1a1220 0%, #2a1e30 55%, #1e2a28 100%)',
            borderRadius: 22, padding: '24px 22px',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(26,18,32,0.22)',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(45,139,122,0.12)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                Steps in this check-in
              </p>
              {[
                { n: '1', label: 'Overall wellbeing', color: '#2d8b7a' },
                { n: '2', label: 'Symptoms today',    color: '#e07a5f' },
                { n: '3', label: 'Energy & sleep',    color: '#c4959e' },
                { n: '4', label: 'What made it harder', color: '#c9a96e' },
                { n: '5', label: 'What helped',       color: '#9b8ab8' },
              ].map(({ n, label, color }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: `${color}25`, border: `1.5px solid ${color}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color,
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  }}>{n}</div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#c4b5ae', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            Takes under 2 minutes<br/>Your data is always private
          </p>
        </div>
      </div>
    </div>
  )
}
