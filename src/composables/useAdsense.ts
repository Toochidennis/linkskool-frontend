import { onMounted } from 'vue'

import { adsenseConfig, isAdsenseConfigured } from '@/config/adsense'

let scriptLoadStarted = false

export const useAdsense = () => {
  const loadAdsenseScript = () => {
    if (!isAdsenseConfigured || scriptLoadStarted || typeof document === 'undefined') {
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`,
    )

    if (existingScript) {
      scriptLoadStarted = true
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = 'anonymous'
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      adsenseConfig.clientId,
    )}`

    document.head.appendChild(script)
    scriptLoadStarted = true
  }

  const requestAd = () => {
    if (!isAdsenseConfigured || typeof window === 'undefined') {
      return
    }

    window.setTimeout(() => {
      try {
        ;((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({})
      } catch (error) {
        console.error('Failed to request AdSense slot:', error)
      }
    }, 0)
  }

  onMounted(loadAdsenseScript)

  return {
    isAdsenseConfigured,
    requestAd,
  }
}
