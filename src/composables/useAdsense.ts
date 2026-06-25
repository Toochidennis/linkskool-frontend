import { onMounted } from 'vue'

import { adsenseConfig, isAdsenseConfigured } from '@/config/adsense'

let scriptLoadStarted = false

type AdSenseStatus = 'pending' | 'filled' | 'unfilled'

const getAdSenseStatus = (element: HTMLElement): AdSenseStatus => {
  const status = element.getAttribute('data-ad-status')

  if (status === 'filled' || status === 'unfilled') {
    return status
  }

  return 'pending'
}

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

  const observeAdStatus = (element: HTMLElement, callback: (status: AdSenseStatus) => void) => {
    callback(getAdSenseStatus(element))

    if (typeof MutationObserver === 'undefined') {
      return () => {}
    }

    const observer = new MutationObserver(() => {
      callback(getAdSenseStatus(element))
    })

    observer.observe(element, {
      attributeFilter: ['data-ad-status'],
      attributes: true,
    })

    return () => observer.disconnect()
  }

  onMounted(loadAdsenseScript)

  return {
    isAdsenseConfigured,
    observeAdStatus,
    requestAd,
  }
}
