<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PageHero from '@/components/PageHero.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import {
  aboutCapabilities,
  aboutFutureFocus,
  aboutStakeholders,
  aboutStats,
} from '@/data/about'

usePageMeta({
  title: 'About LinkSkool',
  description:
    'LinkSkool Online Ventures Limited builds the education technology infrastructure behind learning, assessment, school management and education data across Africa.',
  keywords: 'about LinkSkool, education technology, education data infrastructure, LMS, CBT, school management',
  url: 'https://linkskool.com/about',
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader />

    <main>
      <PageHero
        eyebrow="About LinkSkool"
        title="Building the data layer for modern education."
        subtitle="LinkSkool Online Ventures Limited is an education technology company building the digital infrastructure required to modernize learning, assessment, and education data management across Africa."
      >
        <div class="card card-raised max-w-4xl p-7 sm:p-9">
          <p class="eyebrow">What we do</p>
          <p class="mt-5 text-xl font-medium leading-relaxed text-slate-800 sm:text-2xl sm:leading-relaxed">
            We connect learning, assessments, records, operations, analytics and data services
            inside one education ecosystem.
          </p>
          <dl class="mt-9 grid gap-6 border-t border-slate-100 pt-7 sm:grid-cols-3 sm:gap-4">
            <div
              v-for="stat in aboutStats"
              :key="stat.label"
              class="sm:border-l sm:border-slate-100 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dd class="text-3xl font-semibold tracking-tight text-brand">{{ stat.value }}</dd>
              <dt class="mt-1.5 text-[13px] leading-5 text-slate-500">{{ stat.label }}</dt>
            </div>
          </dl>
        </div>
      </PageHero>

      <section class="py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl">
            <p class="eyebrow">Platform</p>
            <h2 class="mt-4 text-pretty text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[2.6rem]">
              One ecosystem. Many education workflows.
            </h2>
          </div>

          <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <article v-for="capability in aboutCapabilities" :key="capability.title" class="card p-7">
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <i :class="capability.icon"></i>
              </span>
              <h3 class="mt-6 text-lg font-semibold tracking-tight text-slate-950">{{ capability.title }}</h3>
              <p class="mt-2.5 text-[15px] leading-6 text-slate-600">{{ capability.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="border-y border-slate-200/70 bg-slate-50/70 py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p class="eyebrow">Mission</p>
              <h2 class="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-slate-950 sm:text-4xl">Simplify and unify education data.</h2>
              <p class="mt-4 leading-8 text-slate-600">
                Our mission is to provide a platform that improves learning, enhances teaching, and
                enables data-driven decision-making for institutions, learners, and governments.
              </p>
            </div>
            <div>
              <p class="eyebrow">Vision</p>
              <h2 class="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-slate-950 sm:text-4xl">Become the primary digital infrastructure for education.</h2>
              <p class="mt-4 leading-8 text-slate-600">
                We are building toward a connected education ecosystem where learning, assessment,
                and academic data can move across institutions securely and intelligently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-24">
        <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <h2 class="text-[1.75rem] font-semibold tracking-[-0.025em] text-slate-950 sm:text-4xl">Who we serve</h2>
            <div class="mt-6 flex flex-wrap gap-3">
              <span
                v-for="stakeholder in aboutStakeholders"
                :key="stakeholder"
                class="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700"
              >
                {{ stakeholder }}
              </span>
            </div>
          </div>

          <div>
            <h2 class="text-[1.75rem] font-semibold tracking-[-0.025em] text-slate-950 sm:text-4xl">Where we are going</h2>
            <ul class="mt-6 space-y-3">
              <li v-for="focus in aboutFutureFocus" :key="focus" class="flex gap-3 text-[15px] leading-6 text-slate-700">
                <i class="fa-solid fa-arrow-trend-up mt-1 text-orange"></i>
                <span>{{ focus }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
