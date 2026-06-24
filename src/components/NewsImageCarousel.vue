<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { NewsDisplayImage } from '@/data/news'

const props = defineProps<{
  images: NewsDisplayImage[]
}>()

const activeIndex = ref(0)

const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0])
const hasMultipleImages = computed(() => props.images.length > 1)

const goToPrevious = () => {
  if (!hasMultipleImages.value) {
    return
  }

  activeIndex.value = activeIndex.value === 0 ? props.images.length - 1 : activeIndex.value - 1
}

const goToNext = () => {
  if (!hasMultipleImages.value) {
    return
  }

  activeIndex.value = activeIndex.value === props.images.length - 1 ? 0 : activeIndex.value + 1
}

watch(
  () => props.images,
  () => {
    activeIndex.value = 0
  },
)
</script>

<template>
  <div v-if="activeImage" class="mt-8">
    <div class="relative h-[22rem] overflow-hidden rounded-md bg-gray-100 md:h-[30rem]">
      <img :src="activeImage.url" :alt="activeImage.alt" class="h-full w-full object-cover" />

      <template v-if="hasMultipleImages">
        <button
          type="button"
          class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-900 shadow-sm transition hover:bg-white cursor-pointer"
          aria-label="Previous image"
          @click="goToPrevious"
        >
          <i class="fa-solid fa-chevron-left text-sm"></i>
        </button>
        <button
          type="button"
          class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-900 shadow-sm transition hover:bg-white cursor-pointer"
          aria-label="Next image"
          @click="goToNext"
        >
          <i class="fa-solid fa-chevron-right text-sm"></i>
        </button>
        <div class="absolute bottom-4 right-4 rounded-md bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">
          {{ activeIndex + 1 }} / {{ images.length }}
        </div>
      </template>
    </div>
  </div>
</template>
