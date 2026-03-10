<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProgramCard from '@/components/ProgramCard.vue'
import type { Program } from '@/api/models'
import { programService } from '@/api/services'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()

const programs = ref<Program[]>([])
const isLoadingPrograms = ref(false)
const configuredWhatsappGroupUrl = (import.meta.env.VITE_WHATSAPP_GROUP_URL as string | undefined)?.trim() ?? ''

const paymentStatus = computed(() => {
  const raw = route.query.status
  if (Array.isArray(raw)) {
    return (raw[0] ?? '').toLowerCase()
  }
  return (raw ?? '').toLowerCase()
})

const paymentReference = computed(() => {
  const raw = route.query.reference ?? route.query.trxref
  if (Array.isArray(raw)) {
    return raw[0] ?? ''
  }
  return raw ?? ''
})

const isSuccessful = computed(() => paymentStatus.value === 'success')

const statusBadgeLabel = computed(() => {
  if (isSuccessful.value) {
    return 'Payment Received'
  }
  return 'Payment Update Received'
})

const heroTitle = computed(() => {
  if (isSuccessful.value) {
    return 'Thank you for your payment'
  }
  return 'Enrollment request received'
})

const heroBody = computed(() => {
  if (isSuccessful.value) {
    return 'Your payment was successful and your enrollment is being finalized. You can keep building momentum by enrolling in another learning path below.'
  }
  return 'We have received your payment update. If your enrollment is still processing, our team will complete the confirmation shortly.'
})

const ctaLabel = computed(() => {
  if (isSuccessful.value) {
    return 'Explore more programs'
  }
  return 'Browse programs'
})

const hasWhatsappGroupUrl = computed(() => Boolean(configuredWhatsappGroupUrl))

const whatsappJoinLink = computed(() => {
  if (configuredWhatsappGroupUrl) {
    return configuredWhatsappGroupUrl
  }
  return 'mailto:hello@linkskool.com?subject=WhatsApp%20Group%20Access&body=Hi%20LinkSkool%2C%20I%20just%20completed%20my%20payment.%20Please%20add%20me%20to%20the%20WhatsApp%20group.'
})

const featuredPrograms = computed(() => programs.value.slice(0, 6))

usePageMeta(() => ({
  title: isSuccessful.value
    ? 'Payment Complete | Linkskool'
    : 'Payment Update | Linkskool',
  description: isSuccessful.value
    ? 'Your Linkskool payment was successful. Discover more programs and continue your learning journey.'
    : 'Your Linkskool payment update has been received. Explore additional programs while your enrollment is being confirmed.',
  keywords: 'payment completion, paystack callback, program enrollment, linkskool',
  url: 'https://linkskool.com/payment/completion',
  image: 'https://linkskool.com/assets/og-image.png',
  type: 'website',
}))

onMounted(async () => {
  isLoadingPrograms.value = true
  try {
    const response = await programService.getAllPrograms()
    programs.value = response
  } catch (error) {
    console.error('Failed to fetch programs for payment completion page:', error)
  } finally {
    isLoadingPrograms.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 pt-24 pb-16">
      <div class="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-300/20 blur-2xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-orange-300/20 blur-2xl">
      </div>

      <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ statusBadgeLabel }}</span>
        </div>

        <h1 class="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
          {{ heroTitle }}
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">
          {{ heroBody }}
        </p>

        <div
          class="mt-6 max-w-3xl rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-blue-100 backdrop-blur-sm">
          <p class="text-sm md:text-base">
            Join the learners WhatsApp group to get onboarding updates, class reminders, and support from the team.
          </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a :href="whatsappJoinLink" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-xl">
            <i class="fa-brands fa-whatsapp"></i>
            <span>Join WhatsApp Group</span>
          </a>

          <RouterLink to="/#programs"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl">
            <span>{{ ctaLabel }}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>

          <RouterLink to="/"
            class="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-transparent px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/10">
            <span>Return home</span>
          </RouterLink>
        </div>

        <p v-if="!hasWhatsappGroupUrl" class="mt-3 text-sm text-blue-100/90">
          WhatsApp invite link is not yet public. Click the button to request access and our team will add you.
        </p>

        <div v-if="paymentReference"
          class="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm text-blue-100">
          <span class="font-semibold">Reference:</span>
          <span class="font-mono">{{ paymentReference }}</span>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="text-3xl font-black text-gray-900 md:text-4xl">Keep your learning streak alive</h2>
            <p class="mt-2 max-w-2xl text-gray-600">Here are additional programs you can enroll in right away.</p>
          </div>
          <RouterLink to="/#programs"
            class="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700">
            <span>View all programs</span>
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="isLoadingPrograms" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-96 animate-pulse rounded-2xl bg-gray-200"></div>
        </div>

        <div v-else-if="featuredPrograms.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProgramCard v-for="program in featuredPrograms" :key="program.id" :program="program" />
        </div>

        <div v-else class="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <i class="fa-solid fa-book-open-reader text-4xl text-gray-400"></i>
          <p class="mt-4 text-gray-600">Programs are not available right now. Please check back shortly.</p>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>
