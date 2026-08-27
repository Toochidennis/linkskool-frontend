<script setup lang="ts">
import logoSrc from '@/assets/logo.png'
import AmbientBackdrop from '@/components/AmbientBackdrop.vue'
import { siteLinks } from '@/config/site'

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/**
 * Flow is the umbrella product — LearnFlow and TeachFlow live inside it,
 * so it appears here as one pillar, not as two siblings of CBT.
 */
const pillars = [
  { label: 'Flow', detail: 'Teaching & learning', href: '#flow' },
  { label: 'CBT', detail: 'Exams & practice' },
  { label: 'Records', detail: 'Results & admin' },
  { label: 'Insights', detail: 'Performance data' },
]

const metrics = [
  { label: 'Average score', value: '82%' },
  { label: 'Attendance', value: '96%' },
  { label: 'Lessons done', value: '48' },
]
</script>

<template>
  <section class="hero relative isolate overflow-hidden bg-white pt-16">
    <AmbientBackdrop />

    <div class="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
      <div class="grid items-center gap-12 sm:gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <!-- ── message ─────────────────────────────────────────── -->
        <div class="max-w-[36rem] xl:max-w-[43rem]">
          <p class="rise inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/70 py-1.5 pl-2.5 pr-4 text-[13px] font-medium text-slate-600 backdrop-blur">
            <span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
            Education infrastructure for Africa
          </p>

          <h1 class="rise rise-1 mt-7 text-pretty text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.85rem]">
            Run your whole school on
            <span class="relative whitespace-nowrap">
              one platform.
              <svg class="absolute -bottom-0.5 left-0 h-[0.3em] w-full text-orange sm:-bottom-1" viewBox="0 0 240 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M1 11.4C62 5.6 172 2.4 239 5.1 173 7.6 63 10.9 1 11.4Z" fill="currentColor" />
              </svg>
            </span>
          </h1>

          <p class="rise rise-2 mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
            Lessons, CBT exams, academic records and performance insights — connected in a single
            system for students, teachers and administrators.
          </p>

          <div class="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              :href="siteLinks.app"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary group"
            >
              Open LinkSkool
              <i class="fa-solid fa-arrow-up-right-from-square text-[11px] transition-transform group-hover:-translate-y-px group-hover:translate-x-px"></i>
            </a>
            <button
              type="button"
              @click="scrollTo('programs')"
              class="btn btn-ghost group"
            >
              Explore programs
              <i class="fa-solid fa-arrow-down text-[11px] text-slate-400 transition group-hover:translate-y-0.5 group-hover:text-brand"></i>
            </button>
          </div>

          <ul class="rise rise-4 mt-11 grid grid-cols-2 sm:mt-14 gap-y-6 border-t border-slate-200/80 pt-7 sm:grid-cols-4 sm:gap-x-2">
            <li v-for="pillar in pillars" :key="pillar.label" class="sm:border-l sm:border-slate-200/80 sm:first:border-l-0 sm:pl-5 sm:first:pl-0">
              <component
                :is="pillar.href ? 'a' : 'div'"
                :href="pillar.href"
                class="group/pillar block"
                :class="pillar.href && 'transition hover:text-brand'"
              >
                <p class="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-slate-900" :class="pillar.href && 'group-hover/pillar:text-brand'">
                  {{ pillar.label }}
                  <i v-if="pillar.href" class="fa-solid fa-arrow-down text-[10px] text-slate-400 transition group-hover/pillar:translate-y-0.5 group-hover/pillar:text-brand"></i>
                </p>
                <p class="mt-1 text-[13px] text-slate-500">{{ pillar.detail }}</p>
              </component>
            </li>
          </ul>
        </div>

        <!-- ── product surface ─────────────────────────────────── -->
        <div class="rise rise-2 relative mx-auto w-full max-w-[30rem] lg:mx-0 lg:max-w-none" aria-hidden="true">
          <div class="card-raised relative rounded-[16px] border border-slate-200/80 bg-white/95 backdrop-blur">
            <!-- chrome -->
            <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div class="flex items-center gap-2.5">
                <img :src="logoSrc" alt="" class="h-6 w-6 object-contain" />
                <span class="text-[15px] font-semibold tracking-tight"><span class="text-brand">Link</span><span class="text-orange">Skool</span></span>
              </div>
              <span class="text-xs font-medium text-slate-400">Second term · SS2</span>
            </div>

            <!-- focal block -->
            <div class="px-6 pb-9 pt-7 sm:px-7 sm:pb-10">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Continue learning</p>
              <div class="mt-4 flex items-center gap-6">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-2xl font-semibold tracking-tight text-slate-950">Mathematics</p>
                  <p class="mt-1.5 text-sm text-slate-500">Algebra · Lesson 9 of 12</p>
                </div>
                <div class="relative h-[70px] w-[70px] shrink-0">
                  <svg viewBox="0 0 70 70" class="h-full w-full -rotate-90">
                    <circle cx="35" cy="35" r="30" fill="none" stroke="#E8EDF7" stroke-width="6" />
                    <circle cx="35" cy="35" r="30" fill="none" stroke="currentColor" class="text-brand" stroke-width="6" stroke-linecap="round" stroke-dasharray="188.5" stroke-dashoffset="50.9" />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900">73%</span>
                </div>
              </div>

              <!-- hairline metrics, no boxes -->
              <dl class="mt-8 grid grid-cols-3 border-t border-slate-100 pt-6">
                <div v-for="metric in metrics" :key="metric.label" class="border-l border-slate-100 pl-4 first:border-l-0 first:pl-0">
                  <dd class="text-xl font-semibold tracking-tight text-slate-900">{{ metric.value }}</dd>
                  <dt class="mt-1 text-[12px] text-slate-500">{{ metric.label }}</dt>
                </div>
              </dl>
            </div>
          </div>

          <!-- one floating element instead of a crowded interior -->
          <div class="hero-float absolute -bottom-11 -left-2 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 py-3.5 pl-3.5 pr-5 backdrop-blur sm:-left-9">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
              <i class="fa-solid fa-clipboard-check text-sm"></i>
            </span>
            <div>
              <p class="text-[13px] font-semibold text-slate-900">CBT practice ready</p>
              <p class="mt-0.5 text-[12px] text-slate-500">Physics · 20 questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-float {
  box-shadow:
    0 2px 4px rgba(15, 23, 42, 0.04),
    0 18px 40px -18px rgba(15, 23, 42, 0.24);
}

</style>
