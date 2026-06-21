export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { notFound, redirect } from 'next/navigation'
import { NewPostClient } from '@/components/community/NewPostClient'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'New Post · Community · Vida' }

export default async function NewPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: category }, { data: myProfile }] = await Promise.all([
    supabase.from('forum_categories').select('id, name').eq('slug', slug).eq('is_active', true).maybeSingle(),
    supabase.from('community_profiles').select('username').eq('user_id', user.id).maybeSingle(),
  ])

  if (!category) notFound()
  if (!myProfile) redirect('/community/setup')

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <a href={`/community/${slug}`} style={{ fontSize: 13, color: '#6b9e80', fontWeight: 600, textDecoration: 'none' }}>
          ← {category.name}
        </a>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 24,
          fontWeight: 700,
          color: '#3d2c35',
          marginTop: 8,
          marginBottom: 0,
        }}>New post</h1>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        border: '1.5px solid rgba(237,224,216,0.8)',
        borderRadius: 22,
        padding: '24px',
        backdropFilter: 'blur(12px)',
      }}>
        <NewPostClient categoryId={category.id} slug={slug} />
      </div>
    </div>
  )
}
