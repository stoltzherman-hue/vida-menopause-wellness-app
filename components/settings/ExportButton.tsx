'use client'
import { useState } from 'react'

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
      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 20 }}>📥</span>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#3d2c35' }}>Export my data</p>
          <p style={{ margin: 0, fontSize: 12, color: '#8a7a72' }}>Download 90-day CSV of all your health data</p>
        </div>
      </div>
      <span style={{ fontSize: 13, color: loading ? '#b8a9a0' : '#2d8b7a', fontWeight: 600 }}>
        {loading ? 'Downloading…' : 'Download'}
      </span>
    </button>
  )
}
