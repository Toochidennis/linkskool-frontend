<script setup lang="ts">
/**
 * The shared atmospheric layer behind hero/top sections: a soft vertical wash,
 * a radial-masked grid, and one low-opacity brand glow.
 * Purely decorative — always rendered aria-hidden and behind content.
 */
withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
    /** Nudges the glow; 'right' suits split layouts, 'center' suits centred ones. */
    glow?: 'right' | 'center' | 'none'
  }>(),
  { tone: 'light', glow: 'right' },
)
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div :class="['ab-wash', tone === 'dark' ? 'ab-wash-dark' : 'ab-wash-light']"></div>
    <div :class="['ab-grid', tone === 'dark' ? 'ab-grid-dark' : 'ab-grid-light']"></div>
    <div
      v-if="glow !== 'none'"
      :class="['ab-glow', glow === 'center' ? 'ab-glow-center' : 'ab-glow-right', tone === 'dark' && 'ab-glow-dark']"
    ></div>
  </div>
</template>

<style scoped>
.ab-wash {
  position: absolute;
  inset: 0;
}
.ab-wash-light {
  background: linear-gradient(180deg, #f6f8fe 0%, #fbfcff 42%, #ffffff 100%);
}
.ab-wash-dark {
  background: linear-gradient(180deg, #14286e 0%, #162c78 45%, #1b3a9e 100%);
}

.ab-grid {
  position: absolute;
  inset: 0;
  background-size: 68px 68px;
  -webkit-mask-image: radial-gradient(120% 85% at 50% 0%, #000 0%, transparent 72%);
  mask-image: radial-gradient(120% 85% at 50% 0%, #000 0%, transparent 72%);
}
.ab-grid-light {
  background-image:
    linear-gradient(to right, rgba(27, 58, 158, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(27, 58, 158, 0.055) 1px, transparent 1px);
}
.ab-grid-dark {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
}

.ab-glow {
  position: absolute;
  width: 48rem;
  height: 48rem;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(27, 58, 158, 0.11) 0%, rgba(27, 58, 158, 0) 68%);
}
.ab-glow-dark {
  background: radial-gradient(circle, rgba(120, 160, 255, 0.2) 0%, rgba(120, 160, 255, 0) 68%);
}
.ab-glow-right {
  top: -18rem;
  right: -12rem;
}
.ab-glow-center {
  top: -26rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
