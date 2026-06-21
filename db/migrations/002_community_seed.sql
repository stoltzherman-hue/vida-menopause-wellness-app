-- Run this in your Supabase SQL Editor

-- Fix forum_posts insert policy to verify author_id belongs to current user
drop policy if exists "forum_posts_insert" on forum_posts;
create policy "forum_posts_insert" on forum_posts for insert
  with check (
    auth.uid() is not null and
    exists (select 1 from community_profiles cp where cp.id = author_id and cp.user_id = auth.uid())
  );

-- Fix forum_replies insert policy
drop policy if exists "forum_replies_insert" on forum_replies;
create policy "forum_replies_insert" on forum_replies for insert
  with check (
    auth.uid() is not null and
    exists (select 1 from community_profiles cp where cp.id = author_id and cp.user_id = auth.uid())
  );

-- Allow authenticated users to read other community profiles (for showing author names)
drop policy if exists "community_profiles_owner" on community_profiles;
create policy "community_profiles_own_all" on community_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "community_profiles_others_read" on community_profiles
  for select using (auth.uid() is not null);

-- Seed forum categories
insert into forum_categories (name, slug, description, sort_order) values
  ('Hot flashes & vasomotor', 'hot-flashes', 'Discuss hot flashes, night sweats, and vasomotor symptoms.', 1),
  ('Sleep & fatigue', 'sleep', 'Sleep issues, fatigue, and energy management strategies.', 2),
  ('HRT & medications', 'hrt', 'Hormone replacement therapy, medications, and alternatives.', 3),
  ('Mood & mental health', 'mood', 'Mood swings, anxiety, depression, and emotional wellbeing.', 4),
  ('Brain fog & memory', 'brain-fog', 'Cognitive changes, memory, and staying sharp.', 5),
  ('Relationships & intimacy', 'relationships', 'Navigating relationships, intimacy, and libido changes.', 6),
  ('Nutrition & weight', 'nutrition', 'Diet, nutrition, weight changes, and metabolism.', 7),
  ('Exercise & movement', 'exercise', 'Staying active and moving well during menopause.', 8),
  ('Ask a question', 'questions', 'Any question welcome — no question is too small.', 9),
  ('Wins & celebrations', 'wins', 'Share your victories, big and small. We celebrate here!', 10)
on conflict (slug) do nothing;
