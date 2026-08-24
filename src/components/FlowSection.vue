<script setup lang="ts">
import { siteLinks } from '@/config/site'

/**
 * Drop a wide image at `public/flow-backdrop.jpeg` to fill this section's backdrop.
 * Recommended: ~2400×1400, mid-to-dark tone, with the visual interest on the RIGHT
 * (the left is where the copy sits and stays heavily scrimmed).
 * The section is designed to look finished WITHOUT the file — if it is missing the
 * gradient simply shows through, no broken image.
 * Tune `backdropOpacity` if your photo reads too strong or too faint.
 */
const backdropUrl = '/flow-backdrop.jpeg'
const backdropOpacity = 0.38

const surfaces = [
  {
    name: 'LearnFlow',
    audience: 'For students',
    icon: 'fa-book-open-reader',
    points: ['Follow lessons at your own pace', 'Open notes, videos and resources', 'Submit work and track progress'],
  },
  {
    name: 'TeachFlow',
    audience: 'For teachers',
    icon: 'fa-chalkboard-user',
    points: ['Plan and publish lessons', 'Share materials with a class', 'Set work, mark it, see who is behind'],
  },
]
</script>

<template>
  <section id="flow" class="relative isolate scroll-mt-16 overflow-hidden bg-brand-ink">
    <!-- backdrop image (optional) -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url('${backdropUrl}')`, opacity: backdropOpacity }"
      aria-hidden="true"
    ></div>

    <!-- scrim: keeps copy legible over whatever photo lands here -->
    <div class="flow-scrim" aria-hidden="true"></div>
    <div class="flow-grid" aria-hidden="true"></div>

    <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div class="max-w-2xl">
        <p class="eyebrow eyebrow-on-dark">LinkSkool Flow</p>
        <h2 class="mt-4 text-pretty text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.4rem]">
          One classroom.
          <span class="relative whitespace-nowrap">
            Two views.
            <svg class="absolute -bottom-0.5 left-0 h-[0.3em] w-full text-orange sm:-bottom-1" viewBox="0 0 240 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M1 11.4C62 5.6 172 2.4 239 5.1 173 7.6 63 10.9 1 11.4Z" fill="currentColor" />
            </svg>
          </span>
        </h2>
        <p class="mt-7 text-lg leading-8 text-blue-100/85 sm:text-xl sm:leading-9">
          Flow is where teaching and learning actually meet. Teachers plan and deliver in
          <strong class="font-semibold text-white">TeachFlow</strong>; students follow and submit in
          <strong class="font-semibold text-white">LearnFlow</strong> — the same classroom, seen from
          both sides.
        </p>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a :href="siteLinks.teachflow" target="_blank" rel="noopener noreferrer" class="btn btn-light">
            Open Flow
            <i class="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
          </a>
          <a href="#platform" class="btn btn-outline-light">See the full platform</a>
        </div>
      </div>

      <div class="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-2 lg:gap-6">
        <article v-for="surface in surfaces" :key="surface.name" class="card-glass p-7 sm:p-8">
          <div class="flex items-center gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white">
              <i :class="['fa-solid', surface.icon]"></i>
            </span>
            <div class="min-w-0">
              <h3 class="text-xl font-semibold tracking-tight text-white">{{ surface.name }}</h3>
              <p class="mt-0.5 text-sm text-blue-100/70">{{ surface.audience }}</p>
            </div>
          </div>

          <ul class="mt-7 space-y-3.5 border-t border-white/10 pt-6">
            <li v-for="point in surface.points" :key="point" class="flex gap-3 text-[15px] leading-6 text-blue-50/85">
              <i class="fa-solid fa-check mt-1 text-[11px] text-orange"></i>
              <span>{{ point }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Left-weighted on wide screens so the photo breathes on the right;
   near-solid on narrow screens where the copy spans the full width. */
.flow-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(20, 40, 110, 0.55) 0%, rgba(20, 40, 110, 0.8) 100%),
    linear-gradient(90deg, #14286e 0%, rgba(20, 40, 110, 0.94) 45%, rgba(20, 40, 110, 0.86) 100%);
}

@media (min-width: 1024px) {
  .flow-scrim {
    background:
      linear-gradient(180deg, rgba(20, 40, 110, 0.35) 0%, rgba(20, 40, 110, 0.78) 100%),
      linear-gradient(90deg, #14286e 0%, rgba(20, 40, 110, 0.9) 42%, rgba(20, 40, 110, 0.55) 100%);
  }
}

.flow-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 68px 68px;
  -webkit-mask-image: radial-gradient(110% 80% at 20% 0%, #000 0%, transparent 70%);
  mask-image: radial-gradient(110% 80% at 20% 0%, #000 0%, transparent 70%);
}
</style>
