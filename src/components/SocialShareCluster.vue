<script setup lang="ts">
import ShareButton from '@/components/ShareButton.vue'
import type { NewsShareData } from '@/data/news'

defineProps<{
  shareData: NewsShareData
  buttonFirst?: boolean
}>()

const socialIcons = [
  { name: 'Facebook', icon: 'fa-brands fa-facebook-f' },
  { name: 'X', icon: 'fa-brands fa-x-twitter' },
  { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in' },
  { name: 'YouTube', icon: 'fa-brands fa-youtube' },
  { name: 'Instagram', icon: 'fa-brands fa-instagram' },
]
</script>

<template>
  <div class="inline-flex flex-wrap items-center gap-3">
    <ShareButton v-if="buttonFirst" :share-data="shareData" variant="detail" />
    <div class="flex -space-x-2" aria-hidden="true">
      <span
        v-for="social in socialIcons"
        :key="social.name"
        class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-sm text-slate-400"
        :title="social.name"
      >
        <i :class="social.icon"></i>
      </span>
    </div>
    <ShareButton v-if="!buttonFirst" :share-data="shareData" variant="detail" />
  </div>
</template>
