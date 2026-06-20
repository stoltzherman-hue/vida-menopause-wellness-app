# Dashboard and Analytics Framework

## Dashboard goal

The dashboard should tell the user's menopause story clearly: what is changing, what patterns may exist, what improved, what needs attention, and what to discuss with a healthcare provider.

## User dashboard modules

### Today

- Check-in status.
- Medication reminders.
- Top symptom quick log.
- AI companion entry.

### Weekly summary

- Average symptom severity.
- Best/worst days.
- Sleep trend.
- Mood trend.
- Trigger highlights.
- Encouragement.

### Symptom heatmap

Rows: symptoms.
Columns: days.
Intensity: severity.

### Trigger cards

Examples:

- "Hot flashes were higher on 3 of 4 days after alcohol. This is a pattern to track, not proof of cause."
- "Sleep quality was higher on days with exercise."

### Medication/HRT timeline

- Start date.
- Adherence.
- Symptom trend before/after.
- Side effect notes.

### Cycle timeline

- Period dates.
- Cycle length changes.
- Flow changes.
- Spotting flags.

### Goals

- Sleep goal.
- Movement goal.
- Symptom reduction goal.
- Doctor prep goal.

### Doctor-prep summary

- Top symptoms.
- Changes since last report.
- Medication adherence.
- Questions.
- Red flags.

## Insight confidence levels

### Insufficient data

- Fewer than 7 check-ins.
- Say: "Keep tracking for a few more days."

### Early pattern

- 7-13 check-ins.
- Say: "An early pattern may be emerging."

### Moderate pattern

- 14-29 check-ins.
- Say: "Your data suggests a pattern."

### Stronger recurring pattern

- 30+ check-ins with repeated association.
- Say: "This pattern has appeared repeatedly in your entries."

Never say "cause".

## Product analytics

Track events without PHI:

- Signup.
- Onboarding step completed.
- Check-in completed.
- Dashboard viewed.
- AI message sent.
- Upgrade screen viewed.
- Subscription started/canceled.
- Community post created.
- Circle joined.
- Report generated.

Do not include:

- Symptom names in analytics unless aggregated and de-identified.
- Journal text.
- Chat content.
- Medication names.
- Sexual health details.

## Business KPIs

- Activation rate.
- Daily check-in completion.
- Weekly active users.
- Community contribution rate.
- AI engagement.
- Premium conversion.
- Churn.
- Report generation.
- Safety escalation rate.

## Clinical safety analytics

Internal only, de-identified where possible:

- Red-flag detection count.
- Safety response pass/fail in tests.
- User reports of unsafe AI output.
- Moderation category trends.
