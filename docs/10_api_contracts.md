# API Contracts

## Principles

- Validate all inputs with Zod.
- Authenticate private endpoints.
- Authorize by ownership.
- Return typed errors.
- Avoid leaking sensitive details in errors.
- Rate limit AI and community endpoints.

## Endpoint summary

### Health profile

`GET /api/profile`

Returns private profile summary for authenticated user.

`PATCH /api/profile`

Updates health profile.

### Onboarding

`POST /api/onboarding/complete`

Body:

```json
{
  "stage": "perimenopause",
  "symptomSlugs": ["hot_flashes", "sleep_disruption"],
  "goals": ["sleep_better", "reduce_hot_flashes"],
  "aiConsent": true
}
```

### Check-ins

`POST /api/checkins`

Creates or updates daily check-in.

`GET /api/checkins?from=YYYY-MM-DD&to=YYYY-MM-DD`

Returns check-ins for date range.

### Dashboard

`GET /api/dashboard/summary?range=30d`

Returns aggregated metrics only, not raw journal text.

### AI companion

`POST /api/ai/chat`

Body:

```json
{
  "conversationId": "uuid-or-null",
  "mode": "supportive_friend",
  "message": "I slept terribly again",
  "allowHealthContext": true
}
```

Server flow:

1. Authenticate.
2. Check entitlement and rate limit.
3. Validate input.
4. Run red-flag classifier.
5. Load minimal context.
6. Generate response.
7. Store encrypted message.
8. Return response or stream.

### AI insights

`POST /api/ai/insights`

Generates dashboard insight cards. Premium only except limited free sample.

### Medications

`POST /api/medications`

Create medication.

`PATCH /api/medications/:id`

Update medication.

`POST /api/medications/:id/adherence`

Log taken/skipped.

### Community

`GET /api/community/categories`

`GET /api/community/posts?category=slug`

`POST /api/community/posts`

`POST /api/community/replies`

`POST /api/community/report`

### Circles

`GET /api/circles/recommended`

`POST /api/circles/:id/join`

`GET /api/circles/:id/posts`

### Billing

`POST /api/stripe/checkout`

`POST /api/stripe/portal`

`POST /api/webhooks/stripe`

Webhook must be idempotent and verify signature.

### Reports

`POST /api/reports/doctor-summary`

Body:

```json
{
  "from": "2026-05-01",
  "to": "2026-06-01",
  "include": ["symptoms", "medications", "cycle", "questions"]
}
```

### Data rights

`GET /api/export`

`POST /api/delete-account/request`

`POST /api/delete-account/confirm`

## Error format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fieldErrors": {}
  }
}
```

## Rate limits

- AI chat free: configurable monthly limit.
- AI chat premium: high but capped to protect cost.
- Community post: per minute and per day.
- Reports: daily limit.
- Auth-sensitive endpoints: strict.
