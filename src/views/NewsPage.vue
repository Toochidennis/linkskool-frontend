<script setup lang="ts">
import { computed, ref } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import NewsSection from '@/components/NewsSection.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { newsCategories, newsItems, newsroomProducts, type NewsCategory } from '@/data/news'

usePageMeta({
  title: 'News - LinkSkool Opportunities and Stories',
  description:
    'Read LinkSkool news, program announcements, opportunities, career insights, technology notes, and community stories in a masonry-style feed.',
  keywords: 'LinkSkool news, education news, opportunities, career insights, learning community',
  url: 'https://linkskool.com/news',
  image: 'https://linkskool.com/assets/og-image.png',
  type: 'website',
})

const activeCategory = ref<NewsCategory | 'All'>('All')

const filteredNewsItems = computed(() => {
  if (activeCategory.value === 'All') {
    return newsItems
  }

  return newsItems.filter((item) => item.category === activeCategory.value)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <AppHeader />
    <NewsSection
      :news-items="filteredNewsItems"
      :categories="newsCategories"
      :products="newsroomProducts"
      :active-category="activeCategory"
      @category-change="activeCategory = $event"
    />
    <AppFooter />
  </div>
</template>
