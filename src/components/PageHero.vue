<script setup lang="ts">
import AmbientBackdrop from '@/components/AmbientBackdrop.vue'

withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center'
    /** 'narrow' for text-only pages, 'wide' when the default slot adds a column. */
    width?: 'narrow' | 'wide'
  }>(),
  { align: 'left', width: 'narrow' },
)
</script>

<template>
  <section class="relative isolate overflow-hidden bg-white pt-16">
    <AmbientBackdrop :glow="align === 'center' ? 'center' : 'right'" />

    <div
      class="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8"
      :class="align === 'center' && 'text-center'"
    >
      <div
        :class="[
          width === 'narrow' ? 'max-w-3xl' : 'max-w-none',
          align === 'center' && 'mx-auto',
        ]"
      >
        <p v-if="eyebrow" class="rise eyebrow">{{ eyebrow }}</p>
        <h1
          class="rise rise-1 text-pretty text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]"
          :class="eyebrow ? 'mt-4' : 'mt-0'"
        >
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="rise rise-2 mt-6 max-w-2xl text-lg leading-8 text-slate-600"
          :class="align === 'center' && 'mx-auto'"
        >
          {{ subtitle }}
        </p>
      </div>

      <div v-if="$slots.default" class="rise rise-3 mt-10">
        <slot />
      </div>
    </div>
  </section>
</template>
