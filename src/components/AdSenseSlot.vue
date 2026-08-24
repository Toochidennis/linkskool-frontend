<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

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

const { isAdsenseConfigured, observeAdStatus, requestAd } = useAdsense()

const canRenderAd = computed(() => Boolean(isAdsenseConfigured && props.slot))
const adElement = ref<HTMLElement | null>(null)
const adStatus = ref<'pending' | 'filled' | 'unfilled'>('pending')
const hasFilledAd = computed(() => adStatus.value === 'filled')

let stopObservingAdStatus: (() => void) | undefined

onMounted(async () => {
  if (canRenderAd.value) {
    await nextTick()

    if (adElement.value) {
      stopObservingAdStatus = observeAdStatus(adElement.value, (status) => {
        adStatus.value = status
      })
    }

    requestAd()
  }
})

onBeforeUnmount(() => {
  stopObservingAdStatus?.()
})
</script>

<template>
  <aside
    v-if="canRenderAd"
    class="ad-slot rounded-md border border-dashed border-slate-200 bg-white/80 p-3"
    :class="{ 'ad-slot--empty': !hasFilledAd }"
  >
    <p v-if="hasFilledAd" class="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {{ label }}
    </p>

    <ins
      ref="adElement"
      class="adsbygoogle adsense-slot block"
      :data-ad-client="adsenseConfig.clientId"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-ad-layout="layout"
      :data-full-width-responsive="String(fullWidthResponsive)"
    ></ins>
  </aside>
</template>

<style scoped>
.ad-slot {
  contain: layout style;
}

.adsense-slot {
  min-height: 0;
}

.ad-slot:not(.ad-slot--empty) .adsense-slot {
  min-height: 6rem;
}

.ad-slot--empty {
  height: 0 !important;
  min-height: 0 !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  overflow: hidden;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
}
</style>
