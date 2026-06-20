import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { cache } from 'react'

export const getSession = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
})

export const getUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})

export async function requireUser() {
  const user = await getUser()
  if (!user) throw new Error('Authentication required')
  return user
}
