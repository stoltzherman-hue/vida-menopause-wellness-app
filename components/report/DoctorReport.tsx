'use client'

interface Checkin {
  checkin_date: string
  overall_wellbeing: number | null
  mood: number | null
  energy_level: number | null
  sleep_hours: number | null
  sleep_quality: number | null
  hot_flash_severity: number | null
  hot_flash_count: number | null
  night_sweats_severity: number | null
  night_sweats_count: number | null
  period_status: string | null
  triggers: string[] | null
}

interface Profile {
  display_name: string | null
  menopause_stage: string | null
  goals: string[] | null
}

interface Props {
  checkins: Checkin[]
  profile: Profile | null
  generatedDate: string
}

function avg(vals: (number | null)[]): number | null {
  const v = vals.filter((x): x is number => x !== null)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

function fmt(n: number | null, dp = 1): string {
  return n == null ? 'No data' : n.toFixed(dp)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function severity(n: number | null): string {
  if (n == null) return 'Not recorded'
  if (n <= 1) return 'Mild'
  if (n <= 2) return 'Moderate'
  if (n <= 3) return 'Moderate–severe'
  return 'Severe'
}

export function DoctorReport({ checkins, profile, generatedDate }: Props) {
  if (checkins.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(155,124,200,0.12)', border: '1px solid rgba(155,124,200,0.22)',
          margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(155,124,200,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Your report awaits
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 28px' }}>
          A few daily check-ins is all it takes. Once you have data, this report becomes a powerful tool for your next appointment.
        </p>
        <a href="/tracker" style={{
          display: 'inline-block', padding: '13px 28px', borderRadius: 9999,
          background: 'linear-gradient(135deg, rgba(155,124,200,0.18), rgba(122,82,176,0.18))',
          border: '1px solid rgba(155,124,200,0.3)',
          color: '#c4b8e0', textDecoration: 'none',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, fontWeight: 300, letterSpacing: '0.01em',
        }}>
          Start checking in
        </a>
      </div>
    )
  }

  // Compute stats
  const n = checkins.length
  const dateRange = {
    from: checkins[0].checkin_date,
    to: checkins[checkins.length - 1].checkin_date,
  }
  const totalDays = Math.round(
    (new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / 86400000
  ) + 1
  const consistency = Math.round((n / totalDays) * 100)

  const avgMood      = avg(checkins.map((c) => c.mood))
  const avgEnergy    = avg(checkins.map((c) => c.energy_level))
  const avgSleep     = avg(checkins.map((c) => c.sleep_hours))
  const avgSleepQ    = avg(checkins.map((c) => c.sleep_quality))
  const avgHotFlash  = avg(checkins.map((c) => c.hot_flash_severity))
  const avgNightSweat = avg(checkins.map((c) => c.night_sweats_severity))

  const hotFlushDays = checkins.filter((c) => (c.hot_flash_severity ?? 0) > 0).length
  const nightSweatDays = checkins.filter((c) => (c.night_sweats_severity ?? 0) > 0).length

  // Symptom frequency
  const symptomCounts: Record<string, number> = {}
  const triggerCounts: Record<string, number> = {}
  checkins.forEach((c) => {
    (c.triggers ?? []).forEach((t) => {
      if (t.startsWith('symptom:')) {
        const s = t.slice(8)
        symptomCounts[s] = (symptomCounts[s] ?? 0) + 1
      } else if (t.startsWith('trigger:')) {
        const trig = t.slice(8)
        triggerCounts[trig] = (triggerCounts[trig] ?? 0) + 1
      }
    })
  })

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Weekly wellbeing trend
  const weeks: { label: string; avg: number | null }[] = []
  for (let i = 0; i < Math.ceil(n / 7); i++) {
    const chunk = checkins.slice(i * 7, (i + 1) * 7)
    const a = avg(chunk.map((c) => c.mood))
    weeks.push({ label: `Wk ${i + 1}`, avg: a })
  }

  const firstName = (profile?.display_name ?? '').split(' ')[0] || 'Patient'
  const stage = profile?.menopause_stage

  // Generate suggested questions based on data patterns
  const suggestedQuestions: string[] = []
  if (avgHotFlash != null && avgHotFlash >= 2.5) {
    suggestedQuestions.push('What HRT or non-hormonal options are appropriate for my vasomotor symptom severity?')
  }
  if (avgSleep != null && avgSleep < 6) {
    suggestedQuestions.push('Could poor sleep be amplifying my other symptoms, and what can we do about it?')
  }
  if (topSymptoms.some(([s]) => s.toLowerCase().includes('brain fog') || s.toLowerCase().includes('memory'))) {
    suggestedQuestions.push('Is cognitive fogginess common at my stage, and are there evidence-based approaches to manage it?')
  }
  if (topSymptoms.some(([s]) => s.toLowerCase().includes('anxiety') || s.toLowerCase().includes('mood'))) {
    suggestedQuestions.push('How much of my mood and anxiety is likely hormonal, and would HRT help?')
  }
  if (avgMood != null && avgMood < 5) {
    suggestedQuestions.push('My average mood has been low — at what point should we consider whether this needs clinical support?')
  }
  if (nightSweatDays > Math.floor(n * 0.4)) {
    suggestedQuestions.push('Night sweats are disrupting my sleep frequently — what\'s the most effective way to address this?')
  }
  if (topTriggers.some(([t]) => t.toLowerCase().includes('caffeine') || t.toLowerCase().includes('alcohol') || t.toLowerCase().includes('stress'))) {
    suggestedQuestions.push('I\'ve noticed triggers like ' + topTriggers.slice(0, 2).map(([t]) => t).join(' and ') + ' — are lifestyle changes likely to make a meaningful difference?')
  }
  if (suggestedQuestions.length === 0) {
    suggestedQuestions.push('Based on my symptom data, what should I be monitoring most closely?')
    suggestedQuestions.push('Are my current symptoms consistent with my menopause stage?')
    suggestedQuestions.push('Is there anything in this data that suggests I should consider treatment options?')
  }

  function print() {
    window.print()
  }

  return (
    <>
      {/* Screen header */}
      <div className="no-print" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, letterSpacing: '-0.02em' }}>
          Doctor Report
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 6, fontSize: 15, fontWeight: 300 }}>
          A summary of your symptom data to share at your next appointment.
        </p>
      </div>

      <div className="no-print" style={{
        background: 'rgba(155,124,200,0.06)', border: '1px solid rgba(155,124,200,0.16)',
        borderRadius: 18, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontWeight: 400, color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>Ready to print or save as PDF</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: '3px 0 0', fontWeight: 300 }}>
            Use File → Print → Save as PDF, or click the button.
          </p>
        </div>
        <button onClick={print} style={{
          padding: '12px 28px', borderRadius: 14, border: '1px solid rgba(155,124,200,0.3)', cursor: 'pointer',
          background: 'rgba(155,124,200,0.12)',
          color: '#c4b8e0', fontSize: 14, fontWeight: 300,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* ── REPORT DOCUMENT ── */}
      <div className="report-doc">

        {/* Report header */}
        <div className="report-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 400, color: '#c4b8e0', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Vida Wellness — Symptom Summary Report
              </p>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                {profile?.display_name ?? 'Patient'} — Menopause Symptom Log
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                {stage ? `Stage: ${stage.replace(/_/g, ' ')} · ` : ''}
                Report generated: {formatDate(generatedDate)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
                vida<span style={{ color: '#9b7cc8' }}>.</span>
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>vida-wellness.com</p>
            </div>
          </div>

          {/* Data range bar */}
          <div style={{
            marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', flexWrap: 'wrap', gap: '10px 32px',
          }}>
            {[
              { label: 'Data period', value: `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}` },
              { label: 'Days tracked', value: `${n} of ${totalDays}` },
              { label: 'Consistency', value: `${consistency}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{label}</p>
                <p style={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.88)', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Overview metrics */}
        <div className="report-section">
          <h3 className="report-section-title">Overview — 30-day averages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
            {[
              { label: 'Mood', value: fmt(avgMood), sub: '/ 10', color: '#6b9e80', note: 'Self-rated 1–10' },
              { label: 'Energy', value: fmt(avgEnergy), sub: '/ 10', color: '#c47a5a', note: 'Self-rated 1–10' },
              { label: 'Sleep hours', value: fmt(avgSleep), sub: 'hrs/night', color: '#9b8ab8', note: 'Self-reported' },
              { label: 'Sleep quality', value: fmt(avgSleepQ), sub: '/ 5', color: '#c4959e', note: 'Self-rated 1–5' },
              { label: 'Hot flushes', value: fmt(avgHotFlash), sub: 'severity', color: '#e07a5f', note: severity(avgHotFlash) },
              { label: 'Night sweats', value: fmt(avgNightSweat), sub: 'severity', color: '#c47a5a', note: severity(avgNightSweat) },
            ].map(({ label, value, sub, color, note }) => (
              <div key={label} style={{
                background: `${color}09`, border: `1px solid ${color}22`,
                borderRadius: 14, padding: '16px 14px', textAlign: 'center',
              }}>
                <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color, margin: '0 0 2px', lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: '0 0 6px' }}>{sub}</p>
                <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.55)', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Hot flushes & night sweats */}
        <div className="report-section">
          <h3 className="report-section-title">Vasomotor symptoms</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{
              background: 'rgba(224,122,95,0.06)', border: '1px solid rgba(224,122,95,0.18)',
              borderRadius: 16, padding: '18px 16px',
            }}>
              <p style={{ fontSize: 13, fontWeight: 400, color: '#e07a5f', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hot Flushes</p>
              <p style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {hotFlushDays} days
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 8px' }}>with hot flush episodes ({Math.round((hotFlushDays / n) * 100)}% of logged days)</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Average severity: <strong style={{ color: '#e07a5f' }}>{fmt(avgHotFlash)} / 5 — {severity(avgHotFlash)}</strong></p>
            </div>
            <div style={{
              background: 'rgba(196,149,158,0.06)', border: '1px solid rgba(196,149,158,0.18)',
              borderRadius: 16, padding: '18px 16px',
            }}>
              <p style={{ fontSize: 13, fontWeight: 400, color: '#c4959e', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Night Sweats</p>
              <p style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {nightSweatDays} days
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 8px' }}>with night sweat episodes ({Math.round((nightSweatDays / n) * 100)}% of logged days)</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Average severity: <strong style={{ color: '#c4959e' }}>{fmt(avgNightSweat)} / 5 — {severity(avgNightSweat)}</strong></p>
            </div>
          </div>
        </div>

        {/* Section: Symptoms */}
        {topSymptoms.length > 0 && (
          <div className="report-section">
            <h3 className="report-section-title">Most frequently reported symptoms</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topSymptoms.map(([symptom, count]) => {
                const pct = Math.round((count / n) * 100)
                return (
                  <div key={symptom} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 140, flexShrink: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.88)', margin: 0 }}>{symptom}</p>
                    </div>
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #9b8ab8aa, #9b8ab8)', borderRadius: 9999, transition: 'width 1s' }} />
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', width: 70, textAlign: 'right', flexShrink: 0, margin: 0 }}>
                      {count} days ({pct}%)
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section: Potential triggers */}
        {topTriggers.length > 0 && (
          <div className="report-section">
            <h3 className="report-section-title">Identified trigger patterns</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {topTriggers.map(([trigger, count]) => (
                <div key={trigger} style={{
                  background: 'rgba(155,124,200,0.09)', border: '1px solid rgba(155,124,200,0.22)',
                  borderRadius: 9999, padding: '8px 18px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: '#c4b8e0' }}>{trigger}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>({count}×)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Mood trend */}
        {weeks.length > 1 && (
          <div className="report-section">
            <h3 className="report-section-title">Mood trend — week by week</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80, padding: '0 4px' }}>
              {weeks.map(({ label, avg: a }) => {
                const pct = a != null ? (a / 10) * 100 : 0
                return (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <p style={{ fontSize: 11, color: '#6b9e80', fontWeight: 700, margin: 0 }}>
                      {a != null ? a.toFixed(1) : '—'}
                    </p>
                    <div style={{
                      width: '100%', height: `${Math.max(pct, 8)}%`,
                      background: `linear-gradient(180deg, #6b9e80, #6b9e80aa)`,
                      borderRadius: '4px 4px 0 0', minHeight: 6,
                    }} />
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)', margin: 0 }}>{label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section: Suggested questions */}
        <div className="report-section">
          <h3 className="report-section-title">Suggested questions for your doctor</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: '0 0 16px', fontWeight: 300, lineHeight: 1.6 }}>
            Based on your symptom patterns, these questions may help guide your conversation:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {suggestedQuestions.slice(0, 5).map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(155,124,200,0.1)', border: '1px solid rgba(155,124,200,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <span style={{ fontSize: 10, color: '#c4b8e0', fontWeight: 400 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.09)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: '0 0 4px' }}>
              <strong>Important:</strong> This report contains self-reported data logged through the Vida app.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
              It is intended as a supportive document for clinical conversation, not a diagnostic tool.
              All health decisions should be made in consultation with a qualified healthcare provider.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px' }}>
              vida<span style={{ color: '#9b7cc8' }}>.</span>
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>For {firstName} · {formatDate(generatedDate)}</p>
          </div>
        </div>
      </div>
    </>
  )
}
