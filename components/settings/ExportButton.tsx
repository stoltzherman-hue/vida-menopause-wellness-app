'use client'
import { useState } from 'react'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vida-health-data-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleExport} disabled={loading} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '15px 20px', background: 'transparent',
      border: 'none', cursor: loading ? 'wait' : 'pointer',
      fontFamily: DM,
    }}>
      <div style={{ textAlign: 'left' }}>
        <p style={{ margin: 0, fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.75)', fontFamily: DM }}>Export my data</p>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.32)', fontFamily: DM, marginTop: 2 }}>Download 90-day CSV of all your health data</p>
      </div>
      <span style={{ fontSize: 13, color: loading ? 'rgba(255,255,255,0.28)' : 'rgba(196,184,224,0.8)', fontWeight: 300, fontFamily: DM }}>
        {loading ? 'Downloading…' : 'Download'}
      </span>
    </button>
  )
}
