<script setup lang="ts">
import { computed } from 'vue'

import { siteLinks } from '@/config/site'

const platforms = computed(() => [
  { key: 'android', name: 'Android', icon: 'fa-brands fa-google-play', url: siteLinks.androidApp },
  { key: 'desktop', name: 'Desktop', icon: 'fa-solid fa-display', url: siteLinks.desktopApp },
  // VITE_LINKSKOOL_IOS_APP_URL is still a placeholder App Store id, so this stays
  // "coming soon". Swap in `siteLinks.iosApp` once the real listing is live.
  { key: 'ios', name: 'iPhone & iPad', icon: 'fa-brands fa-apple', url: undefined },
])
</script>

<template>
  <section class="py-20 sm:py-24 lg:py-28">
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
      <div class="max-w-xl">
        <p class="eyebrow">Learn anywhere</p>
        <h2 class="mt-4 text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[2.6rem]">
          Take LinkSkool with you.
        </h2>
        <p class="mt-5 text-lg leading-8 text-slate-600">
          Keep your lessons, your work and your progress in step across every device you use.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-3">
        <template v-for="platform in platforms" :key="platform.key">
          <a
            v-if="platform.url"
            :href="platform.url"
            target="_blank"
            rel="noopener noreferrer"
            class="card card-lift group p-6"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <i :class="[platform.icon, 'text-lg']"></i>
            </span>
            <p class="mt-7 text-xs font-medium text-slate-500">Download for</p>
            <span class="mt-1 flex items-center justify-between gap-2">
              <span class="font-semibold tracking-tight text-slate-950">{{ platform.name }}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-slate-400 transition group-hover:text-brand"></i>
            </span>
          </a>

          <div v-else class="rounded-[14px] border border-dashed border-slate-300 bg-slate-50/60 p-6">
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-500">
              <i :class="[platform.icon, 'text-lg']"></i>
            </span>
            <p class="mt-7 text-xs font-medium text-brand">Coming soon</p>
            <p class="mt-1 font-semibold tracking-tight text-slate-700">{{ platform.name }}</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
