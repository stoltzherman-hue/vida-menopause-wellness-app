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

      {/* ── Hero glass card ── */}
      <div
        className="glass"
        style={{ borderRadius: 24, padding: 48, marginBottom: 32 }}
      >
        {/* Icon tile + eyebrow row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            background: 'rgba(201,169,110,0.12)',
            border: '1px solid rgba(201,169,110,0.25)',
            borderRadius: 14, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <span style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 9, fontWeight: 700, color: '#c9a96e',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>GP-READY</span>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 700, color: '#c9a96e',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px',
        }}>GP-READY SUMMARY</p>

        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 32, fontWeight: 700, color: '#1a1220',
          margin: '0 0 16px',
        }}>Doctor Report</h1>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 15, color: '#b8a9a0', lineHeight: 1.7,
          margin: '0 0 24px',
        }}>
          Generate a clear, structured summary of your recent wellness data to share with your GP or specialist.
        </p>

        {/* Feature list box */}
        <div style={{
          background: 'rgba(45,139,122,0.05)',
          border: '1px solid rgba(45,139,122,0.12)',
          borderRadius: 16, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 10,
          marginBottom: 28,
        }}>
          {FEATURES.map((feature) => (
            <div key={feature} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: '#2d8b7a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 14, color: '#3d2c35',
              }}>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        {hasData ? (
          <a
            href="#report-content"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 54,
              background: 'linear-gradient(135deg, #2d8b7a 0%, #1e6b55 100%)',
              borderRadius: 9999, border: 'none',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 16, fontWeight: 600, color: 'white',
              textDecoration: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(45,139,122,0.3)',
            }}
          >
            Generate my report →
          </a>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: 54,
            background: 'linear-gradient(135deg, #2d8b7a 0%, #1e6b55 100%)',
            borderRadius: 9999,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 16, fontWeight: 600, color: 'white',
            opacity: 0.5, cursor: 'not-allowed',
          }}>
            Generate my report →
          </div>
        )}
      </div>

      {/* ── Full report (anchor target) ── */}
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
