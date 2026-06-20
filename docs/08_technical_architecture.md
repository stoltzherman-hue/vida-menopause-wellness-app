# Technical Architecture

## Architecture summary

Vida is a server-rendered and API-backed Next.js application with PostgreSQL persistence, AI provider abstraction, Stripe billing, notification services, and strict separation between public community identity and private health data.

## Layers

### Frontend

- App Router pages and layouts.
- Server Components for data-heavy views.
- Client Components for forms, charts, check-in interactions, chat, and voice.
- shadcn/ui components.
- Tailwind design tokens.

### Backend

- Route Handlers for webhooks and AI streaming.
- Server Actions for authenticated app mutations.
- Service layer for business logic.
- Zod validation.
- Rate limiting.

### Data

- PostgreSQL.
- RLS when using Supabase.
- Separate public community profile from private health profile.
- JSONB for dynamic symptom payloads only where appropriate.

### AI

- `lib/ai/provider.ts` abstracts model provider.
- `lib/ai/prompts.ts` stores prompt templates.
- `lib/safety/red-flags.ts` checks urgent content.
- `lib/ai/tools.ts` controls access to user data summaries.
- AI call logging stores metadata only by default.

### Billing

- Stripe checkout and portal.
- Webhook handler with idempotency.
- Entitlements table/cache.

### Notifications

- In-app notifications.
- Email notifications.
- Web push in later phase.
- User preference center.

## Recommended packages

- `zod` for validation.
- `react-hook-form` and `@hookform/resolvers`.
- `recharts`.
- `date-fns`.
- `stripe`.
- `resend`.
- `next-themes`.
- `lucide-react`.
- `sonner`.
- `@supabase/supabase-js` if Supabase.
- `drizzle-orm` or Prisma. Prefer Drizzle for type-safe SQL and migrations.

## AI provider abstraction

Interface:

```ts
export interface AiProvider {
  generateText(input: AiTextInput): Promise<AiTextOutput>;
  streamText(input: AiTextInput): AsyncIterable<AiStreamEvent>;
  transcribeAudio?(input: AudioInput): Promise<Transcript>;
  synthesizeSpeech?(input: SpeechInput): Promise<AudioOutput>;
}
```

Environment variables decide provider:

- `AI_PROVIDER=openai|anthropic|mock`
- `AI_MODEL=...`
- `AI_VOICE_MODEL=...`

## Security controls

- Auth required for private health data.
- CSRF protection where applicable.
- Rate limit AI, community posting, and auth endpoints.
- Store secrets only server-side.
- Encrypt sensitive fields where feasible.
- Mask sensitive fields in admin.
- Audit important events.
- Use secure headers.

## Performance targets

- Landing page LCP under 2.5s on mobile.
- Dashboard initial render under 3s with cached summaries.
- Check-in save under 1s perceived response.
- AI first token under 3s where streaming is supported.

## Observability

Track metadata without PHI:

- Request latency.
- Error rates.
- AI token/cost usage by feature, not content.
- Conversion funnel events.
- Community moderation volume.
- Notification delivery.

Do not track:

- Raw symptoms.
- Journal text.
- Medication names.
- AI conversation text.
- Sexual health fields.
