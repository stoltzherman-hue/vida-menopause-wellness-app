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
      ? `<p style="margin:0 0 8px 0">Your data suggests hot flashes were present on <strong>${stats.hotFlashDays} of 7 days</strong> this week. Tracking consistently helps you and your care team spot patterns over time.</p>`
      : stats.avgSleep !== null && stats.avgSleep < 6
      ? `<p style="margin:0 0 8px 0">Your data suggests your average sleep was <strong>${stats.avgSleep} hrs</strong> this week — below the 7–9 hr range many find restorative. Consider discussing sleep hygiene with your provider.</p>`
      : stats.avgWellbeing !== null && stats.avgWellbeing >= 7
      ? `<p style="margin:0 0 8px 0">Your data suggests a strong wellbeing week! Keeping up consistent tracking helps you see what's working.</p>`
      : `<p style="margin:0 0 8px 0">Keep tracking — patterns become clearer over time and can be a valuable conversation starter with your care team.</p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Vida Weekly Summary</title>
</head>
<body style="margin:0;padding:0;background-color:#faf8f4;font-family:Georgia,'Times New Roman',serif;color:#2d3748;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f4;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">

          <!-- Header -->
          <tr>
            <td style="background-color:#3d2c35;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">Vida</p>
              <p style="margin:8px 0 0 0;font-size:13px;color:#c9b8c2;letter-spacing:1px;text-transform:uppercase;">Weekly Wellness Summary</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;">

              <p style="margin:0 0 20px 0;font-size:18px;font-weight:bold;color:#3d2c35;">
                Hi ${name}, here&rsquo;s your Vida weekly summary
              </p>

              <p style="margin:0 0 24px 0;font-size:15px;color:#4a5568;line-height:1.6;">
                You checked in <strong>${stats.checkinCount} time${stats.checkinCount !== 1 ? 's' : ''}</strong> this week${currentStreak > 1 ? ` and your current streak is <strong>${currentStreak} day${currentStreak !== 1 ? 's' : ''}</strong>` : ''}. Here&rsquo;s what your data showed:
              </p>

              <!-- Stats table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2d9d0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr style="background-color:#f7f3ef;">
                  <th style="padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#718096;font-weight:600;border-bottom:1px solid #e2d9d0;">Metric</th>
                  <th style="padding:12px 16px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#718096;font-weight:600;border-bottom:1px solid #e2d9d0;">This Week</th>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:15px;color:#2d3748;border-bottom:1px solid #f0ebe5;">Days checked in</td>
                  <td style="padding:14px 16px;font-size:15px;color:#3d2c35;font-weight:bold;text-align:right;border-bottom:1px solid #f0ebe5;">${stats.checkinCount} / 7</td>
                </tr>
                <tr style="background-color:#faf8f4;">
                  <td style="padding:14px 16px;font-size:15px;color:#2d3748;border-bottom:1px solid #f0ebe5;">Avg wellbeing</td>
                  <td style="padding:14px 16px;font-size:15px;color:#3d2c35;font-weight:bold;text-align:right;border-bottom:1px solid #f0ebe5;">${wellbeingDisplay}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:15px;color:#2d3748;border-bottom:1px solid #f0ebe5;">Avg energy</td>
                  <td style="padding:14px 16px;font-size:15px;color:#3d2c35;font-weight:bold;text-align:right;border-bottom:1px solid #f0ebe5;">${energyDisplay}</td>
                </tr>
                <tr style="background-color:#faf8f4;">
                  <td style="padding:14px 16px;font-size:15px;color:#2d3748;border-bottom:1px solid #f0ebe5;">Avg sleep</td>
                  <td style="padding:14px 16px;font-size:15px;color:#3d2c35;font-weight:bold;text-align:right;border-bottom:1px solid #f0ebe5;">${sleepDisplay}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:15px;color:#2d3748;">Hot flash days</td>
                  <td style="padding:14px 16px;font-size:15px;color:#3d2c35;font-weight:bold;text-align:right;">${stats.hotFlashDays}</td>
                </tr>
              </table>

              <!-- Pattern callout -->
              <div style="background-color:#f7f3ef;border-left:3px solid #5a8a6b;border-radius:0 8px 8px 0;padding:16px;margin-bottom:24px;font-size:14px;color:#4a5568;line-height:1.6;">
                <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#5a8a6b;font-weight:600;">Pattern insight</p>
                ${patternNote}
                <p style="margin:0;font-size:12px;color:#a0aec0;font-style:italic;">This is educational, not medical advice. Discuss patterns with your healthcare provider.</p>
              </div>

              <!-- Closing -->
              <p style="margin:0 0 8px 0;font-size:15px;color:#4a5568;line-height:1.6;">
                Every check-in is a step toward understanding your body better. You&rsquo;re doing great — keep going. 🌿
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f0ebe5;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#718096;">
                Sent by <strong style="color:#3d2c35;">Vida</strong> &mdash; your menopause wellness companion
              </p>
              <p style="margin:0;font-size:12px;color:#a0aec0;">
                To unsubscribe from weekly emails, visit your
                <a href="https://vida-wellness.app/settings/notifications" style="color:#5a8a6b;text-decoration:underline;">notification settings</a>.
                This email does not constitute medical advice.
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
