import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase admin environment variables are not configured.')
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

interface CheckinRow {
  user_id: string
  checkin_date: string
  overall_wellbeing: number | null
  energy_level: number | null
  sleep_hours: number | null
  hot_flash_severity: number | null
}

interface UserProfile {
  user_id: string
  display_name: string | null
  email: string | null
}

interface UserStats {
  userId: string
  name: string
  email: string
  checkinCount: number
  avgWellbeing: number | null
  avgEnergy: number | null
  avgSleep: number | null
  hotFlashDays: number
  checkinDates: string[]
}

function avg(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null)
  if (valid.length === 0) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}

function streak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...new Set(dates)].sort().reverse()
  const today = new Date()
  let current = 0
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    const expectedStr = expected.toISOString().split('T')[0]
    if (sorted[i] === expectedStr) {
      current++
    } else {
      break
    }
  }
  return current
}

function buildEmailHtml(stats: UserStats): string {
  const name = stats.name || 'there'
  const wellbeingDisplay = stats.avgWellbeing !== null ? `${stats.avgWellbeing}/10` : '—'
  const energyDisplay = stats.avgEnergy !== null ? `${stats.avgEnergy}/10` : '—'
  const sleepDisplay = stats.avgSleep !== null ? `${stats.avgSleep} hrs` : '—'
  const currentStreak = streak(stats.checkinDates)

  const patternNote =
    stats.hotFlashDays >= 4
      ? `Your data suggests hot flushes were present on <strong style="color:#c4b8e0;">${stats.hotFlashDays} of 7 days</strong> this week. Tracking consistently helps you and your care team spot patterns.`
      : stats.avgSleep !== null && stats.avgSleep < 6
      ? `Your data suggests average sleep of <strong style="color:#c4b8e0;">${stats.avgSleep} hrs</strong> this week — below the 7–9 hr range many find restorative. It may be worth tracking what affects your sleep.`
      : stats.avgWellbeing !== null && stats.avgWellbeing >= 7
      ? `Your wellbeing average of <strong style="color:#c4b8e0;">${stats.avgWellbeing}/10</strong> is strong this week. Consistent tracking helps you see what's working and bring clear data to your care team.`
      : `Patterns become clearer with more data — keep checking in daily and Vida will surface specific insights about your sleep, mood, and symptom connections.`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Vida Weekly Summary</title>
</head>
<body style="margin:0;padding:0;background-color:#09070e;font-family:system-ui,-apple-system,sans-serif;color:#e5e5e5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09070e;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;margin:0 auto;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(155,124,200,0.12),rgba(122,82,176,0.08));border:1px solid rgba(155,124,200,0.18);border-radius:20px 20px 0 0;padding:32px;text-align:center;">
              <p style="margin:0;font-size:30px;font-weight:300;color:rgba(255,255,255,0.88);letter-spacing:-0.02em;font-family:Georgia,'Times New Roman',serif;">vida<span style="color:#9b7cc8;">.</span></p>
              <p style="margin:10px 0 0;font-size:11px;color:rgba(196,184,224,0.45);letter-spacing:0.12em;text-transform:uppercase;font-weight:400;">Weekly wellness summary</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:rgba(255,255,255,0.03);border-left:1px solid rgba(155,124,200,0.12);border-right:1px solid rgba(155,124,200,0.12);padding:32px;">

              <p style="margin:0 0 8px 0;font-size:22px;font-weight:300;color:rgba(255,255,255,0.88);font-family:Georgia,'Times New Roman',serif;letter-spacing:-0.02em;">
                Hi ${name}
              </p>
              <p style="margin:0 0 28px 0;font-size:14px;color:rgba(255,255,255,0.4);line-height:1.7;font-weight:300;">
                You checked in <span style="color:rgba(196,184,224,0.8);">${stats.checkinCount} time${stats.checkinCount !== 1 ? 's' : ''}</span> this week${currentStreak > 1 ? ` &mdash; your current streak is <span style="color:rgba(196,184,224,0.8);">${currentStreak} day${currentStreak !== 1 ? 's' : ''}</span>` : ''}. Here&rsquo;s what your data showed.
              </p>

              <!-- Stats -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-collapse:collapse;">
                ${[
                  ['Days checked in', `${stats.checkinCount} / 7`],
                  ['Avg wellbeing', wellbeingDisplay],
                  ['Avg energy', energyDisplay],
                  ['Avg sleep', sleepDisplay],
                  ['Hot flush days', `${stats.hotFlashDays}`],
                ].map(([label, value], i) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                  <td style="padding:13px 0;font-size:14px;color:rgba(255,255,255,0.38);font-weight:300;">${label}</td>
                  <td style="padding:13px 0;font-size:15px;color:rgba(255,255,255,0.82);font-weight:300;text-align:right;font-family:Georgia,'Times New Roman',serif;">${value}</td>
                </tr>`).join('')}
              </table>

              <!-- Pattern insight -->
              <div style="background:rgba(155,124,200,0.07);border:1px solid rgba(155,124,200,0.16);border-radius:14px;padding:18px 20px;margin-bottom:28px;">
                <p style="margin:0 0 8px 0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(196,184,224,0.45);font-weight:400;">Pattern insight</p>
                <p style="margin:0 0 10px 0;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.65;font-weight:300;">${patternNote}</p>
                <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);font-style:italic;">Educational only. Discuss patterns with your healthcare provider.</p>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                <tr>
                  <td align="center">
                    <a href="https://vida-wellness.app/insights" style="display:inline-block;padding:13px 32px;background:rgba(155,124,200,0.14);border:1px solid rgba(155,124,200,0.28);border-radius:100px;color:#c4b8e0;text-decoration:none;font-size:14px;font-weight:300;letter-spacing:0.01em;">
                      View your insights
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:rgba(255,255,255,0.2);">
                Sent by <span style="color:rgba(255,255,255,0.45);">vida.</span> &mdash; your menopause wellness companion
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);line-height:1.6;">
                <a href="https://vida-wellness.app/settings/notifications" style="color:rgba(196,184,224,0.35);text-decoration:underline;">Unsubscribe from weekly emails</a>
                &nbsp;&middot;&nbsp;This email does not constitute medical advice.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  const supabase = createAdminClient()
  const resend = new Resend(resendKey)

  // Compute 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

  // Fetch all check-ins from the last 7 days
  const { data: checkins, error: checkinsError } = await supabase
    .from('daily_checkins')
    .select('user_id, checkin_date, overall_wellbeing, energy_level, sleep_hours, hot_flash_severity')
    .gte('checkin_date', sevenDaysAgoStr)

  if (checkinsError) {
    console.error('[weekly-insights] Failed to fetch checkins:', checkinsError.message)
    return NextResponse.json({ error: 'Failed to fetch checkins' }, { status: 500 })
  }

  const rows = (checkins ?? []) as CheckinRow[]

  // Group by user_id, filter to those with >= 3 check-ins
  const byUser = new Map<string, CheckinRow[]>()
  for (const row of rows) {
    const existing = byUser.get(row.user_id) ?? []
    existing.push(row)
    byUser.set(row.user_id, existing)
  }

  const eligibleUserIds = [...byUser.entries()]
    .filter(([, userRows]) => userRows.length >= 3)
    .map(([userId]) => userId)

  if (eligibleUserIds.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No users with 3+ check-ins this week' })
  }

  // Fetch user profiles for eligible users
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('user_id, display_name, email')
    .in('user_id', eligibleUserIds)

  if (profilesError) {
    console.error('[weekly-insights] Failed to fetch profiles:', profilesError.message)
    return NextResponse.json({ error: 'Failed to fetch user profiles' }, { status: 500 })
  }

  const profileMap = new Map<string, UserProfile>()
  for (const p of (profiles ?? []) as UserProfile[]) {
    profileMap.set(p.user_id, p)
  }

  // Build stats and send emails
  const results: { userId: string; status: string; error?: string }[] = []

  for (const userId of eligibleUserIds) {
    const profile = profileMap.get(userId)
    const email = profile?.email
    if (!email) {
      results.push({ userId, status: 'skipped', error: 'no email' })
      continue
    }

    const userRows = byUser.get(userId) ?? []
    const stats: UserStats = {
      userId,
      name: profile?.display_name ?? '',
      email,
      checkinCount: userRows.length,
      avgWellbeing: avg(userRows.map((r) => r.overall_wellbeing)),
      avgEnergy: avg(userRows.map((r) => r.energy_level)),
      avgSleep: avg(userRows.map((r) => r.sleep_hours)),
      hotFlashDays: userRows.filter((r) => r.hot_flash_severity !== null && r.hot_flash_severity > 0).length,
      checkinDates: userRows.map((r) => r.checkin_date),
    }

    try {
      await resend.emails.send({
        from: 'vida@vida-wellness.app',
        to: email,
        subject: 'Your Vida weekly wellness summary',
        html: buildEmailHtml(stats),
      })
      results.push({ userId, status: 'sent' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      console.error(`[weekly-insights] Failed to send to ${userId}:`, message)
      results.push({ userId, status: 'failed', error: message })
    }
  }

  const sent = results.filter((r) => r.status === 'sent').length
  const failed = results.filter((r) => r.status === 'failed').length
  return NextResponse.json({ sent, failed, total: eligibleUserIds.length })
}
