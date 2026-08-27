<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

import AmbientBackdrop from '@/components/AmbientBackdrop.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { usePageMeta } from '@/composables/usePageMeta'

const router = useRouter()

usePageMeta({
  title: '404 - Page Not Found | LinkSkool',
  description:
    'This page could not be found. Head back to LinkSkool to explore the platform and our learning programs.',
  keywords: 'page not found, 404 error',
  url: 'https://linkskool.com/404',
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
})

const shortcuts = [
  { label: 'Programs', to: '/#programs', icon: 'fa-graduation-cap' },
  { label: 'LinkSkool Flow', to: '/#flow', icon: 'fa-layer-group' },
  { label: 'News', to: '/news', icon: 'fa-newspaper' },
  { label: 'Contact', to: '/contact', icon: 'fa-envelope' },
]
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-hidden bg-white">
    <AppHeader />

    <main class="relative isolate flex flex-1 items-center overflow-hidden pt-16">
      <AmbientBackdrop glow="center" />

      <div class="relative mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p class="rise eyebrow">Error 404</p>

        <h1 class="rise rise-1 mt-5 text-pretty text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
          This page isn’t here.
        </h1>
        <p class="rise rise-2 mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
          The link may be out of date, or the page may have moved. Everything else is one click away.
        </p>

        <div class="rise rise-3 mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <RouterLink to="/" class="btn btn-primary">
            Back to home
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </RouterLink>
          <button type="button" class="btn btn-secondary" @click="router.back()">
            <i class="fa-solid fa-arrow-left text-xs"></i>
            Go back
          </button>
        </div>

        <div class="rise rise-4 mx-auto mt-16 max-w-xl border-t border-slate-200/80 pt-8">
          <p class="text-sm text-slate-500">Or jump straight to</p>
          <div class="mt-5 flex flex-wrap justify-center gap-2.5">
            <RouterLink
              v-for="shortcut in shortcuts"
              :key="shortcut.label"
              :to="shortcut.to"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand/30 hover:text-brand"
            >
              <i :class="['fa-solid', shortcut.icon, 'text-xs text-slate-400']"></i>
              {{ shortcut.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
