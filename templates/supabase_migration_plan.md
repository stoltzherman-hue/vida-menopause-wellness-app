# Supabase Migration Plan

## Migration 001 - Extensions and enums

- Enable uuid generation.
- Create enums for stages, subscription tiers, medication categories, moderation statuses.

## Migration 002 - Users and profiles

- app_users.
- health_profiles.
- community_profiles.

## Migration 003 - Tracking

- symptom_definitions.
- user_symptoms.
- daily_checkins.
- symptom_logs.
- journal_entries.
- cycle_logs.

## Migration 004 - Medications

- medications.
- medication_adherence.

## Migration 005 - AI

- ai_conversations.
- ai_messages.
- ai_memories.
- ai_usage_events.

## Migration 006 - Community

- forum_categories.
- forum_posts.
- forum_replies.
- circles.
- circle_memberships.
- moderation_reports.

## Migration 007 - Billing and notifications

- subscriptions.
- notifications.
- webhook_events.

## Migration 008 - Reports and audit

- reports.
- audit_logs.

## RLS policy checklist

For every private table:

- Select own records.
- Insert own records.
- Update own records.
- Delete own records where allowed.

For community tables:

- Published public posts selectable.
- Private circle posts selectable only by active circle members.
- Insert requires community profile.
- Update/delete only by author or admin.

For admin:

- Admin role checked through secure server-side claims/table.
