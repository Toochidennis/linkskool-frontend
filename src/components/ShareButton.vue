<script setup lang="ts">
import type { NewsShareData } from '@/data/news'
import { useWebShare } from '@/composables/useWebShare'

withDefaults(
  defineProps<{
    shareData: NewsShareData
    variant?: 'card' | 'detail'
  }>(),
  { variant: 'card' },
)

const { share, status } = useWebShare()
</script>

<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border font-semibold transition"
    :class="
      variant === 'detail'
        ? 'border-brand bg-brand px-5 py-3 text-sm text-white shadow-sm shadow-blue-900/20 hover:border-brand-ink hover:bg-brand-ink'
        : 'h-9 w-9 border-white/30 bg-slate-950/65 text-white backdrop-blur hover:border-white hover:bg-white hover:text-brand'
    "
    :aria-label="status === 'copied' ? 'Link copied' : 'Share this story'"
    :title="status === 'copied' ? 'Link copied' : status === 'error' ? 'Unable to copy link' : 'Share story'"
    @click="share(shareData)"
  >
    <i :class="status === 'copied' ? 'fa-solid fa-check' : 'fa-solid fa-share-nodes'" aria-hidden="true"></i>
    <span v-if="variant === 'detail'">{{ status === 'copied' ? 'Link copied' : 'Share' }}</span>
  </button>
</template>
