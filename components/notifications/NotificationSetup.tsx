'use client'
import { useEffect, useState } from 'react'

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

export function NotificationSetup() {
  const [state, setState] = useState<PermissionState>('idle')

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'granted') setState('granted')
    else if (Notification.permission === 'denied') setState('denied')
  }, [])

  async function requestPermission() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return
    setState('requesting')

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') { setState('denied'); return }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) throw new Error('VAPID key not configured')

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      })

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })

      setState('granted')
    } catch {
      setState('denied')
    }
  }

  if (state === 'unsupported' || state === 'granted') return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(45,139,122,0.08), rgba(45,139,122,0.04))',
      border: '1px solid rgba(45,139,122,0.2)',
      borderRadius: 16,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>🔔</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1220', margin: '0 0 2px' }}>
          Enable reminders
        </p>
        <p style={{ fontSize: 13, color: '#6a5a6a', margin: 0, lineHeight: 1.5 }}>
          {state === 'denied'
            ? 'Notifications blocked — enable them in your browser settings.'
            : 'Get medication reminders, cycle alerts, and daily check-in nudges.'}
        </p>
      </div>
      {state !== 'denied' && (
        <button
          onClick={requestPermission}
          disabled={state === 'requesting'}
          style={{
            background: '#2d8b7a', color: 'white', border: 'none',
            borderRadius: 10, padding: '9px 16px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', flexShrink: 0,
            opacity: state === 'requesting' ? 0.7 : 1,
          }}
        >
          {state === 'requesting' ? 'Setting up…' : 'Turn on'}
        </button>
      )}
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
