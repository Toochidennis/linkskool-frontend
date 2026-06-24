<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { adsenseConfig } from '@/config/adsense'
import { useAdsense } from '@/composables/useAdsense'

const props = withDefaults(
  defineProps<{
    slot?: string
    format?: 'auto' | 'fluid'
    layout?: string
    fullWidthResponsive?: boolean
    label?: string
  }>(),
  {
    format: 'auto',
    fullWidthResponsive: true,
    label: 'Advertisement',
  },
)

const { isAdsenseConfigured, requestAd } = useAdsense()

const canRenderAd = computed(() => Boolean(isAdsenseConfigured && props.slot))

onMounted(() => {
  if (canRenderAd.value) {
    requestAd()
  }
})
</script>

<template>
  <aside class="ad-slot rounded-md border border-dashed border-gray-200 bg-white/80 p-3">
    <p class="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">
      {{ label }}
    </p>

    <ins
      v-if="canRenderAd"
      class="adsbygoogle block min-h-24"
      :data-ad-client="adsenseConfig.clientId"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-ad-layout="layout"
      :data-full-width-responsive="String(fullWidthResponsive)"
    ></ins>

    <div v-else class="flex min-h-24 items-center justify-center rounded-md bg-gray-50 text-xs font-semibold text-gray-400">
      Ad space
    </div>
  </aside>
</template>

<style scoped>
.ad-slot {
  contain: layout style;
}
</style>
