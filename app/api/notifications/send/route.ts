import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import webpush from 'web-push'

function initWebPush() {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (pub && priv) {
    webpush.setVapidDetails('mailto:hello@vida.health', pub, priv)
  }
}

export async function POST(req: NextRequest) {
  initWebPush()
  // Cron secret check — only Vercel Cron or internal calls allowed
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createSupabaseServerClient()
  const now = new Date()
  const hourUTC = now.getUTCHours()

  // Fetch users with active medication reminders due around this hour
  const { data: meds } = await supabase
    .from('medications')
    .select('user_id, name, time_of_day')
    .eq('status', 'active')
    .not('time_of_day', 'is', null)

  const userIds = new Set<string>()
  const userMessages = new Map<string, string[]>()

  for (const med of meds ?? []) {
    const times: string[] = med.time_of_day ?? []
    const matches = times.some((t) => {
      if (t === 'morning' && hourUTC >= 7 && hourUTC < 9) return true
      if (t === 'afternoon' && hourUTC >= 13 && hourUTC < 15) return true
      if (t === 'evening' && hourUTC >= 18 && hourUTC < 20) return true
      if (t === 'night' && hourUTC >= 21 && hourUTC < 23) return true
      return false
    })
    if (matches) {
      userIds.add(med.user_id)
      const msgs = userMessages.get(med.user_id) ?? []
      msgs.push(med.name)
      userMessages.set(med.user_id, msgs)
    }
  }

  if (userIds.size === 0) return NextResponse.json({ sent: 0 })

  // Fetch push subscriptions for matched users
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, p256dh, auth')
    .in('user_id', [...userIds])

  let sent = 0
  const failed: string[] = []

  for (const sub of subs ?? []) {
    const meds = userMessages.get(sub.user_id) ?? []
    const payload = JSON.stringify({
      title: 'Medication reminder',
      body: meds.length === 1 ? `Time to take ${meds[0]}` : `Time to take ${meds.slice(0, -1).join(', ')} and ${meds[meds.length - 1]}`,
      tag: 'med-reminder',
      url: '/medication',
    })

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
      sent++
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode
      if (status === 410 || status === 404) {
        // Subscription expired — remove it
        failed.push(sub.endpoint)
      }
    }
  }

  // Clean up expired subscriptions
  if (failed.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', failed)
  }

  return NextResponse.json({ sent, expired: failed.length })
}
