<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Program } from '@/api/models'
import { resolveAssetUrl } from '@/api/util/assetUrl'

const props = defineProps<{
  program: Program
}>()

const displayImageUrl = computed(() => resolveAssetUrl(props.program.imageUrl))
</script>

<template>
  <RouterLink :to="`/programs/${program.slug}`"
    class="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <!-- Image Container -->
    <div class="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
      <img v-if="displayImageUrl" :src="displayImageUrl" :alt="program.name" loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="fa-solid fa-graduation-cap text-6xl text-blue-300"></i>
      </div>

      <!-- Course Count Badge -->
      <div class="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
        <span class="text-sm font-semibold text-gray-700">
          {{ program.courseCount }} courses
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
        {{ program.name }}
      </h3>

      <p class="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
        {{ program.description }}
      </p>

      <!-- CTA -->
      <div class="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
        <span>Explore Program</span>
        <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
      </div>
    </div>
  </RouterLink>
</template>
