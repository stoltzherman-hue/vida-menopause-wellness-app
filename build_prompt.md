# Build Prompt: Vida Menopause and Perimenopause Wellness Platform

You are Claude Code acting as principal engineer, product architect, UX lead, privacy/security reviewer, and implementation builder for a production-grade mobile-first web application called Vida.

## Mission

Build Vida, a trusted menopause and perimenopause wellness platform that combines:

1. A free social community where women can share experiences, join topic forums, build Circles, and feel less alone.
2. A premium AI companion that can talk by text and voice, act as a supportive friend and coach, help users understand symptom patterns, prepare for doctors, remember preferences, provide reminders, and encourage evidence-informed self-management.
3. A health tracking and dashboard layer that tells the user's menopause story over time through symptoms, triggers, cycle changes, medication/HRT adherence, sleep, mood, lifestyle, and optional wearable data.

## Product principles

- Women first: validating, mature, respectful, never patronizing.
- Community is free: do not gate posting, replying, joining forums, or joining core Circles behind subscription.
- Premium is intelligence: monetize AI companion, voice, advanced correlations, unlimited tracking, reports, personalized plans, and enhanced reminders.
- Safety before engagement: never diagnose, prescribe, or replace a clinician.
- Privacy by design: health data minimization, consent, export, deletion, encryption, row-level security, audit logs, and clear data boundaries.
- Mobile-first: fast daily check-in under two minutes, large tap targets, readable typography, dark mode, and low cognitive load.
- Build iteratively: deliver a working vertical slice first, then expand.

## Core stack

Use this stack unless a serious compatibility issue is discovered:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: Next.js Route Handlers and Server Actions.
- Database: PostgreSQL via Supabase or Vercel Postgres. Prefer Supabase for auth/RLS speed unless instructed otherwise.
- Auth: Clerk or NextAuth. Must support anonymous browsing, pseudonymous community profile, and optional account creation.
- AI provider: implement provider abstraction. MVP can use OpenAI Responses API or Anthropic API depending on environment variables. Do not hard-code one provider throughout the app.
- Voice: phase 2 using browser speech APIs or a Realtime/audio provider adapter. Do not ship always-listening voice.
- Charts: Recharts.
- Notifications: web push plus email via Resend or SendGrid.
- Payments: Stripe subscriptions.
- Hosting: Vercel.

## Required repository structure

Create a clean full-stack project structure:

```txt
vida/
  app/
    (marketing)/
    (auth)/
    (app)/
      dashboard/
      check-in/
      tracker/
      companion/
      community/
      circles/
      medication/
      reports/
      settings/
    api/
      ai/
      checkins/
      community/
      medications/
      notifications/
      reports/
      stripe/
      webhooks/
  components/
    ui/
    layout/
    onboarding/
    tracker/
    dashboard/
    ai/
    community/
    medication/
    reports/
  lib/
    ai/
    auth/
    db/
    safety/
    validations/
    analytics/
    notifications/
    stripe/
    utils/
  server/
    actions/
    services/
  db/
    migrations/
    seed/
  types/
  content/
  tests/
  docs/
  public/
```

## Build phases

### Phase 1: Foundation

Build:

- Next.js app with TypeScript strict mode.
- Tailwind and shadcn/ui.
- Theme tokens: sage green, warm terracotta, soft cream, dusty rose, charcoal text.
- Dark mode support.
- Auth with anonymous browse and optional account creation.
- Database schema and migrations.
- Error boundary, loading states, empty states, mobile nav, app shell.
- Environment variable template.
- Basic audit logging helper.
- Zod schemas for all API inputs.

Acceptance criteria:

- App runs locally.
- Database migration applies cleanly.
- Authenticated and anonymous flows are separated.
- No API route accepts unvalidated input.
- Health data tables have user ownership enforcement.

### Phase 2: Onboarding and health profile

Build onboarding flow:

- Age range or date of birth optional, exact age optional for privacy.
- Menopause stage: perimenopause, menopause, post-menopause, surgical menopause, premature ovarian insufficiency, unsure.
- Primary symptoms multi-select with 30+ options.
- HRT/medication status.
- Medical history: thyroid, diabetes, cardiovascular disease, osteoporosis/osteopenia, hypertension, migraine, depression/anxiety, breast cancer history, hysterectomy, oophorectomy, endometriosis, PCOS, other.
- Lifestyle: sleep, stress, alcohol, caffeine, exercise, diet preferences, smoking/vaping status.
- Goals: rank top 3 improvements.
- Consent screens for health data, AI use, community display name, notifications.
- AI-generated wellness plan after onboarding, but only as educational support.

Acceptance criteria:

- User can finish onboarding in under 5 minutes.
- User can skip sensitive questions.
- User can edit all answers later.
- Generated wellness plan includes disclaimer and uses non-diagnostic language.

### Phase 3: Daily symptom tracker

Build daily check-in:

- Quick check-in under 2 minutes.
- Top symptoms 0-10 intensity.
- Mood 1-10 or labels.
- Sleep hours and sleep quality 1-5.
- Energy 1-10.
- Hot flashes count and severity.
- Night sweats count and severity.
- Period status if applicable.
- Triggers: alcohol, caffeine, spicy food, sugar, stress, poor sleep, heat, exercise, missed medication, travel, conflict, workload, illness.
- Journal text field with optional AI sentiment and theme extraction.
- One-tap symptom logging.
- Save/edit history.

Acceptance criteria:

- A user can log a check-in with no typing.
- Inputs work well on mobile.
- User can select which symptoms appear daily.
- No AI insight is generated unless user consents.

### Phase 4: Dashboard and insights

Build dashboard:

- Weekly and monthly symptom trend charts.
- Symptom heatmap.
- Trigger correlation cards.
- Sleep vs symptom overlay.
- Medication adherence and symptom relation.
- Goal progress.
- AI insight cards with confidence and limitations.
- Red-flag education panel.
- Doctor visit report preview.

AI wording rules:

- Use "Your data suggests a pattern" not "This caused".
- Include "This is not medical advice" in medical-adjacent outputs.
- Recommend discussing medication or HRT changes with a clinician.
- Never infer diagnosis from symptoms.

Acceptance criteria:

- Dashboard renders even with sparse data.
- Insights require minimum data thresholds before correlation claims.
- Charts are readable on mobile.

### Phase 5: Premium AI companion

Build companion module:

- Text chat first.
- Persistent but consent-based memory.
- Conversation modes: Supportive Friend, Symptom Coach, Sleep Wind-down, Doctor Prep, HRT Questions, Work/Relationship Conversation Prep, Lifestyle Planner, Community Guide.
- Free users get limited monthly AI messages.
- Premium users get higher limits, advanced insights, reports, and voice.
- AI can call internal tools for user profile, recent symptoms, check-ins, medications, goals, and content library.
- AI must refuse diagnosis, prescribing, medication dose changes, and unsafe advice.
- AI must escalate red flags.

Acceptance criteria:

- AI response includes warm validation and practical next steps.
- AI can summarize user data accurately.
- AI cites in-app source categories or says when it is general educational information.
- AI has safety tests for red flags and crisis content.

### Phase 6: Medication and HRT tracker

Build:

- Medication name, dose, route, frequency, time of day, start date, prescribing clinician optional.
- HRT categories: estrogen, progesterone/progestogen, combined, vaginal estrogen, testosterone, non-hormonal prescription, supplements, other.
- Adherence logging.
- Reminders.
- Refill reminders.
- Side-effect notes.
- Symptom-before/after timeline.
- Doctor visit prep report.

Acceptance criteria:

- App never recommends starting/stopping/changing medication.
- Refill reminders are informational.
- HRT insights are correlation summaries only.

### Phase 7: Free community

Build:

- Anonymous or pseudonymous profiles.
- Topic forums.
- Posts, replies, reactions, bookmarks, reporting.
- Circles of 8-12 users matched by stage, symptoms, goals, and timezone preference.
- Community guidelines.
- Moderation queue.
- Misinformation reporting.
- Crisis escalation messaging.

Acceptance criteria:

- Core community participation is free.
- Users can hide identity.
- Personal health data from tracker is never posted automatically.
- Strong moderation primitives exist from day one.

### Phase 8: Billing

Build Stripe:

- Free tier.
- Premium monthly at configurable price, default 12.99 USD.
- Annual plan at configurable price, default 99 USD.
- Checkout, customer portal, webhook handling.
- Subscription entitlement checks.
- Grace periods and failed payment states.

Acceptance criteria:

- Webhooks are idempotent.
- Premium features check server-side entitlements.
- Prices are environment/config driven, not hard-coded.

### Phase 9: Reports and export

Build:

- Doctor visit PDF/print view.
- CSV export.
- Report includes symptom trends, medication adherence, cycle history, user questions, red flags, and notes.
- User can choose date range and included data.

Acceptance criteria:

- Report is clear, concise, and clinician-friendly.
- Export respects user consent and ownership.

### Phase 10: Production hardening

Build:

- Tests: unit, integration, E2E smoke tests.
- Accessibility checks.
- Rate limiting.
- AI cost controls.
- Logging without PHI leakage.
- Admin dashboard.
- Privacy/data deletion flow.
- Security headers.
- Backup strategy.
- Launch checklist.

Acceptance criteria:

- No secrets in client bundle.
- No PHI in logs.
- User can delete account and health data.
- Admin access is role based.

## Database requirements

Use normalized tables with JSONB only where flexible tracking makes sense. Include:

- users/profile tables.
- health_profiles.
- symptoms and user_symptoms.
- daily_checkins.
- symptom_logs.
- trigger_logs.
- journal_entries.
- medications.
- medication_adherence.
- cycle_logs.
- ai_conversations.
- ai_messages.
- ai_memories.
- wellness_content.
- community_profiles.
- forum_categories.
- forum_posts.
- forum_replies.
- circles.
- circle_memberships.
- reports.
- subscriptions.
- notifications.
- audit_logs.
- moderation_reports.

Implement indexes for user_id, date, created_at, symptom_id, category, and subscription status. Implement RLS if using Supabase.

## AI safety requirements

All AI features must follow:

- Never diagnose.
- Never prescribe.
- Never recommend medication dose changes.
- Never tell a user to ignore symptoms.
- Never claim certainty from correlations.
- Escalate red flags including postmenopausal bleeding, chest pain, stroke symptoms, severe depression/self-harm, heavy bleeding, fainting, severe sudden headache, suspected blood clot, allergic reaction, and severe abdominal/pelvic pain.
- Always include clinician consultation language for medical decisions.
- Keep tone warm, respectful, and empowering.

## Privacy requirements

- Health data is sensitive.
- Collect minimum necessary data.
- Separate public community identity from private health profile.
- No health data is shared to community without explicit user action.
- Export and deletion must be available.
- AI memory must be visible, editable, and deletable.
- Logs must not contain raw health journal text or AI conversations unless explicitly required and protected.
- Include consent for AI analysis, notifications, community, and marketing separately.
- Build with HIPAA-aware architecture, but do not claim HIPAA compliance unless a legal/compliance review confirms covered entity/business associate status, BAAs, policies, training, risk analysis, and operational controls.

## Design requirements

- Mature, calm, premium wellness feel.
- Avoid childish pink-only design.
- Minimum 16px body text.
- Large tap targets.
- High contrast mode.
- Dark mode for night logging.
- Plain language.
- Minimal gestures.
- WCAG 2.1 AA target.

## Output expectations

Generate working code with:

- Clean file structure.
- TypeScript types.
- Zod validation.
- Error handling.
- Loading states.
- Empty states.
- Responsive mobile-first UI.
- Database migrations and seeds.
- Environment variable template.
- Tests for critical logic.
- Documentation for setup and deployment.

Work in small verifiable commits or phases. After each phase, provide:

- What changed.
- Files created/edited.
- How to run/test.
- Known risks or unfinished items.
- Next recommended step.
