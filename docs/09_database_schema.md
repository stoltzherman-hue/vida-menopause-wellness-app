# Database Schema Design

## Design principles

- Separate private health data from public community data.
- Use explicit ownership fields.
- Add auditability to sensitive events.
- Support anonymous/pseudonymous users.
- Keep medication data private and access-controlled.
- Support future wearable integrations.

## Core tables

### app_users

Purpose: application identity wrapper around auth provider.

Fields:

- id uuid primary key.
- auth_provider_id text unique.
- email text nullable.
- display_name text nullable.
- subscription_tier text default `free`.
- created_at timestamptz.
- updated_at timestamptz.
- deleted_at timestamptz nullable.

### health_profiles

Private.

Fields:

- id uuid primary key.
- user_id uuid references app_users.
- age_range text nullable.
- menopause_stage text.
- stage_confidence text nullable.
- hrt_status text nullable.
- health_conditions text[] default empty.
- lifestyle jsonb.
- goals text[] default empty.
- ai_consent boolean default false.
- notification_consent boolean default false.
- created_at timestamptz.
- updated_at timestamptz.

### symptom_definitions

Reference table.

Fields:

- id uuid primary key.
- slug text unique.
- name text.
- category text.
- description text.
- common_triggers text[].
- is_sensitive boolean default false.
- tracking_fields jsonb.
- sort_order int.

### user_symptoms

Private selected symptoms.

Fields:

- id uuid primary key.
- user_id uuid.
- symptom_id uuid.
- is_primary boolean.
- daily_tracking_enabled boolean.
- display_order int.
- created_at timestamptz.

### daily_checkins

Private daily summary.

Fields:

- id uuid primary key.
- user_id uuid.
- checkin_date date.
- mood_score int nullable.
- sleep_hours numeric nullable.
- sleep_quality int nullable.
- energy_score int nullable.
- stress_score int nullable.
- period_status text nullable.
- triggers text[] default empty.
- notes_present boolean default false.
- created_at timestamptz.
- updated_at timestamptz.
- unique(user_id, checkin_date).

### symptom_logs

Private symptom detail.

Fields:

- id uuid primary key.
- user_id uuid.
- checkin_id uuid.
- symptom_id uuid.
- severity int check 0-10.
- count int nullable.
- duration_minutes int nullable.
- context jsonb.
- logged_at timestamptz.

### journal_entries

Private sensitive.

Fields:

- id uuid primary key.
- user_id uuid.
- checkin_id uuid nullable.
- body_encrypted text.
- ai_sentiment text nullable.
- ai_themes text[] nullable.
- created_at timestamptz.

### medications

Private.

Fields:

- id uuid primary key.
- user_id uuid.
- name text.
- category text.
- dose text nullable.
- route text nullable.
- frequency text.
- time_of_day text[] nullable.
- start_date date nullable.
- end_date date nullable.
- supply_count int nullable.
- refill_reminder_enabled boolean default false.
- status text default `active`.
- created_at timestamptz.
- updated_at timestamptz.

### medication_adherence

Private.

Fields:

- id uuid primary key.
- user_id uuid.
- medication_id uuid.
- scheduled_for timestamptz.
- taken_at timestamptz nullable.
- status text.
- notes text nullable.

### cycle_logs

Private.

Fields:

- id uuid primary key.
- user_id uuid.
- period_start date.
- period_end date nullable.
- flow text nullable.
- spotting boolean default false.
- heavy_bleeding boolean default false.
- cramps_severity int nullable.
- notes text nullable.
- created_at timestamptz.

### ai_conversations

Private.

Fields:

- id uuid primary key.
- user_id uuid.
- mode text.
- title text nullable.
- created_at timestamptz.
- updated_at timestamptz.

### ai_messages

Private.

Fields:

- id uuid primary key.
- conversation_id uuid.
- user_id uuid.
- role text.
- content_encrypted text.
- safety_flags text[] default empty.
- token_count int nullable.
- created_at timestamptz.

### ai_memories

Private, consent-based.

Fields:

- id uuid primary key.
- user_id uuid.
- memory_type text.
- summary text.
- sensitivity text.
- user_approved boolean default false.
- created_at timestamptz.
- deleted_at timestamptz nullable.

### community_profiles

Public/pseudonymous.

Fields:

- id uuid primary key.
- user_id uuid unique.
- handle text unique.
- display_name text.
- avatar_seed text.
- bio text nullable.
- visibility text default `pseudonymous`.
- created_at timestamptz.

### forum_categories

Fields:

- id uuid primary key.
- slug text unique.
- name text.
- description text.
- moderation_level text.
- sort_order int.

### forum_posts

Community.

Fields:

- id uuid primary key.
- author_profile_id uuid.
- category_id uuid.
- circle_id uuid nullable.
- title text.
- body text.
- status text default `published`.
- upvote_count int default 0.
- reply_count int default 0.
- created_at timestamptz.
- updated_at timestamptz.

### forum_replies

Fields:

- id uuid primary key.
- post_id uuid.
- author_profile_id uuid.
- parent_reply_id uuid nullable.
- body text.
- status text default `published`.
- created_at timestamptz.

### circles

Fields:

- id uuid primary key.
- name text.
- description text.
- stage_filter text[] nullable.
- symptom_tags text[] nullable.
- max_members int default 12.
- privacy text default `private`.
- created_at timestamptz.

### circle_memberships

Fields:

- id uuid primary key.
- circle_id uuid.
- profile_id uuid.
- role text default `member`.
- status text default `active`.
- joined_at timestamptz.

### subscriptions

Fields:

- id uuid primary key.
- user_id uuid.
- stripe_customer_id text nullable.
- stripe_subscription_id text nullable.
- tier text.
- status text.
- current_period_end timestamptz nullable.
- created_at timestamptz.
- updated_at timestamptz.

### reports

Private.

Fields:

- id uuid primary key.
- user_id uuid.
- report_type text.
- date_from date.
- date_to date.
- content_json jsonb.
- created_at timestamptz.

### notifications

Fields:

- id uuid primary key.
- user_id uuid.
- type text.
- channel text.
- title text.
- body text.
- scheduled_for timestamptz nullable.
- sent_at timestamptz nullable.
- status text.

### moderation_reports

Fields:

- id uuid primary key.
- reporter_profile_id uuid.
- target_type text.
- target_id uuid.
- reason text.
- details text nullable.
- status text default `open`.
- created_at timestamptz.

### audit_logs

Fields:

- id uuid primary key.
- user_id uuid nullable.
- actor_type text.
- action text.
- entity_type text nullable.
- entity_id uuid nullable.
- metadata jsonb.
- ip_hash text nullable.
- created_at timestamptz.

## RLS policy summary

- Users can select/insert/update/delete their own private health records.
- Users can select their own AI conversations/messages/memories.
- Community posts are public if status is published and not private Circle content.
- Circle content is visible only to active members.
- Admins access moderation/admin views through role checks.

## Indexes

Recommended:

- `daily_checkins(user_id, checkin_date)`.
- `symptom_logs(user_id, symptom_id, logged_at)`.
- `medication_adherence(user_id, scheduled_for)`.
- `forum_posts(category_id, created_at)`.
- `forum_posts(circle_id, created_at)`.
- `ai_messages(conversation_id, created_at)`.
- `notifications(user_id, scheduled_for, status)`.
- `subscriptions(user_id, status)`.
