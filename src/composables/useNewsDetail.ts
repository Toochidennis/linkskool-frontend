import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'

import type { ApiNewsItem } from '@/api/models/news'
import { newsService } from '@/api/services'
import type { NewsCard } from '@/data/news'
import { mapApiNewsToCard } from '@/utils/newsMapper'

const extractNewsItem = (payload: unknown): ApiNewsItem | null => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>
  if ('id' in record && 'slug' in record) {
    return payload as ApiNewsItem
  }

  if (record.news && typeof record.news === 'object') {
    return record.news as ApiNewsItem
  }

  return null
}

export const useNewsDetail = (slug: Ref<string>) => {
  const article = ref<NewsCard | null>(null)
  const relatedNews = ref<NewsCard[]>([])
  const isLoadingArticle = ref(false)
  const articleError = ref('')

  let abortController: AbortController | null = null

  const articleImages = computed(() => article.value?.images ?? [])

  const loadArticle = async () => {
    isLoadingArticle.value = true
    articleError.value = ''
    article.value = null

    abortController?.abort()
    abortController = new AbortController()

    try {
      const [detailResponse, listResponse] = await Promise.allSettled([
        newsService.getNewsBySlug(slug.value, abortController.signal),
        newsService.getAllNews({ page: 1, limit: 12, signal: abortController.signal }),
      ])

      let apiArticle: ApiNewsItem | null = null

      if (detailResponse.status === 'fulfilled') {
        console.log('news detail response:', detailResponse.value)
        apiArticle = extractNewsItem(detailResponse.value)
      } else {
        console.error('Failed to fetch news detail:', detailResponse.reason)
      }

      if (!apiArticle && listResponse.status === 'fulfilled') {
        apiArticle = listResponse.value.data.news.find((item) => item.slug === slug.value) ?? null
      }

      if (!apiArticle) {
        articleError.value = 'The story may have moved or no longer exists.'
        return
      }

      article.value = mapApiNewsToCard(apiArticle, 0)

      if (listResponse.status === 'fulfilled') {
        relatedNews.value = listResponse.value.data.news
          .filter((item) => item.id !== apiArticle?.id)
          .map((item, index) => mapApiNewsToCard(item, index))
          .slice(0, 9)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      console.error('Failed to load news article:', error)
      articleError.value = 'Unable to load this story right now.'
    } finally {
      isLoadingArticle.value = false
    }
  }

  watch(
    slug,
    () => {
      void loadArticle()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    abortController?.abort()
  })

  return {
    article,
    articleError,
    articleImages,
    isLoadingArticle,
    relatedNews,
  }
}
