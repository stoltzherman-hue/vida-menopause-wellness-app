'use client'

interface CheckinPoint {
  checkin_date: string
  mood: number | null
  energy_level: number | null
  sleep_hours: number | null
  sleep_quality: number | null
  hot_flash_severity: number | null
  triggers: string[] | null
}

interface Props {
  data: CheckinPoint[]
}

function Dot({ value, max, color }: { value: number | null; max: number; color: string }) {
  if (value === null) return <span className="text-[#e2d9d0]">—</span>
  const pct = value / max
  const opacity = 0.2 + pct * 0.8
  return (
    <span
      className="inline-flex w-7 h-7 rounded-full text-xs font-medium items-center justify-center text-white"
      style={{ backgroundColor: color, opacity }}
    >
      {value}
    </span>
  )
}

export function CheckInHistory({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-sm text-[#a0aec0] py-4 text-center">
        No check-ins yet. Start logging to see your history here.
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => b.checkin_date.localeCompare(a.checkin_date)).slice(0, 14)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-[#a0aec0] border-b border-[#e2d9d0]">
            <th className="text-left pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Mood</th>
            <th className="pb-2 font-medium">Energy</th>
            <th className="pb-2 font-medium">Sleep</th>
            <th className="pb-2 font-medium">Hot flash</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0ece4]">
          {sorted.map((c) => {
            const d = new Date(c.checkin_date + 'T00:00:00')
            const label = d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
            return (
              <tr key={c.checkin_date} className="hover:bg-[#faf8f4] transition-colors">
                <td className="py-2.5 text-[#2d3748] font-medium pr-4 whitespace-nowrap">{label}</td>
                <td className="py-2.5 text-center">
                  <Dot value={c.mood} max={10} color="#5a8a6b" />
                </td>
                <td className="py-2.5 text-center">
                  <Dot value={c.energy_level} max={10} color="#c47a5a" />
                </td>
                <td className="py-2.5 text-center">
                  <Dot value={c.sleep_quality} max={5} color="#c4959e" />
                </td>
                <td className="py-2.5 text-center">
                  <Dot value={c.hot_flash_severity} max={5} color="#e07a5f" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
