'use client'

import { useEffect } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export function CampaignAttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) sessionStorage.setItem(`vida_${key}`, value)
    }
  }, [])

  return null
}
