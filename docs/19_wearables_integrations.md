# Wearables and Integrations

## MVP position

Wearables are not required for MVP. Design the schema and UI so they can be added without rework.

## Future integrations

- Apple Health.
- Google Fit / Health Connect.
- Fitbit.
- Oura.
- Garmin.
- Withings scale.
- Blood pressure cuffs.
- Continuous glucose monitors only for users who already use them, with careful disclaimers.

## Useful wearable metrics

### Sleep

- Total sleep time.
- Sleep stages if available.
- Wake after sleep onset.
- Sleep efficiency.
- Sleep regularity.

### Cardiovascular

- Resting heart rate.
- Heart rate variability.
- Exercise heart rate.
- Blood pressure from connected cuff.

### Temperature

- Skin temperature deviation where available.
- Night temperature trends.

### Activity

- Steps.
- Active minutes.
- Strength workouts.
- Cardio workouts.
- Sedentary time.

### Recovery

- HRV trend.
- Readiness score if device provides it.

## Menopause-specific insight possibilities

- Night sweats vs sleep disruption.
- Hot flash reports vs skin temperature shifts.
- Exercise days vs mood/sleep.
- Stress/low HRV vs symptom severity.
- Resting HR changes vs sleep/vasomotor symptoms.

## Safety and accuracy

- Wearable data can be noisy.
- Do not present wearable-derived insights as diagnosis.
- Explain uncertainty.
- Let user disconnect and delete imported data.

## Data model

Add future table `wearable_observations`:

- id.
- user_id.
- provider.
- metric_type.
- value.
- unit.
- observed_at.
- source_device.
- metadata jsonb.

## Consent

Separate wearable consent from health tracking consent. Make clear what data is imported and how it is used.
