<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AdSenseSlot from '@/components/AdSenseSlot.vue'
import ShareButton from '@/components/ShareButton.vue'
import { adsenseConfig } from '@/config/adsense'
import type { NewsCard, NewsCategory } from '@/data/news'

defineProps<{
  newsItems: NewsCard[]
  categories: NewsCategory[]
  activeCategory: NewsCategory | 'All'
  isLoading?: boolean
  isLoadingMore?: boolean
}>()

const emit = defineEmits<{
  categoryChange: [category: NewsCategory | 'All']
}>()

const cardClassBySize: Record<NewsCard['size'], string> = {
  feature: 'news-card-feature',
  horizontal: 'news-card-horizontal',
  square: 'news-card-square',
}

const shouldShowInlineAd = (index: number) => (index + 1) % 10 === 0
</script>

<template>
  <section class="relative overflow-hidden bg-white pb-20 text-slate-950 sm:pb-24">
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <AdSenseSlot :slot="adsenseConfig.slots.newsTop" />

      <div class="mt-8 flex flex-wrap gap-2.5">
        <button
          type="button"
          class="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition"
          :class="
            activeCategory === 'All'
              ? 'border-brand bg-brand text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:text-brand'
          "
          @click="emit('categoryChange', 'All')"
        >
          All
        </button>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition"
          :class="
            activeCategory === category
              ? 'border-brand bg-brand text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:text-brand'
          "
          @click="emit('categoryChange', category)"
        >
          {{ category }}
        </button>
      </div>

      <div v-if="isLoading" class="news-grid mt-6">
        <div
          v-for="item in 10"
          :key="`news-skeleton-${item}`"
          class="news-card overflow-hidden rounded-[14px] border border-slate-200/80 bg-white"
          :class="item === 1 || item === 10 ? 'news-card-horizontal' : 'news-card-square'"
        >
          <div class="h-[52%] animate-pulse bg-slate-200"></div>
          <div class="space-y-3 p-4">
            <div class="h-4 w-4/5 animate-pulse rounded bg-slate-200"></div>
            <div class="h-4 w-3/5 animate-pulse rounded bg-slate-200"></div>
            <div class="h-3 w-full animate-pulse rounded bg-slate-100"></div>
            <div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div>
          </div>
        </div>
      </div>

      <div v-else class="news-grid mt-6">
        <template v-for="(item, index) in newsItems" :key="item.id">
          <article
            class="news-card card-lift group relative overflow-hidden rounded-[14px] border border-slate-200/80 bg-white"
            :class="cardClassBySize[item.size]"
          >
            <RouterLink
              :to="`/news/${item.slug}`"
              class="absolute inset-0 z-10"
              :aria-label="`Read ${item.title}`"
            />
            <template v-if="item.size === 'square'">
              <div class="relative h-[52%] overflow-hidden">
                <img
                  :src="item.imageUrl"
                  :alt="item.imageAlt"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  class="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
                >
                  {{ item.category }}
                </div>
                <div
                  v-if="(item.images?.length ?? 0) > 1"
                  class="absolute right-3 top-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur"
                >
                  +{{ (item.images?.length ?? 1) - 1 }}
                </div>
                <ShareButton class="absolute bottom-3 right-3 z-20" :share-data="item.share" />
              </div>

              <div class="flex h-[48%] flex-col justify-end gap-3 bg-white p-4">
                <p class="line-clamp-2 text-xs leading-5 text-slate-500">
                  {{ item.summary }}
                </p>
                <div class="flex items-start justify-between gap-3">
                  <h2 class="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-slate-950">
                    {{ item.title }}
                  </h2>
                  <span
                    aria-hidden="true"
                    class="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                  >
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            </template>

            <template v-else>
              <img
                :src="item.imageUrl"
                :alt="item.imageAlt"
                class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent"></div>
              <div
                class="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white"
              >
                {{ item.category }}
              </div>
              <div
                v-if="(item.images?.length ?? 0) > 1"
                class="absolute right-4 top-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
              >
                +{{ (item.images?.length ?? 1) - 1 }}
              </div>
              <ShareButton
                class="absolute top-4 z-20"
                :class="(item.images?.length ?? 0) > 1 ? 'right-16' : 'right-4'"
                :share-data="item.share"
              />

              <div class="absolute inset-x-0 bottom-0 flex items-start justify-between gap-4 p-4 sm:p-5">
                <h2
                  class="line-clamp-3 text-xl font-semibold leading-tight tracking-tight text-white"
                  :class="{ 'sm:text-4xl': item.size === 'feature', 'sm:text-2xl': item.size === 'horizontal' }"
                >
                  {{ item.title }}
                </h2>

                <span
                  aria-hidden="true"
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition group-hover:border-white group-hover:bg-white group-hover:text-slate-950 sm:h-10 sm:w-10"
                >
                  <i class="fa-solid fa-arrow-right text-xs sm:text-sm"></i>
                </span>
              </div>
            </template>
          </article>

          <AdSenseSlot
            v-if="shouldShowInlineAd(index)"
            :slot="adsenseConfig.slots.newsInline"
            class="news-ad-card"
          />
        </template>

        <AdSenseSlot
          v-if="newsItems.length > 0"
          :slot="adsenseConfig.slots.newsBottom"
          class="news-ad-card"
        />
      </div>

      <div v-if="isLoadingMore" class="news-grid mt-4">
        <div
          v-for="item in 4"
          :key="`news-more-skeleton-${item}`"
          class="news-card news-card-square overflow-hidden rounded-[14px] border border-slate-200/80 bg-white"
        >
          <div class="h-[52%] animate-pulse bg-slate-200"></div>
          <div class="space-y-3 p-4">
            <div class="h-4 w-4/5 animate-pulse rounded bg-slate-200"></div>
            <div class="h-3 w-full animate-pulse rounded bg-slate-100"></div>
            <div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.news-card {
  min-height: 22rem;
}

.news-ad-card {
  min-height: 8rem;
}

.news-grid-glow {
  filter: blur(72px);
}

@media (min-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(17rem, auto);
  }

  .news-card {
    min-height: auto;
  }

  .news-card-square {
    aspect-ratio: 1 / 1;
  }

  .news-card-horizontal,
  .news-card-feature {
    grid-column: span 2;
    aspect-ratio: 2 / 1;
  }

  .news-ad-card {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1180px) {
  .news-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-flow: dense;
    grid-auto-rows: 19rem;
  }

  .news-card-feature {
    grid-column: span 2;
    grid-row: span 2;
    aspect-ratio: auto;
  }

  .news-card-horizontal {
    grid-column: span 2;
    aspect-ratio: auto;
  }

  .news-card-square {
    grid-column: span 1;
    aspect-ratio: auto;
  }
}
</style>
