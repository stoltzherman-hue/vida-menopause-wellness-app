# Subscription and Billing Strategy

## Strategy

Keep the community free. Monetize premium personal intelligence.

## Free tier

Purpose:

- Build trust.
- Create habit.
- Create community growth.
- Let users experience value before paying.

Includes:

- Full community participation.
- Basic profile.
- Basic tracker for up to 5 symptoms.
- 30-day basic trends.
- Limited AI messages.
- Basic content.
- Basic reminders.

## Premium tier

Default price:

- Monthly: USD 12.99.
- Annual: USD 99.

Configurable by environment and Stripe price IDs.

Includes:

- Unlimited symptom tracking.
- Advanced AI insights.
- AI companion with higher limits.
- Voice companion.
- HRT/medication tracker.
- Doctor reports.
- Advanced dashboard.
- Advanced reminders/refills.
- Personalized weekly plan.
- Full wellness library.

## Entitlements

Server-side checks:

- `ai_chat_extended`.
- `ai_voice`.
- `advanced_insights`.
- `unlimited_symptoms`.
- `medication_tracker`.
- `doctor_reports`.
- `advanced_reminders`.

## Stripe objects

- Product: Vida Premium.
- Price: monthly.
- Price: annual.
- Customer linked to user.
- Subscription status synced to database.

## Webhook events

Handle:

- `checkout.session.completed`.
- `customer.subscription.created`.
- `customer.subscription.updated`.
- `customer.subscription.deleted`.
- `invoice.payment_succeeded`.
- `invoice.payment_failed`.

## Billing UX

- Show clear feature comparison.
- Avoid shame-based upgrade messaging.
- Let users keep community if subscription cancels.
- Provide customer portal.
- Show renewal date.
- Show data ownership independent of subscription.

## Metrics

- Free to premium conversion.
- Trial start if trial used.
- AI paywall hit rate.
- Report generation upgrade conversion.
- Churn.
- Failed payment recovery.
- Annual plan share.
