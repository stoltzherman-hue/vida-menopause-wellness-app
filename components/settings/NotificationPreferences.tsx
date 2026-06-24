'use client'
import { useState, useEffect } from 'react'

type Prefs = {
  medicationReminders: boolean
  checkInReminders: boolean
  cycleAlerts: boolean
  weeklyInsights: boolean
  communityActivity: boolean
}

const DEFAULT_PREFS: Prefs = {
  medicationReminders: true,
  checkInReminders: true,
  cycleAlerts: true,
  weeklyInsights: true,
  communityActivity: false,
}

const ITEMS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: 'medicationReminders', label: 'Medication reminders', desc: 'Alerts when it\'s time to take your medications' },
  { key: 'checkInReminders', label: 'Daily check-in', desc: 'Reminder to log your daily wellbeing' },
  { key: 'cycleAlerts', label: 'Cycle alerts', desc: 'Predictions for your next period window' },
  { key: 'weeklyInsights', label: 'Weekly insights', desc: 'Your health patterns summary every Sunday' },
  { key: 'communityActivity', label: 'Community activity', desc: 'Replies and mentions in the community' },
]

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default')

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionState('unsupported')
      return
    }
    setPermissionState(Notification.permission)
    const stored = localStorage.getItem('vida_notification_prefs')
    if (stored) {
      try { setPrefs(JSON.parse(stored)) } catch {}
    }
  }, [])

  function toggle(key: keyof Prefs) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  async function requestPermission() {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermissionState(result)
  }

  function save() {
    localStorage.setItem('vida_notification_prefs', JSON.stringify(prefs))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 22,
    backdropFilter: 'blur(24px)',
    overflow: 'hidden',
    marginBottom: 14,
  }

  return (
    <div>
      {permissionState !== 'granted' && permissionState !== 'unsupported' && (
        <div style={{
          ...card,
          background: 'rgba(155,124,200,0.07)',
          border: '1px solid rgba(155,124,200,0.22)',
          padding: '18px 20px',
          marginBottom: 20,
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>
            {permissionState === 'denied' ? 'Notifications are blocked' : 'Enable push notifications'}
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            {permissionState === 'denied'
              ? 'Please enable notifications in your browser settings to receive reminders.'
              : 'Get medication reminders, cycle predictions, and daily check-in prompts directly on your device.'}
          </p>
          {permissionState !== 'denied' && (
            <button onClick={requestPermission} style={{
              padding: '10px 20px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
              color: 'white', fontSize: 14, fontWeight: 300, cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              Allow notifications
            </button>
          )}
        </div>
      )}

      <div style={card}>
        {ITEMS.map((item, i) => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                background: '#9b7cc8',
              }} />
              <div>
                <p style={{ margin: 0, fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>{item.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item.desc}</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={prefs[item.key]}
              onClick={() => toggle(item.key)}
              style={{
                width: 48, height: 28, borderRadius: 14, border: 'none',
                background: prefs[item.key] ? '#9b7cc8' : 'rgba(255,255,255,0.12)',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: prefs[item.key] ? 23 : 3,
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(255,255,255,0.88)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={save} style={{
        width: '100%', padding: '15px', borderRadius: 16, border: 'none',
        background: saved
          ? 'linear-gradient(135deg, #7a52b0 0%, #9b7cc8 100%)'
          : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
        color: 'white', fontSize: 16, fontWeight: 300, cursor: 'pointer',
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        boxShadow: '0 4px 18px rgba(155,124,200,0.25)',
        transition: 'background 0.3s',
      }}>
        {saved ? 'Saved!' : 'Save preferences'}
      </button>
    </div>
  )
}
