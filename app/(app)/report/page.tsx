export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { DoctorReport } from '@/components/report/DoctorReport'

export const metadata: Metadata = { title: 'Doctor Report · Vida' }

const FEATURES = [
  'Last 28 days of symptom tracking',
  'Mood and energy patterns',
  'Sleep quality summary',
  'Medication adherence (if tracked)',
]

export default async function ReportPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const [{ data: checkins }, { data: profile }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, overall_wellbeing, mood, energy_level, sleep_hours, sleep_quality, hot_flash_severity, hot_flash_count, night_sweats_severity, night_sweats_count, period_status, triggers')
      .eq('user_id', user!.id)
      .gte('checkin_date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
    supabase
      .from('user_profiles')
      .select('display_name, menopause_stage, goals')
      .eq('user_id', user!.id)
      .maybeSingle(),
  ])

  const hasData = (checkins ?? []).length > 0

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Hero glass card */}
      <div className="glass" style={{ borderRadius: 24, padding: 48, marginBottom: 32 }}>
        {/* GP-Ready badge */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,169,110,0.08)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: 10, padding: '8px 14px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#c9a96e',
            }} />
            <span style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 9, fontWeight: 400, color: 'rgba(201,169,110,0.75)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>GP-Ready</span>
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 30, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
          margin: '0 0 16px', letterSpacing: '-0.02em',
        }}>Doctor Report</h1>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7,
          margin: '0 0 24px',
        }}>
          Generate a clear, structured summary of your recent wellness data to share with your GP or specialist.
        </p>

        {/* Feature list box */}
        <div className="glass-violet" style={{ borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {FEATURES.map((feature) => (
            <div key={feature} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(139,109,181,0.2)',
                border: '1px solid rgba(139,109,181,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="rgba(196,184,224,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        {hasData ? (
          <a
            href="#report-content"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 52, textDecoration: 'none', fontSize: 14 }}
          >
            Generate my report
          </a>
        ) : (
          <div className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 52, opacity: 0.4, cursor: 'not-allowed', fontSize: 14 }}>
            Generate my report
          </div>
        )}
      </div>

      {/* Full report */}
      <div id="report-content">
        <DoctorReport
          checkins={checkins ?? []}
          profile={profile}
          generatedDate={new Date().toISOString()}
        />
      </div>

    </div>
  )
}
