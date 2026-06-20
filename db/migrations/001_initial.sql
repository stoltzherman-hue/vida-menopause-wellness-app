-- Vida – Initial Database Migration
create extension if not exists "uuid-ossp";

create table if not exists user_profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,
  display_name    text,
  age_range       text,
  menopause_stage text check (menopause_stage in ('perimenopause','menopause','post_menopause','surgical_menopause','premature_ovarian_insufficiency','unsure')),
  primary_symptoms text[] default '{}',
  medical_history  text[] default '{}',
  lifestyle        jsonb  default '{}',
  goals            text[] default '{}',
  onboarding_completed boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table if not exists health_profiles (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null unique references auth.users(id) on delete cascade,
  hrt_status           text,
  medications          text[] default '{}',
  allergies            text[] default '{}',
  primary_care_provider text,
  last_period_date     date,
  average_cycle_length int check (average_cycle_length between 1 and 90),
  consent_health_data  boolean default false,
  consent_ai_analysis  boolean default false,
  consent_notifications boolean default false,
  consent_marketing    boolean default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table if not exists symptoms (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  category    text not null,
  description text,
  icon_name   text,
  is_active   boolean default true,
  sort_order  int default 0
);

create table if not exists user_symptoms (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  symptom_id uuid not null references symptoms(id) on delete cascade,
  is_pinned  boolean default false,
  created_at timestamptz default now(),
  unique (user_id, symptom_id)
);

create table if not exists daily_checkins (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  checkin_date        date not null,
  overall_wellbeing   smallint check (overall_wellbeing between 1 and 10),
  mood                smallint check (mood between 1 and 10),
  sleep_hours         numeric(4,1) check (sleep_hours between 0 and 24),
  sleep_quality       smallint check (sleep_quality between 1 and 5),
  energy_level        smallint check (energy_level between 1 and 10),
  hot_flash_count     smallint check (hot_flash_count >= 0),
  hot_flash_severity  smallint check (hot_flash_severity between 1 and 5),
  night_sweats_count  smallint check (night_sweats_count >= 0),
  night_sweats_severity smallint check (night_sweats_severity between 1 and 5),
  period_status       text check (period_status in ('none','spotting','light','normal','heavy')),
  triggers            text[] default '{}',
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (user_id, checkin_date)
);

create table if not exists symptom_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  checkin_id  uuid references daily_checkins(id) on delete set null,
  symptom_id  uuid not null references symptoms(id) on delete cascade,
  severity    smallint not null check (severity between 0 and 10),
  logged_at   timestamptz default now(),
  notes       text
);

create table if not exists journal_entries (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  checkin_id uuid references daily_checkins(id) on delete set null,
  entry_date date not null default current_date,
  body       text not null,
  ai_themes  text[] default '{}',
  ai_sentiment text,
  created_at timestamptz default now()
);

create table if not exists medications (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  name                 text not null,
  dose                 text,
  route                text,
  frequency            text,
  time_of_day          text[] default '{}',
  start_date           date,
  end_date             date,
  category             text not null check (category in ('estrogen','progesterone','combined_hrt','vaginal_estrogen','testosterone','non_hormonal_prescription','supplement','other')),
  prescribing_clinician text,
  active               boolean default true,
  notes                text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table if not exists medication_adherence (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  medication_id uuid not null references medications(id) on delete cascade,
  scheduled_at  timestamptz not null,
  taken_at      timestamptz,
  skipped       boolean default false,
  skip_reason   text,
  created_at    timestamptz default now()
);

create table if not exists cycle_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  start_date  date not null,
  end_date    date,
  flow_notes  text,
  cycle_length int,
  notes       text,
  created_at  timestamptz default now()
);

create table if not exists ai_conversations (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  mode       text not null default 'supportive_friend',
  title      text,
  archived   boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role            text not null check (role in ('user','assistant','system')),
  content         text not null,
  input_tokens    int,
  output_tokens   int,
  created_at      timestamptz default now()
);

create table if not exists ai_memories (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  value      text not null,
  source     text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, key)
);

create table if not exists community_profiles (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null unique references auth.users(id) on delete cascade,
  username     text not null unique,
  bio          text,
  avatar_url   text,
  is_anonymous boolean default false,
  stage        text,
  is_suspended boolean default false,
  joined_at    timestamptz default now()
);

create table if not exists forum_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  sort_order  int default 0,
  is_active   boolean default true
);

create table if not exists forum_posts (
  id             uuid primary key default uuid_generate_v4(),
  author_id      uuid not null references community_profiles(id) on delete cascade,
  category_id    uuid not null references forum_categories(id) on delete cascade,
  title          text not null,
  body           text not null,
  is_pinned      boolean default false,
  is_locked      boolean default false,
  reply_count    int default 0,
  reaction_count int default 0,
  is_removed     boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists forum_replies (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid not null references forum_posts(id) on delete cascade,
  author_id   uuid not null references community_profiles(id) on delete cascade,
  body        text not null,
  reaction_count int default 0,
  is_removed  boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists circles (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  stage       text,
  max_members int default 12,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists circle_memberships (
  id         uuid primary key default uuid_generate_v4(),
  circle_id  uuid not null references circles(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text default 'member' check (role in ('member','moderator')),
  joined_at  timestamptz default now(),
  unique (circle_id, user_id)
);

create table if not exists moderation_reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('post','reply','profile')),
  target_id   uuid not null,
  reason      text not null,
  details     text,
  status      text default 'pending' check (status in ('pending','reviewed','dismissed','actioned')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at  timestamptz default now()
);

create table if not exists wellness_content (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  body       text not null,
  category   text not null,
  tags       text[] default '{}',
  source_url text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  tier                    text not null default 'free' check (tier in ('free','premium')),
  status                  text not null default 'active' check (status in ('active','trialing','past_due','canceled','unpaid','paused')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean default false,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  data       jsonb default '{}',
  read       boolean default false,
  sent_at    timestamptz,
  created_at timestamptz default now()
);

create table if not exists reports (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  report_type  text not null default 'doctor_visit',
  start_date   date,
  end_date     date,
  parameters   jsonb default '{}',
  generated_at timestamptz default now()
);

create table if not exists audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  action      text not null,
  resource    text,
  resource_id text,
  ip_address  text,
  user_agent  text,
  metadata    jsonb default '{}',
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists idx_user_profiles_user_id on user_profiles(user_id);
create index if not exists idx_daily_checkins_user_date on daily_checkins(user_id, checkin_date desc);
create index if not exists idx_symptom_logs_user_id on symptom_logs(user_id, logged_at desc);
create index if not exists idx_medications_user_id on medications(user_id);
create index if not exists idx_ai_conversations_user on ai_conversations(user_id, created_at desc);
create index if not exists idx_ai_messages_conversation on ai_messages(conversation_id, created_at asc);
create index if not exists idx_forum_posts_category on forum_posts(category_id, created_at desc);
create index if not exists idx_audit_logs_user on audit_logs(user_id, created_at desc);
create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_notifications_user on notifications(user_id, created_at desc);

-- RLS
alter table user_profiles enable row level security;
alter table health_profiles enable row level security;
alter table daily_checkins enable row level security;
alter table symptom_logs enable row level security;
alter table journal_entries enable row level security;
alter table medications enable row level security;
alter table medication_adherence enable row level security;
alter table cycle_logs enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table ai_memories enable row level security;
alter table subscriptions enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;
alter table community_profiles enable row level security;
alter table user_symptoms enable row level security;
alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table symptoms enable row level security;
alter table forum_categories enable row level security;

create policy "user_profiles_owner" on user_profiles using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "health_profiles_owner" on health_profiles using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_checkins_owner" on daily_checkins using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "symptom_logs_owner" on symptom_logs using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "journal_entries_owner" on journal_entries using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "medications_owner" on medications using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "medication_adherence_owner" on medication_adherence using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cycle_logs_owner" on cycle_logs using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "ai_conversations_owner" on ai_conversations using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "ai_messages_owner" on ai_messages using (exists (select 1 from ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));
create policy "ai_memories_owner" on ai_memories using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "subscriptions_owner" on subscriptions using (user_id = auth.uid());
create policy "notifications_owner" on notifications using (user_id = auth.uid());
create policy "reports_owner" on reports using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "community_profiles_owner" on community_profiles using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user_symptoms_owner" on user_symptoms using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "forum_posts_read" on forum_posts for select using (not is_removed);
create policy "forum_posts_insert" on forum_posts for insert with check (auth.uid() is not null);
create policy "forum_posts_update_own" on forum_posts for update using (exists (select 1 from community_profiles cp where cp.id = author_id and cp.user_id = auth.uid()));
create policy "forum_replies_read" on forum_replies for select using (not is_removed);
create policy "forum_replies_insert" on forum_replies for insert with check (auth.uid() is not null);
create policy "symptoms_read" on symptoms for select using (is_active = true);
create policy "forum_categories_read" on forum_categories for select using (is_active = true);
