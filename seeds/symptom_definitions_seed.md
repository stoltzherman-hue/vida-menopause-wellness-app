# Symptom Definitions Seed Data

Use this as seed content for `symptom_definitions`.

| slug | name | category | sensitive | common_triggers |
|---|---|---:|---:|---|
| hot_flashes | Hot flashes | vasomotor | false | alcohol,caffeine,stress,heat,spicy_food,poor_sleep |
| night_sweats | Night sweats | vasomotor | false | alcohol,heat,stress,poor_sleep |
| chills | Chills after sweating | vasomotor | false | night_sweats,temperature_change |
| palpitations | Palpitations | cardiovascular | false | stress,caffeine,hot_flash,poor_sleep |
| sleep_disruption | Sleep disruption | sleep | false | night_sweats,stress,caffeine,alcohol |
| insomnia | Insomnia | sleep | false | stress,caffeine,night_sweats,screen_time |
| fatigue | Fatigue | energy | false | poor_sleep,stress,low_activity |
| low_energy | Low energy | energy | false | poor_sleep,stress,low_mood |
| brain_fog | Brain fog | cognitive | false | poor_sleep,stress,high_symptom_days |
| memory_lapses | Memory lapses | cognitive | false | poor_sleep,stress |
| focus_issues | Focus issues | cognitive | false | poor_sleep,stress,brain_fog |
| mood_swings | Mood swings | mood | false | poor_sleep,stress,cycle_changes |
| anxiety | Anxiety | mood | false | stress,poor_sleep,caffeine |
| irritability | Irritability | mood | false | poor_sleep,stress,hot_flashes |
| low_mood | Low mood | mood | false | poor_sleep,stress,isolation |
| overwhelm | Overwhelm | mood | false | workload,caregiving,poor_sleep |
| irregular_periods | Irregular periods | cycle | false | perimenopause |
| heavy_bleeding | Heavy bleeding | cycle | false | cycle_changes |
| spotting | Spotting | cycle | false | cycle_changes,hrt_change |
| cramps | Cramps | cycle | false | period |
| breast_tenderness | Breast tenderness | cycle | false | hormone_fluctuation |
| vaginal_dryness | Vaginal dryness | genitourinary | true | low_estrogen |
| pain_with_sex | Pain with sex | sexual_health | true | vaginal_dryness |
| low_libido | Low libido | sexual_health | true | poor_sleep,mood,vaginal_discomfort |
| urinary_urgency | Urinary urgency | genitourinary | true | caffeine,vaginal_changes |
| urinary_leakage | Urinary leakage | genitourinary | true | pelvic_floor_changes |
| recurrent_uti_symptoms | Recurrent UTI symptoms | genitourinary | true | vaginal_changes |
| joint_pain | Joint pain | musculoskeletal | false | inflammation,poor_sleep,low_activity |
| muscle_aches | Muscle aches | musculoskeletal | false | exercise,poor_sleep,stress |
| back_pain | Back pain | musculoskeletal | false | posture,low_activity |
| weight_changes | Weight/body changes | metabolic | false | sleep,activity,nutrition,stress |
| bloating | Bloating | gastrointestinal | false | diet,cycle_changes,stress |
| cravings | Cravings | metabolic | false | poor_sleep,stress |
| headaches | Headaches | neurological | false | poor_sleep,stress,caffeine,cycle_changes |
| migraine | Migraine | neurological | false | poor_sleep,stress,cycle_changes |
| hair_thinning | Hair thinning | skin_hair | false | hormone_changes,stress |
| dry_skin | Dry skin | skin_hair | false | hormone_changes |
| itchy_skin | Itchy skin | skin_hair | false | dry_skin,hormone_changes |
| body_odor_changes | Body odor changes | skin_hair | false | sweating,hormone_changes |
