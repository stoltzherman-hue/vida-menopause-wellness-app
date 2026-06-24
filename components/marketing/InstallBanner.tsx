'use client'
import { useState, useEffect } from 'react'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // iOS — no beforeinstallprompt, show manual hint
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream
    if (isIOS) {
      setShowIOSHint(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  if (installed || dismissed || (!deferredPrompt && !showIOSHint)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, width: 'calc(100% - 40px)', maxWidth: 460,
      background: 'rgba(18,12,28,0.96)',
      border: '1px solid rgba(139,109,181,0.3)',
      borderRadius: 18, padding: '16px 20px',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,109,181,0.1)',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      {/* App icon placeholder */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'white' }}>v</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px' }}>
          Add Vida to your home screen
        </p>
        {showIOSHint ? (
          <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.4 }}>
            Tap <strong style={{ color: 'rgba(155,124,200,0.8)' }}>Share</strong> then <strong style={{ color: 'rgba(155,124,200,0.8)' }}>Add to Home Screen</strong>
          </p>
        ) : (
          <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Works offline · no App Store needed
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {!showIOSHint && (
          <button
            onClick={handleInstall}
            style={{
              background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
              border: 'none', borderRadius: 10, padding: '8px 16px',
              fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'white',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Install
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)', padding: 4, lineHeight: 1,
            fontSize: 18, fontFamily: DM,
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}
