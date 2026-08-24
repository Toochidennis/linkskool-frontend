<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { NewsCard } from '@/data/news'

defineProps<{
  newsItems: NewsCard[]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <RouterLink
      v-for="item in newsItems"
      :key="item.id"
      :to="`/news/${item.slug}`"
      class="card card-lift group grid grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-[20px]"
    >
      <img :src="item.imageUrl" :alt="item.imageAlt" class="h-full min-h-32 w-full object-cover" loading="lazy" />
      <div class="flex min-w-0 flex-col justify-between p-4">
        <div class="space-y-2">
          <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
            {{ item.category }}
          </span>
          <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-slate-950 group-hover:text-brand">
            {{ item.title }}
          </h3>
          <p class="line-clamp-2 text-xs leading-5 text-slate-500">
            {{ item.summary }}
          </p>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
