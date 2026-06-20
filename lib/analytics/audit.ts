import { createAdminClient } from '@/lib/db/client'

export type AuditAction =
  | 'account.created' | 'account.deleted' | 'account.login' | 'account.logout'
  | 'data.exported' | 'subscription.created' | 'subscription.updated' | 'subscription.canceled'
  | 'medication.created' | 'medication.updated' | 'medication.deleted'
  | 'ai.conversation.started' | 'community.post.reported'
  | 'admin.user.viewed' | 'admin.user.suspended'

export async function writeAuditLog({
  userId, action, resource, resourceId, ipAddress, userAgent, metadata = {},
}: {
  userId?: string; action: AuditAction; resource?: string; resourceId?: string
  ipAddress?: string; userAgent?: string; metadata?: Record<string, unknown>
}) {
  try {
    const supabase = createAdminClient()
    await supabase.from('audit_logs').insert({ user_id: userId, action, resource, resource_id: resourceId, ip_address: ipAddress, user_agent: userAgent, metadata })
  } catch {
    console.error('[audit] Failed to write audit log', { action, resource })
  }
}
