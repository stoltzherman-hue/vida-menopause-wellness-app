import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { slug: 'perimenopause-journey', name: 'Perimenopause Journey', description: 'Sharing experiences through the transition', sort_order: 1 },
  { slug: 'hrt-treatment', name: 'HRT & Treatment', description: 'Questions, experiences and support', sort_order: 2 },
  { slug: 'sleep-night-sweats', name: 'Sleep & Night Sweats', description: 'Tips for better rest', sort_order: 3 },
  { slug: 'mind-mood', name: 'Mind & Mood', description: 'Mental wellbeing through menopause', sort_order: 4 },
]

export async function GET(_req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { error } = await supabase.from('forum_categories').upsert(
    CATEGORIES.map(c => ({ ...c, is_active: true })),
    { onConflict: 'slug' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, seeded: CATEGORIES.length })
}
