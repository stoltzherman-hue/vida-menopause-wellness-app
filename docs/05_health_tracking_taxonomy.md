# Menopause Health Tracking Taxonomy

## Summary

Vida should track the menopause experience across symptoms, cycle changes, sleep, mood, lifestyle, medications/HRT, sexual/genitourinary health, and optional device data. Tracking must be configurable because not every user has the same symptoms or comfort level.

## Tracking principles

- Daily check-in must be short.
- Advanced details must be optional.
- Sensitive categories require clear privacy reassurance.
- Use severity scales consistently.
- Avoid diagnosis language.
- Allow users to hide categories.

## Symptom categories

### 1. Vasomotor symptoms

Track:

- Hot flashes count.
- Hot flash severity 0-10.
- Hot flash duration optional.
- Night sweats count.
- Night sweat severity 0-10.
- Chills after sweating.
- Palpitations during episodes.

Useful dashboard views:

- Frequency by time of day.
- Severity trend.
- Trigger association.
- Sleep disruption association.

### 2. Sleep and energy

Track:

- Bedtime.
- Wake time.
- Sleep duration.
- Sleep quality 1-5.
- Time to fall asleep.
- Night awakenings.
- Wake after night sweats.
- Morning restfulness.
- Daytime fatigue.
- Naps.
- Snoring or possible apnea concern optional.

Dashboard:

- Sleep duration vs hot flashes.
- Sleep quality vs mood/energy.
- Night sweats and awakenings.

### 3. Mood and mental wellbeing

Track:

- Mood 1-10.
- Anxiety 0-10.
- Irritability 0-10.
- Low mood 0-10.
- Overwhelm 0-10.
- Stress 0-10.
- Panic symptoms optional.
- Motivation.
- Social withdrawal.
- Self-esteem/body confidence.

Safety:

- Self-harm, suicidal ideation, or severe depression must trigger crisis routing.

### 4. Cognitive symptoms

Track:

- Brain fog.
- Memory lapses.
- Word-finding difficulty.
- Focus/concentration.
- Mental fatigue.
- Work productivity impact.

Dashboard:

- Cognitive symptoms vs sleep.
- Cognitive symptoms vs stress.
- Cognitive symptoms vs cycle phase if applicable.

### 5. Cycle and bleeding

For perimenopause and relevant users:

- Period start/end.
- Flow: spotting/light/medium/heavy/flooding.
- Clots.
- Cycle length.
- Missed period.
- Spotting between periods.
- Pain/cramps.
- Breast tenderness.
- PMS-like symptoms.

Red flags:

- Any bleeding after 12 months without a period should advise healthcare provider review.
- Very heavy bleeding, dizziness, fainting, or soaking pads quickly should route to urgent care guidance.

### 6. Genitourinary and sexual health

Sensitive optional tracking:

- Vaginal dryness.
- Pain with sex.
- Bleeding after sex.
- Low libido.
- Arousal difficulty.
- Urinary urgency.
- Urinary leakage.
- Recurrent UTI symptoms.
- Pelvic discomfort.
- Vulvar itching/burning.

Privacy:

- Hide by default in previews.
- Require explicit tap to view details.

### 7. Musculoskeletal and bone health

Track:

- Joint pain.
- Muscle aches.
- Back pain.
- Stiffness.
- Cramps.
- Strength training sessions.
- Balance/falls.
- Fracture history optional.
- Bone density scan date/result optional.
- Calcium/vitamin D intake optional, without prescribing.

Dashboard:

- Strength sessions per week.
- Pain trend.
- Falls/fracture notes.

### 8. Metabolic, body, and cardiovascular indicators

Track optional:

- Weight.
- Waist circumference.
- Appetite/cravings.
- Bloating.
- Blood pressure.
- Resting heart rate.
- Lipid labs manually entered.
- Glucose/HbA1c manually entered.
- Hot flash-related palpitations.

Safety:

- Chest pain, shortness of breath, stroke signs, fainting, or severe palpitations must route to urgent guidance.

### 9. Skin, hair, and body comfort

Track:

- Hair shedding/thinning.
- Dry skin.
- Itchy skin.
- Acne.
- Breast tenderness.
- Body odor changes.
- Dry eyes/mouth optional.

### 10. Headache and migraine

Track:

- Headache severity.
- Migraine.
- Aura.
- Nausea.
- Light sensitivity.
- Menstrual/cycle relation.
- Medication taken optional.

Red flags:

- Sudden worst headache, neurological symptoms, weakness, speech trouble, or vision loss must route urgently.

### 11. Gastrointestinal symptoms

Track:

- Bloating.
- Constipation.
- Diarrhea.
- Nausea.
- Reflux.
- Food sensitivity notes.

### 12. Lifestyle and triggers

Daily toggles:

- Alcohol.
- Caffeine.
- Caffeine after 2pm.
- Spicy food.
- High sugar meal.
- Large late meal.
- Heat exposure.
- Stress spike.
- Conflict.
- Poor sleep.
- Travel.
- Missed exercise.
- Exercise done.
- Strength training.
- Yoga/stretching.
- Meditation/breathing.
- Missed medication.
- Illness.

### 13. Medication and HRT

Track:

- Medication name.
- Category.
- Dose.
- Route.
- Frequency.
- Time of day.
- Start date.
- Stop date if applicable.
- Prescriber optional.
- Adherence.
- Side effect notes.
- Refill count.

HRT categories:

- Estrogen systemic.
- Progesterone/progestogen.
- Combined systemic HRT.
- Vaginal estrogen/local therapy.
- Testosterone.
- Non-hormonal prescription for vasomotor symptoms.
- Other.

Never:

- Recommend starting, stopping, switching, or changing dose.

### 14. Labs and preventive health optional

Manual tracking only in MVP:

- Blood pressure.
- Lipids.
- HbA1c/glucose.
- TSH/thyroid labs.
- Vitamin D.
- Ferritin/iron.
- Bone density scan.
- Mammogram date.
- Cervical screening date.
- Colon screening date.

Use:

- Reminders and doctor-prep only.
- No diagnosis or interpretation beyond "discuss with clinician".

## Default daily check-in fields

- Top 3-5 symptoms.
- Mood.
- Sleep quality.
- Sleep hours.
- Energy.
- Hot flashes/night sweats if selected.
- Period status if applicable.
- Triggers.
- Journal optional.

## Insight thresholds

- Do not generate correlation insight with fewer than 7 check-ins.
- Label insights as weak until 14+ check-ins.
- Prefer stronger language only after 30+ check-ins with repeated pattern.
- Always state correlation is not causation.
