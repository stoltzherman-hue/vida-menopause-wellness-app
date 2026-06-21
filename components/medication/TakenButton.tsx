'use client'

import { useState } from 'react'

interface Props {
  medicationId: string
  medicationName: string
  takenToday: boolean
}

export function TakenButton({ medicationId, medicationName, takenToday: initialTaken }: Props) {
  const [taken, setTaken] = useState(initialTaken)
  const [loading, setLoading] = useState(false)

  async function handleMark() {
    if (taken || loading) return
    // Optimistic update
    setTaken(true)
    setLoading(true)
    try {
      const res = await fetch(`/api/medications/${medicationId}/taken`, { method: 'POST' })
      if (!res.ok) {
        // Revert on failure
        setTaken(false)
      }
    } catch {
      setTaken(false)
    } finally {
      setLoading(false)
    }
  }

  if (taken) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(107,158,128,0.10)',
        border: '1.5px solid rgba(107,158,128,0.25)',
        borderRadius: 10, padding: '7px 14px',
        fontSize: 13, fontWeight: 600, color: '#4a7a5b',
        minHeight: 36,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Taken today ✓
      </div>
    )
  }

  return (
    <button
      onClick={handleMark}
      disabled={loading}
      aria-label={`Mark ${medicationName} as taken today`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: loading ? 'rgba(45,139,122,0.55)' : 'linear-gradient(135deg, #2d8b7a, #4a7a5b)',
        border: 'none',
        borderRadius: 10, padding: '7px 14px',
        fontSize: 13, fontWeight: 600, color: 'white',
        cursor: loading ? 'not-allowed' : 'pointer',
        minHeight: 36,
        boxShadow: '0 2px 10px rgba(45,139,122,0.28)',
        transition: 'opacity 0.15s',
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
      }}
    >
      {loading ? (
        <span style={{ fontSize: 13 }}>...</span>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Mark taken
        </>
      )}
    </button>
  )
}
