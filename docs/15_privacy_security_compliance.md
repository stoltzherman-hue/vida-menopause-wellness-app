# Privacy, Security, and Compliance

## Summary

Vida handles sensitive health, mental health, sexual health, medication, and community data. The architecture must be privacy-first from day one.

## Compliance posture

Vida should be HIPAA-aware but must not claim HIPAA compliance until legal review confirms status and the operating controls are in place. HIPAA may apply depending on whether Vida acts as or for a covered entity/business associate.

Vida should also plan for GDPR/UK GDPR if serving Europe/UK and POPIA if serving South Africa.

## Data classification

### Public

- Marketing content.
- Public wellness articles.

### Community public/pseudonymous

- Handle.
- Avatar.
- Forum posts.
- Replies.

### Private health data

- Health profile.
- Symptoms.
- Cycle data.
- Medication/HRT.
- Journal.
- AI conversations.
- Reports.

### Highly sensitive

- Sexual health.
- Mental health crisis content.
- Medication details.
- Journal text.
- AI memory.

## Privacy requirements

- Separate community identity from health profile.
- Use explicit consent for AI analysis.
- Use explicit consent for notifications.
- Use explicit consent for marketing.
- Allow export.
- Allow deletion.
- Allow AI memory deletion.
- Allow users to hide sensitive modules.
- Do not sell health data.
- Do not use health data for ads.

## Security requirements

- TLS in transit.
- Encryption at rest through database provider.
- Field-level encryption for journal and AI messages if feasible.
- RLS/ownership checks.
- MFA for admins.
- Role-based admin access.
- Audit logs.
- Secrets management.
- Rate limits.
- Backups.
- Incident response plan.

## Logging policy

Allowed:

- Request ID.
- User ID hash.
- Endpoint.
- Status code.
- Latency.
- Error code.

Not allowed in standard logs:

- Journal text.
- Chat messages.
- Medication names.
- Symptoms tied to identifiable user.
- Sexual health fields.
- Raw report content.

## AI data minimization

- Send summaries, not entire histories.
- Use only context required for the answer.
- Do not send community private messages.
- Use provider settings that reduce retention where available.
- Store AI prompts/responses encrypted if persisted.

## HIPAA-aware checklist

- Determine covered entity/business associate status.
- Execute BAAs where required.
- Conduct security risk analysis.
- Document policies and procedures.
- Workforce/admin training.
- Access controls.
- Audit controls.
- Incident response.
- Breach notification process.
- Vendor risk review.

## POPIA-aware checklist

- Register/assign Information Officer where applicable.
- Document lawful basis/consent.
- Maintain processing inventory.
- Run personal information impact assessment.
- Handle data subject access/correction/deletion requests.
- Protect special personal information.
- Manage cross-border transfers.
- Maintain security compromise notification process.

## GDPR-aware checklist

- Lawful basis.
- Special category health data condition.
- DPIA.
- DSR process.
- Data processing agreements.
- International transfer mechanism.
- Retention schedule.
- Consent withdrawal.

## Retention defaults

- Health data: until user deletes account or configured retention policy.
- Deleted account: hard delete or anonymize within defined period.
- Audit logs: retain for security/legal period without sensitive payload.
- Community posts: delete/anonymize based on user choice and moderation/legal needs.

## Incident response

1. Detect.
2. Contain.
3. Assess impacted data.
4. Notify internal response owner.
5. Notify users/regulators where legally required.
6. Remediate.
7. Post-incident review.
