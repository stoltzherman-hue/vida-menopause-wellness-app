# Product Requirements Document - Vida

## Objective

Build a production-ready MVP for Vida: a mobile-first menopause and perimenopause wellness platform with free community and premium AI-powered companion/tracking intelligence.

## Scope

### In scope for MVP

- Marketing landing page.
- Auth and anonymous browsing.
- Onboarding and health profile.
- Daily check-in and symptom tracking.
- Dashboard with trends and simple insights.
- AI companion text chat with safety guardrails.
- HRT/medication tracker.
- Free community forums and basic Circles.
- Stripe subscriptions.
- Doctor report export.
- Admin moderation basics.
- Privacy settings, export, and deletion.

### Out of scope for MVP

- Direct clinical diagnosis.
- Prescribing or medication adjustments.
- Telehealth consults.
- Medical device claims.
- Fertility optimization.
- Lab ordering.
- Insurance billing.
- Always-on voice listening.

## Personas

### Persona 1: The confused early perimenopause user

- Age: 38-47.
- Feels "off" but does not know why.
- Needs validation and symptom education.
- Main features: onboarding, symptom checklist, community stories, AI explainer.

### Persona 2: The overwhelmed high-functioning professional

- Age: 42-55.
- Sleep issues, brain fog, mood swings, hot flashes.
- Needs fast logging, work coping tools, doctor prep.
- Main features: daily check-in, dashboard, AI companion, reports.

### Persona 3: The HRT user

- Age: 45-60.
- Wants to track symptoms, adherence, side effects, and doctor questions.
- Main features: medication tracker, HRT timeline, report export.

### Persona 4: The isolated post-menopause user

- Age: 50-65+.
- Wants community, sexual health, long-term wellness, confidence.
- Main features: community, Circles, content library, AI companion.

## Functional requirements

### Onboarding

- Collect minimal profile.
- Allow skip for sensitive questions.
- Record menopause stage.
- Record symptoms and goals.
- Record medication/HRT status.
- Generate educational wellness plan.

### Tracker

- Daily symptom intensity.
- Sleep, mood, energy.
- Period/cycle status where applicable.
- Trigger toggles.
- Journal text.
- Medication adherence.

### Dashboard

- Symptom trends.
- Trigger correlation.
- Sleep relationship.
- Medication timeline.
- Goal progress.
- AI insight cards.

### AI companion

- Warm support.
- Education.
- Pattern explanation.
- Doctor-prep questions.
- Relationship/work conversation prep.
- Sleep wind-down.
- Red-flag routing.

### Community

- Topic forums.
- Anonymous/pseudonymous profiles.
- Replies and reactions.
- Reporting and moderation.
- Circles.

### Billing

- Free and Premium plans.
- Stripe checkout.
- Subscription status sync.
- Server-side entitlements.

### Reports

- Date-range report.
- PDF/print view.
- CSV export.
- Doctor-friendly summary.

## Non-functional requirements

- Mobile-first performance.
- WCAG 2.1 AA target.
- TypeScript strict.
- Secure by default.
- Privacy settings visible.
- AI rate limiting.
- Audit logs.
- Data deletion and export.

## MVP release criteria

- A new user can join, onboard, track symptoms, view trends, use limited AI, join community, upgrade, and export a report.
- All high-risk AI safety test cases pass.
- All sensitive user data is access-controlled.
- No PHI appears in standard logs.
- Community has report/moderation flow.
