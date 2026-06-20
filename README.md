# Vida Claude Project Pack

Vida is a mobile-first menopause and perimenopause wellness platform with two major pillars:

1. A free community layer where women can connect anonymously or openly, share experience, join circles, and get support.
2. A premium AI companion and health intelligence layer for tracking, pattern recognition, reminders, voice/text conversations, doctor-visit preparation, and personalized wellness guidance.

This pack is designed to be pasted into Claude Projects or used inside Claude Code. Start with `build_prompt.md`, then add `CLAUDE.md` and the docs folder as project knowledge.

## Fast start

1. Create a new Claude Project called `Vida`.
2. Upload all `.md` files in this pack as project knowledge.
3. Paste the full contents of `build_prompt.md` into Claude as the first build request.
4. If using Claude Code, copy `CLAUDE.md` to the repository root and copy `.claude/` into the repo.
5. Ask Claude to build in phases, beginning with database, auth, onboarding, and the daily tracker.

## Recommended build order

1. Foundation: Next.js app, design tokens, auth, database, environment variables.
2. Onboarding and health profile.
3. Daily tracker and dashboard.
4. AI insight engine with guardrails.
5. Premium AI companion with text first, voice second.
6. Medication and HRT tracker.
7. Community forum and Circles.
8. Stripe subscriptions.
9. Doctor report export.
10. Admin, moderation, safety, analytics, and compliance hardening.

## Important product correction

The community feature should be free and participation should not be paywalled. Premium should unlock the AI companion, advanced insights, unlimited tracking, reports, voice, and deeper personalization. This protects the mission and creates a strong top-of-funnel growth loop.

## Files included

- `build_prompt.md`: The main Claude build prompt.
- `CLAUDE.md`: Project-level Claude Code instructions.
- `.claude/CLAUDE.md`: Modular Claude Code entrypoint.
- `.claude/rules/*.md`: Path/topic-specific engineering rules.
- `docs/*.md`: Product, architecture, AI, community, privacy, dashboard, roadmap, and testing documents.
- `prompts/*.md`: Reusable prompts for the AI companion, insights, reports, moderation, content, voice, and crisis escalation.
- `seeds/*.md`: Symptom, content, and community seed data.
- `templates/*.md`: Env template, project structure, migration plan, Stripe checklist, and launch checklist.

## Safety stance

Vida is a support, education, tracking, and preparation tool. It must not diagnose, prescribe, replace clinical care, or present AI outputs as medical advice. All AI health outputs must use pattern language such as "your data suggests" and route urgent or red-flag issues to a healthcare professional or emergency services.
