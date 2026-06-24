import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import type { ApiNewsItem, NewsListMeta } from '@/api/models/news'
import { newsService } from '@/api/services'
import type { NewsCard, NewsCategory } from '@/data/news'
import { mapApiNewsToCard } from '@/utils/newsMapper'

const newsLimit = 25

export const useNewsList = () => {
  const activeCategory = ref<NewsCategory | 'All'>('All')
  const newsItems = ref<NewsCard[]>([])
  const categories = ref<NewsCategory[]>([])
  const categoryIds = ref<Record<string, number[]>>({})
  const meta = ref<NewsListMeta | null>(null)
  const loadError = ref('')
  const isInitialLoading = ref(false)
  const isLoadingMore = ref(false)
  const loadMoreTarget = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null
  let abortController: AbortController | null = null

  const filteredNewsItems = computed(() => {
    if (activeCategory.value === 'All') {
      return newsItems.value
    }

    const ids = categoryIds.value[activeCategory.value] ?? []
    const allowedIds = new Set(ids)
    return newsItems.value.filter((item) => allowedIds.has(item.id))
  })

  const findCategoryForNews = (item: ApiNewsItem) =>
    Object.entries(categoryIds.value).find(
      ([category, ids]) => category.toLowerCase() !== 'all' && ids.includes(item.id),
    )?.[0]

  const loadNews = async (page: number) => {
    const isFirstPage = page === 1

    if (isFirstPage) {
      isInitialLoading.value = true
    } else {
      isLoadingMore.value = true
    }

    loadError.value = ''
    abortController?.abort()
    abortController = new AbortController()

    try {
      const response = await newsService.getAllNews({
        page,
        limit: newsLimit,
        signal: abortController.signal,
      })

      categoryIds.value = response.data.categories
      categories.value = Object.keys(response.data.categories).filter(
        (category) => category.toLowerCase() !== 'all',
      )
      meta.value = response.meta

      const mappedNews = response.data.news.map((item, index) =>
        mapApiNewsToCard(item, newsItems.value.length + index, findCategoryForNews(item)),
      )

      newsItems.value = isFirstPage ? mappedNews : [...newsItems.value, ...mappedNews]
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      console.error('Failed to fetch news:', error)
      loadError.value = 'Unable to load news right now.'
    } finally {
      isInitialLoading.value = false
      isLoadingMore.value = false
    }
  }

  const loadMoreNews = () => {
    if (isInitialLoading.value || isLoadingMore.value || !meta.value?.hasNext) {
      return
    }

    void loadNews(meta.value.currentPage + 1)
  }

  onMounted(() => {
    void loadNews(1)

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMoreNews()
        }
      },
      { rootMargin: '320px' },
    )

    if (loadMoreTarget.value) {
      observer.observe(loadMoreTarget.value)
    }
  })

  onBeforeUnmount(() => {
    abortController?.abort()
    observer?.disconnect()
  })

  return {
    activeCategory,
    categories,
    filteredNewsItems,
    isInitialLoading,
    isLoadingMore,
    loadError,
    loadMoreTarget,
  }
}
