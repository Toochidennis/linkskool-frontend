import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'

import { newsService } from '@/api/services'
import type { NewsCard } from '@/data/news'
import { mapApiNewsToCard, mapApiRelatedNewsToCard } from '@/utils/newsMapper'

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
    relatedNews.value = []

    abortController?.abort()
    abortController = new AbortController()

    try {
      const response = await newsService.getNewsBySlug(slug.value, abortController.signal)
      const category = response.news.categories?.[0]?.name

      article.value = mapApiNewsToCard(response.news, 0, category)
      relatedNews.value = response.more.map((item, index) => mapApiRelatedNewsToCard(item, index))
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
