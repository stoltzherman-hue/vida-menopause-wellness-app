-- Voice companion: new 'voice' subscription tier + per-period voice minute tracking

-- Allow the new tier
alter table subscriptions drop constraint if exists subscriptions_tier_check;
alter table subscriptions add constraint subscriptions_tier_check
  check (tier in ('free','premium','voice'));

-- Track voice usage per billing period (seconds, aggregated per user)
create table if not exists voice_usage (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  seconds_used integer not null default 0,
  updated_at   timestamptz default now(),
  unique (user_id, period_start)
);

create index if not exists voice_usage_user_period_idx on voice_usage (user_id, period_start);

alter table voice_usage enable row level security;

-- Users may read their own usage; writes happen only via the service-role (admin) client
drop policy if exists "voice_usage_select_own" on voice_usage;
create policy "voice_usage_select_own" on voice_usage
  for select using (auth.uid() = user_id);
