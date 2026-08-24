<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppDownloadSection from '@/components/AppDownloadSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import FlowSection from '@/components/FlowSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import ProgramCard from '@/components/ProgramCard.vue'
import type { Program } from '@/api/models'
import { programService } from '@/api/services'
import { siteLinks } from '@/config/site'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: 'LinkSkool | Learning, Assessment and School Management',
  description:
    'LinkSkool brings lessons, CBT exams, academic records and performance insights into one platform for students, teachers and schools across Africa.',
  keywords: 'digital learning, CBT assessment, school management, education platform, LinkSkool',
  url: 'https://linkskool.com',
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
})

const programs = ref<Program[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    programs.value = await programService.getAllPrograms()
  } catch (error) {
    console.error('Failed to fetch programs:', error)
  } finally {
    isLoading.value = false
  }
})

/**
 * Deliberately excludes teaching/learning — that is Flow's job, covered by the
 * section above. These are the surfaces that sit *around* the classroom.
 */
const platformCapabilities = [
  {
    icon: 'fa-clipboard-check',
    title: 'CBT and assessments',
    text: 'Run practice tests, timed exams and certifications, then release results with the analysis behind them.',
  },
  {
    icon: 'fa-folder-open',
    title: 'Records and operations',
    text: 'Attendance, results, academic activities and administrative workflows kept in one place.',
  },
  {
    icon: 'fa-chart-simple',
    title: 'Insights and reporting',
    text: 'Track learners and cohorts over time, and report on the whole institution from the same data.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader />

    <main>
      <HeroSection />

      <!-- Flagship product -->
      <FlowSection />

      <!-- Everything around the classroom -->
      <section id="platform" class="scroll-mt-16 py-20 sm:py-24 lg:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div class="max-w-2xl">
              <p class="eyebrow">The platform</p>
              <h2 class="mt-4 text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[2.6rem]">
                Everything that surrounds the classroom.
              </h2>
              <p class="mt-5 text-lg leading-8 text-slate-600">
                Flow covers teaching and learning. The rest of LinkSkool covers what a school needs
                around it — so the same records follow a learner from a lesson to a result to a
                report.
              </p>
            </div>

            <div class="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-200/80 md:grid-cols-3 lg:mt-14">
              <article
                v-for="capability in platformCapabilities"
                :key="capability.title"
                class="bg-white p-7 sm:p-8"
              >
                <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <i :class="['fa-solid', capability.icon]"></i>
                </span>
                <h3 class="mt-6 text-lg font-semibold tracking-tight text-slate-950">
                  {{ capability.title }}
                </h3>
                <p class="mt-2.5 leading-7 text-slate-600">{{ capability.text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Audience switch: individual learners -->
      <section id="programs" class="scroll-mt-16 border-y border-slate-200/70 bg-slate-50/70 py-20 sm:py-24 lg:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div class="max-w-2xl">
              <p class="eyebrow">For individual learners</p>
              <h2 class="mt-4 text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[2.6rem]">
                Learn a skill on your own.
              </h2>
              <p class="mt-5 text-lg leading-8 text-slate-600">
                Not part of a LinkSkool school? Enrol in a structured program and work through it at
                your own pace.
              </p>
            </div>
          </div>

          <div v-if="isLoading" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="i in 8" :key="i" class="h-80 animate-pulse rounded-[24px] bg-slate-200/70"></div>
          </div>
          <div v-else-if="programs.length" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProgramCard v-for="program in programs" :key="program.id" :program="program" />
          </div>
          <div
            v-else
            class="mt-12 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-600"
          >
            Programs will appear here shortly.
          </div>
        </div>
      </section>

      <AppDownloadSection />

      <!-- Two doors: resolves the school / learner split -->
      <section class="px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div class="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-brand px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div class="cta-glow" aria-hidden="true"></div>

          <div class="relative">
            <h2 class="max-w-2xl text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]">
              Two ways to start.
            </h2>

            <div class="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
              <article class="card-glass flex flex-col p-7 sm:p-8">
                <h3 class="text-xl font-semibold tracking-tight text-white">Bring LinkSkool to your school</h3>
                <p class="mt-3 flex-1 leading-7 text-blue-100/85">
                  Move lessons, exams, records and reporting onto one platform your staff and
                  students already share.
                </p>
                <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a :href="siteLinks.app" target="_blank" rel="noopener noreferrer" class="btn btn-light btn-sm">
                    Open LinkSkool
                    <i class="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
                  </a>
                  <RouterLink to="/contact" class="btn btn-outline-light btn-sm">Talk to us</RouterLink>
                </div>
              </article>

              <article class="card-glass flex flex-col p-7 sm:p-8">
                <h3 class="text-xl font-semibold tracking-tight text-white">Learn something on your own</h3>
                <p class="mt-3 flex-1 leading-7 text-blue-100/85">
                  Pick a program, take the first lesson today, and keep your progress across every
                  device you use.
                </p>
                <div class="mt-7">
                  <a href="#programs" class="btn btn-light btn-sm">
                    Browse programs
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.cta-glow {
  position: absolute;
  top: -20rem;
  right: -10rem;
  width: 42rem;
  height: 42rem;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 68%);
  pointer-events: none;
}
</style>
