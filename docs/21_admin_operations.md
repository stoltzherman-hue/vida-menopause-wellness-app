# Admin and Operations

## Admin roles

- Super admin.
- Moderator.
- Content editor.
- Support agent.
- Clinical reviewer future role.

## Admin capabilities

### Moderator

- View reported posts.
- Hide/unhide posts.
- Warn user.
- Suspend user.
- Ban user.
- Add labels.
- Resolve report.

### Content editor

- Create/edit wellness content.
- Tag content by symptom.
- Set expert-reviewed status.
- Archive outdated content.

### Support agent

- View account metadata.
- Assist with billing status.
- Trigger data export/deletion flow.
- Cannot view private health data by default.

### Super admin

- Manage roles.
- View audit logs.
- Configure feature flags.
- Configure pricing IDs.

## Admin privacy rules

- Mask health details by default.
- Require elevated permission and reason to view sensitive records.
- Audit every sensitive access.
- No AI conversation review unless user submitted it for support/safety review.

## Operational dashboards

- Active users.
- Check-in volume.
- AI usage/cost.
- Subscription metrics.
- Moderation queue size.
- Safety escalation count.
- Notification delivery.
- Error rates.

## Support workflows

### Account deletion

1. Verify user.
2. Explain deletion impact.
3. Confirm.
4. Delete/anonymize records.
5. Send confirmation.
6. Audit event.

### AI safety complaint

1. Capture message ID.
2. Restrict access.
3. Review prompt/output.
4. Classify severity.
5. Patch prompt/rules/tests.
6. Notify user if appropriate.

### Community complaint

1. Review report.
2. Apply guidelines.
3. Action within SLA.
4. Audit.
5. Notify reporter if policy allows.

## SLAs

- Safety reports: same day.
- Harassment reports: 24 hours.
- Misinformation reports: 48 hours.
- Data deletion: legally required timeframe, target under 7 days for MVP.
