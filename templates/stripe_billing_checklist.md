# Stripe Billing Checklist

## Setup

- Create Vida Premium product.
- Create monthly price.
- Create annual price.
- Add price IDs to environment variables.
- Configure customer portal.
- Configure webhook endpoint.

## Implementation

- Checkout route creates session.
- Portal route creates billing portal session.
- Webhook verifies signature.
- Webhook stores event ID for idempotency.
- Subscription record synced.
- Entitlements derived server-side.

## Webhook test cases

- Checkout completed.
- Subscription created.
- Subscription updated.
- Subscription canceled.
- Payment succeeded.
- Payment failed.
- Duplicate webhook event.

## UX

- Clear plan comparison.
- Annual savings display configurable.
- No loss of community access after cancellation.
- Clear renewal date.
- Manage billing link.

## Metrics

- Checkout started.
- Checkout completed.
- Payment failed.
- Subscription active.
- Canceled.
- Reactivated.
