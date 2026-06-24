<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import NewsList from '@/components/NewsList.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { getNewsBySlug, newsItems } from '@/data/news'

const route = useRoute()

const slug = computed(() => {
  const rawSlug = route.params.slug
  return Array.isArray(rawSlug) ? (rawSlug[0] ?? '') : (rawSlug ?? '')
})

const article = computed(() => getNewsBySlug(slug.value))

const relatedNews = computed(() => {
  if (!article.value) {
    return newsItems
  }

  const sameCategory = newsItems.filter(
    (item) => item.id !== article.value?.id && item.category === article.value?.category,
  )
  const remaining = newsItems.filter(
    (item) => item.id !== article.value?.id && item.category !== article.value?.category,
  )

  return [...sameCategory, ...remaining].slice(0, 10)
})

usePageMeta(() => ({
  title: article.value
    ? `${article.value.title} - LinkSkool News`
    : 'News story not found - LinkSkool',
  description: article.value?.summary ?? 'Read LinkSkool news, opportunities, and stories.',
  keywords: 'LinkSkool news, education news, opportunities, career insights, learning community',
  url: article.value ? `https://linkskool.com/news/${article.value.slug}` : 'https://linkskool.com/news',
  image: article.value?.imageUrl ?? 'https://linkskool.com/assets/og-image.png',
  type: 'article',
}))

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="pt-24">
      <section v-if="article" class="pb-16">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <RouterLink
            to="/news"
            class="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <i class="fa-solid fa-arrow-left text-xs"></i>
            Back to News
          </RouterLink>

          <article>
            <div class="space-y-5">
              <div
                class="inline-flex rounded-md bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              >
                {{ article.category }}
              </div>
              <h1 class="text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                {{ article.title }}
              </h1>
              <p class="text-lg leading-8 text-slate-600">
                {{ article.summary }}
              </p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-slate-500">
                <span>{{ article.source }}</span>
                <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                <span>{{ article.publishedAt }}</span>
                <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                <span>{{ article.readTime }}</span>
              </div>
            </div>

            <div class="mt-8 h-[22rem] overflow-hidden rounded-md md:h-[30rem]">
              <img :src="article.imageUrl" :alt="article.imageAlt" class="h-full w-full object-cover" />
            </div>

            <div class="mt-8 space-y-5 border-t border-gray-200 pt-8">
              <p v-for="paragraph in article.body" :key="paragraph" class="text-base leading-8 text-slate-700">
                {{ paragraph }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section v-else class="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6 lg:px-8">
        <h1 class="text-3xl font-black text-slate-950">News story not found</h1>
        <p class="mt-3 text-slate-600">The story may have moved or no longer exists.</p>
        <RouterLink
          to="/news"
          class="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View all news
        </RouterLink>
      </section>

      <section class="bg-gray-50 pb-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="mb-6 text-2xl font-black text-slate-950">More for you</h2>
          <NewsList :news-items="relatedNews" />
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
