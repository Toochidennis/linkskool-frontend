import { ref } from 'vue'

import type { NewsShareData } from '@/data/news'

export const useWebShare = () => {
  const status = ref<'idle' | 'copied' | 'error'>('idle')
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  const setStatus = (nextStatus: typeof status.value) => {
    status.value = nextStatus
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      status.value = 'idle'
    }, 2000)
  }

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  const share = async (data: NewsShareData) => {
    if (!navigator.share) {
      await copyLink(data.url)
      return
    }

    try {
      await navigator.share({ title: data.title, text: data.text, url: data.url })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      await copyLink(data.url)
    }
  }

  return { share, status }
}
