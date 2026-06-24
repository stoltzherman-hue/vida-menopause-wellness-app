import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'
import { writeAuditLog } from '@/lib/analytics/audit'

export async function DELETE() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Write audit log before deletion
  await writeAuditLog({
    userId: user.id,
    action: 'account.deleted',
    resource: 'user',
    resourceId: user.id,
    metadata: { email: user.email },
  })

  // Delete all user data in order (respecting FK constraints)
  await Promise.all([
    admin.from('daily_checkins').delete().eq('user_id', user.id),
    admin.from('medications').delete().eq('user_id', user.id),
    admin.from('notification_subscriptions').delete().eq('user_id', user.id),
  ])

  await Promise.all([
    admin.from('user_profiles').delete().eq('user_id', user.id),
    admin.from('subscriptions').delete().eq('user_id', user.id),
    admin.from('community_profiles').delete().eq('user_id', user.id),
  ])

  // Delete the auth user (must be last)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('[account-delete] Failed to delete auth user:', error.message)
    return NextResponse.json({ error: 'Could not delete account. Please contact support.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
