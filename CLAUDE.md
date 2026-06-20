# CLAUDE.md - Vida Project Instructions

## Role

Act as the engineering and product build agent for Vida, a menopause and perimenopause wellness platform with free community and premium AI companion features.

## Non-negotiables

- Community participation is free.
- Premium monetizes AI companion, voice, advanced insights, unlimited tracking, reports, and enhanced personalization.
- Never build AI behavior that diagnoses, prescribes, or recommends medication dose changes.
- Use pattern language: "your data suggests" rather than causal certainty.
- Keep public community identity separate from private health data.
- Validate all inputs with Zod.
- Use server-side entitlement checks for premium features.
- Do not log PHI, journal text, AI chat content, medication details, or raw symptoms in standard app logs.
- Every health output must be educational and encourage provider discussion for medical decisions.

## Stack

- Next.js App Router.
- TypeScript strict mode.
- Tailwind CSS and shadcn/ui.
- PostgreSQL with Supabase preferred.
- Recharts for visualizations.
- Stripe for subscriptions.
- Resend or SendGrid for email.
- AI provider adapter under `lib/ai`.

## Build command assumptions

Use these until replaced by actual package scripts:

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Architecture rules

- Put reusable UI in `components/`.
- Put server actions in `server/actions/`.
- Put database access in `lib/db/` or `server/services/`.
- Put AI prompts and model calls in `lib/ai/`.
- Put safety checks in `lib/safety/`.
- Put validation schemas in `lib/validations/`.
- Keep route handlers thin; move business logic into services.
- Prefer explicit types over `any`.
- Use JSONB only for genuinely flexible data.

## Security rules

- No secrets in client components.
- No API key exposed to browser.
- Use RLS policies for user-owned health tables if Supabase is used.
- Implement rate limits on AI, auth-sensitive, community posting, and report endpoints.
- Add audit logs for account deletion, export, medication changes, subscription changes, and admin actions.
- Use least privilege for admin roles.

## AI behavior rules

- Use the system prompts in `prompts/`.
- Run red-flag detection before generating normal AI responses.
- For urgent health issues, prioritize escalation over coaching.
- AI insights require sufficient data. If insufficient, say more tracking is needed.
- Do not overstate evidence.
- Do not recommend supplements as treatment without caution.
- Do not present community anecdotes as medical evidence.

## UI rules

- Mobile-first.
- Minimum body text 16px.
- Use generous spacing and clear labels.
- Use large tap targets.
- Support dark mode.
- Include loading, error, and empty states.
- Make check-in fast and one-handed.

## Testing rules

Test at minimum:

- AI safety classifier/red flag routing.
- Entitlement checks.
- RLS/user ownership behavior.
- Daily check-in creation and update.
- Medication reminder logic.
- Stripe webhook idempotency.
- Community moderation reporting.
- Data export/deletion.

## Documentation imports

Use these docs as project knowledge:

- `docs/02_prd.md`
- `docs/05_health_tracking_taxonomy.md`
- `docs/06_ai_companion_design.md`
- `docs/07_ai_safety_medical_guardrails.md`
- `docs/08_technical_architecture.md`
- `docs/09_database_schema.md`
- `docs/15_privacy_security_compliance.md`
- `docs/17_implementation_roadmap.md`
