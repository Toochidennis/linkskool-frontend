<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { NewsCard, NewsCategory } from '@/data/news'

defineProps<{
  newsItems: NewsCard[]
  categories: NewsCategory[]
  products: string[]
  activeCategory: NewsCategory | 'All'
}>()

const emit = defineEmits<{
  categoryChange: [category: NewsCategory | 'All']
}>()

const cardClassBySize: Record<NewsCard['size'], string> = {
  feature: 'news-card-feature',
  horizontal: 'news-card-horizontal',
  square: 'news-card-square',
}

const accentClassByColor: Record<NewsCard['accent'], string> = {
  blue: 'from-blue-600 to-cyan-500',
  orange: 'from-orange-500 to-amber-400',
  green: 'from-emerald-500 to-teal-400',
  violet: 'from-violet-600 to-fuchsia-500',
  rose: 'from-rose-500 to-orange-400',
}

const productIconByName: Record<string, string> = {
  Programs: 'fa-solid fa-layer-group',
  Courses: 'fa-solid fa-book-open',
  'Career Lab': 'fa-solid fa-briefcase',
  Mentorship: 'fa-solid fa-user-group',
  Workshops: 'fa-solid fa-chalkboard-user',
  Community: 'fa-solid fa-people-group',
}

const productColorByName: Record<string, string> = {
  Programs: 'text-blue-600 bg-blue-50',
  Courses: 'text-orange-600 bg-orange-50',
  'Career Lab': 'text-emerald-600 bg-emerald-50',
  Mentorship: 'text-violet-600 bg-violet-50',
  Workshops: 'text-rose-600 bg-rose-50',
  Community: 'text-cyan-600 bg-cyan-50',
}
</script>

<template>
  <section class="relative overflow-hidden bg-gray-50 pt-28 pb-20 text-slate-950">
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>
        <div class="flex flex-wrap justify-center gap-3">
          <div
            v-for="product in products"
            :key="product"
            class="flex w-20 flex-col items-center gap-2"
          >
            <button
              type="button"
              class="flex h-14 w-14 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition hover:border-blue-200 hover:bg-blue-50 cursor-pointer"
              :aria-label="product"
              :title="product"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-md"
                :class="productColorByName[product] ?? 'bg-gray-100 text-slate-600'"
              >
                <i :class="productIconByName[product] ?? 'fa-solid fa-circle-dot'"></i>
              </span>
            </button>
            <span class="max-w-full text-center text-[11px] font-semibold leading-tight text-slate-700">
              {{ product }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap justify-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          class="rounded-md border px-4 py-2 text-sm font-semibold transition cursor-pointer"
          :class="
            activeCategory === 'All'
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
          "
          @click="emit('categoryChange', 'All')"
        >
          All
        </button>
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="rounded-md border px-4 py-2 text-sm font-semibold transition cursor-pointer"
          :class="
            activeCategory === category
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
          "
          @click="emit('categoryChange', category)"
        >
          {{ category }}
        </button>
      </div>

      <div class="news-grid mt-14">
        <RouterLink
          v-for="item in newsItems"
          :key="item.id"
          :to="`/news/${item.slug}`"
          class="news-card group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
          :class="cardClassBySize[item.size]"
        >
          <template v-if="item.size === 'square'">
            <div class="relative h-[52%] overflow-hidden">
              <img
                :src="item.imageUrl"
                :alt="item.imageAlt"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                class="absolute left-3 top-3 rounded-md bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                :class="accentClassByColor[item.accent]"
              >
                {{ item.category }}
              </div>
            </div>

            <div class="flex h-[48%] flex-col justify-between bg-white p-4">
              <div class="space-y-2">
                <h2 class="line-clamp-2 text-base font-black leading-tight text-slate-950">
                  {{ item.title }}
                </h2>
                <p class="line-clamp-2 text-xs leading-5 text-slate-600">
                  {{ item.summary }}
                </p>
              </div>
              <span
                class="mt-2 inline-flex items-center gap-2 self-start text-xs font-bold text-blue-700 transition hover:text-blue-900 cursor-pointer"
              >
                Read story
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </span>
            </div>
          </template>

          <template v-else>
            <img
              :src="item.imageUrl"
              :alt="item.imageAlt"
              class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent"></div>
            <div
              class="absolute left-4 top-4 rounded-md bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              :class="accentClassByColor[item.accent]"
            >
              {{ item.category }}
            </div>

            <div class="absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5">
              <h2
                class="line-clamp-3 text-xl font-black leading-tight text-white"
                :class="{ 'sm:text-4xl': item.size === 'feature', 'sm:text-2xl': item.size === 'horizontal' }"
              >
                {{ item.title }}
              </h2>
              <p
                class="line-clamp-2 text-sm leading-6 text-slate-200"
                :class="{ 'sm:text-base': item.size === 'feature' }"
              >
                {{ item.summary }}
              </p>

              <span
                class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-100 cursor-pointer"
              >
                Read story
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </span>
            </div>
          </template>
        </RouterLink>
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
