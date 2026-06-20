'use client'

interface CheckinPoint {
  hot_flash_severity: number | null
  triggers: string[] | null
}

interface Props {
  data: CheckinPoint[]
}

export function TriggerCorrelation({ data }: Props) {
  const withFlashes = data.filter((d) => d.hot_flash_severity !== null && d.hot_flash_severity > 0)
  if (withFlashes.length < 3) {
    return (
      <div className="text-sm text-[#a0aec0]">
        Log more check-ins with hot flash data to see trigger correlations.
      </div>
    )
  }

  const triggerMap: Record<string, { total: number; count: number }> = {}
  for (const d of withFlashes) {
    for (const t of (d.triggers ?? [])) {
      if (!triggerMap[t]) triggerMap[t] = { total: 0, count: 0 }
      triggerMap[t].total += d.hot_flash_severity!
      triggerMap[t].count++
    }
  }

  const noTriggerDays = withFlashes.filter((d) => !d.triggers || d.triggers.length === 0)
  const baseline =
    noTriggerDays.length > 0
      ? noTriggerDays.reduce((s, d) => s + d.hot_flash_severity!, 0) / noTriggerDays.length
      : 0

  const ranked = Object.entries(triggerMap)
    .map(([trigger, { total, count }]) => ({ trigger, avg: total / count, count }))
    .filter((x) => x.count >= 2)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)

  if (ranked.length === 0) {
    return (
      <div className="text-sm text-[#a0aec0]">
        Select triggers during check-ins to uncover patterns.
      </div>
    )
  }

  const max = Math.max(...ranked.map((r) => r.avg), 5)

  return (
    <div className="space-y-3">
      {ranked.map((r) => (
        <div key={r.trigger}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#2d3748]">{r.trigger}</span>
            <span className="text-[#718096] text-xs">{r.count} days · avg {r.avg.toFixed(1)}/5</span>
          </div>
          <div className="h-2 rounded-full bg-[#f0ece4] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#c47a5a]"
              style={{ width: `${(r.avg / max) * 100}%` }}
            />
          </div>
          {r.avg > baseline + 0.5 && (
            <p className="text-xs text-[#718096] mt-0.5">
              Your data suggests {r.trigger.toLowerCase()} may be linked to more intense hot flashes.
            </p>
          )}
        </div>
      ))}
      <p className="text-xs text-[#a0aec0] pt-2">
        Patterns are based on your data only and are not medical conclusions. Discuss with your provider.
      </p>
    </div>
  )
}
