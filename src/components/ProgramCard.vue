<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Program } from '@/api/models'
import { resolveAssetUrl } from '@/api/util/assetUrl'

const props = defineProps<{ program: Program }>()

const hasImageError = ref(false)
const displayImageUrl = computed(() => (hasImageError.value ? '' : resolveAssetUrl(props.program.imageUrl)))
</script>

<template>
  <RouterLink :to="`/programs/${program.slug}`" class="card card-lift group flex flex-col overflow-hidden">
    <div class="relative aspect-[16/10] overflow-hidden bg-brand-soft">
      <img
        v-if="displayImageUrl"
        :src="displayImageUrl"
        :alt="program.name"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        @error="hasImageError = true"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <i class="fa-solid fa-graduation-cap text-4xl text-brand/25"></i>
      </div>

      <span class="absolute right-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur">
        {{ program.courseCount }} courses
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3 class="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand">
        {{ program.name }}
      </h3>
      <p class="mt-2.5 line-clamp-2 text-[15px] leading-6 text-slate-600">
        {{ program.description }}
      </p>

      <span class="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-brand">
        Explore program
        <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
      </span>
    </div>
  </RouterLink>
</template>
