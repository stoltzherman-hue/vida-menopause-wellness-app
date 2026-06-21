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

const ITEMS: { key: keyof Prefs; emoji: string; label: string; desc: string }[] = [
  { key: 'medicationReminders', emoji: '💊', label: 'Medication reminders', desc: 'Alerts when it\'s time to take your medications' },
  { key: 'checkInReminders', emoji: '📋', label: 'Daily check-in', desc: 'Reminder to log your daily wellbeing' },
  { key: 'cycleAlerts', emoji: '🌙', label: 'Cycle alerts', desc: 'Predictions for your next period window' },
  { key: 'weeklyInsights', emoji: '📊', label: 'Weekly insights', desc: 'Your health patterns summary every Sunday' },
  { key: 'communityActivity', emoji: '💬', label: 'Community activity', desc: 'Replies and mentions in the community' },
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
    background: 'rgba(255,255,255,0.82)',
    border: '1.5px solid rgba(237,224,216,0.7)',
    borderRadius: 22,
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
    marginBottom: 14,
  }

  return (
    <div>
      {permissionState !== 'granted' && permissionState !== 'unsupported' && (
        <div style={{
          ...card,
          background: 'linear-gradient(135deg, rgba(45,139,122,0.08) 0%, rgba(61,44,53,0.04) 100%)',
          border: '1.5px solid rgba(45,139,122,0.25)',
          padding: '18px 20px',
          marginBottom: 20,
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#3d2c35' }}>
            {permissionState === 'denied' ? '🔕 Notifications are blocked' : '🔔 Enable push notifications'}
          </p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8a7a72', lineHeight: 1.5 }}>
            {permissionState === 'denied'
              ? 'Please enable notifications in your browser settings to receive reminders.'
              : 'Get medication reminders, cycle predictions, and daily check-in prompts directly on your device.'}
          </p>
          {permissionState !== 'denied' && (
            <button onClick={requestPermission} style={{
              padding: '10px 20px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #2d8b7a 0%, #4a7a5b 100%)',
              color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
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
            borderTop: i === 0 ? 'none' : '1px solid rgba(237,224,216,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <span style={{ fontSize: 22 }}>{item.emoji}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#3d2c35' }}>{item.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8a7a72' }}>{item.desc}</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={prefs[item.key]}
              onClick={() => toggle(item.key)}
              style={{
                width: 48, height: 28, borderRadius: 14, border: 'none',
                background: prefs[item.key] ? '#2d8b7a' : 'rgba(200,189,184,0.5)',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: prefs[item.key] ? 23 : 3,
                width: 22, height: 22, borderRadius: '50%',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={save} style={{
        width: '100%', padding: '15px', borderRadius: 16, border: 'none',
        background: saved
          ? 'linear-gradient(135deg, #4a7a5b 0%, #2d8b7a 100%)'
          : 'linear-gradient(135deg, #3d2c35 0%, #5a3d4a 100%)',
        color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer',
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        boxShadow: '0 4px 18px rgba(61,44,53,0.25)',
        transition: 'background 0.3s',
      }}>
        {saved ? '✓ Saved!' : 'Save preferences'}
      </button>
    </div>
  )
}
