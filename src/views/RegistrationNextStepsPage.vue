<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProgramCard from '@/components/ProgramCard.vue'
import RegistrationSteps from '@/components/RegistrationSteps.vue'
import type { Program, Registration } from '@/api/models'
import { ApiError } from '@/api/client'
import { enrollmentService, programService } from '@/api/services'
import { usePageMeta } from '@/composables/usePageMeta'
import logoSrc from '@/assets/logo.png'

/**
 * Step 3 of Register now: getting set up. Paid or not, everyone gets the app,
 * the curriculum and the group. The WhatsApp group is the learners' one once
 * they have paid (when the cohort has one), and the public one before. Until
 * they pay, the page keeps a way to secure their seat at the top.
 */
interface StepSegment {
  kind: 'text' | 'link'
  content: string
  href?: string
}

interface Step {
  key: string
  title: string
  body: string
  tone: 'brand' | 'emerald' | 'orange' | 'violet' | 'slate'
}

const route = useRoute()
const router = useRouter()

const token = computed(() => String(route.params.token ?? ''))
const registration = ref<Registration | null>(null)
const isLoading = ref(true)
const loadError = ref('')
const programs = ref<Program[]>([])
const isLoadingPrograms = ref(true)
const showVideoModal = ref(false)

const androidAppUrl = (import.meta.env.VITE_LINKSKOOL_ANDROID_APP_URL as string | undefined)?.trim() ?? ''
const iosAppUrl = (import.meta.env.VITE_LINKSKOOL_IOS_APP_URL as string | undefined)?.trim() ?? ''
const desktopAppUrl = (import.meta.env.VITE_LINKSKOOL_DESKTOP_APP_URL as string | undefined)?.trim() ?? ''

const isUnpaid = computed(() => registration.value?.status === 'unpaid')
const justPaid = computed(() => route.query.paid === '1')

usePageMeta(() => ({
  robots: 'noindex, nofollow',
  title: registration.value ? `Get started with ${registration.value.course.name} | LinkSkool` : 'Next steps | LinkSkool',
  description: 'Join the group, get the LinkSkool app and download your curriculum.',
  keywords: 'onboarding, next steps, linkskool',
  url: `https://linkskool.com/registration/${token.value}/next-steps`,
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
}))

const formatNaira = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

const normalizeUrl = (rawUrl: string) => {
  const cleaned = rawUrl.trim()
  if (!cleaned) return ''
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`
}

const parseStepSegments = (value: string): StepSegment[] => {
  const text = value.trim()
  if (!text) return []

  const linkRegex = /(https?:\/\/[^\s<>")]+|www\.[^\s<>")]+)/gi
  const segments: StepSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    const [url] = match
    if (match.index > lastIndex) segments.push({ kind: 'text', content: text.slice(lastIndex, match.index) })
    segments.push({ kind: 'link', content: url, href: normalizeUrl(url) })
    lastIndex = match.index + url.length
  }
  if (lastIndex < text.length) segments.push({ kind: 'text', content: text.slice(lastIndex) })

  return segments.length ? segments : [{ kind: 'text', content: text }]
}

const toEmbeddableVideoUrl = (rawUrl: string | null | undefined) => {
  const value = rawUrl?.trim()
  if (!value) return null
  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return parsed.toString()
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    return value
  } catch {
    return null
  }
}

const videoEmbedUrl = computed(() => toEmbeddableVideoUrl(registration.value?.program.videoUrl))
const videoPreviewUrl = computed(() => {
  const match = videoEmbedUrl.value?.match(/\/embed\/([^/?]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
})

const programSteps = computed(() =>
  (registration.value?.program.onboardingSteps ?? []).map((text) => ({ text, segments: parseStepSegments(text) })),
)

/** The timeline, numbered in the order shown; steps without content drop out. */
const steps = computed<Step[]>(() => {
  const r = registration.value
  if (!r) return []
  const list: Step[] = []

  if (r.links.whatsapp) {
    list.push({
      key: 'whatsapp',
      title: r.links.whatsappIsLearnersGroup ? "Join your learners' WhatsApp group" : 'Join the WhatsApp community',
      body: r.links.whatsappIsLearnersGroup
        ? 'Class links, reminders and support from your instructors, only for learners in this cohort.'
        : 'Updates, class reminders and answers from the team while you get ready.',
      tone: 'emerald',
    })
  }
  list.push({
    key: 'app',
    title: 'Download the LinkSkool app',
    body: 'Your lessons, live classes and progress, on Android or desktop. iOS is coming soon.',
    tone: 'brand',
  })
  if (r.links.curriculumUrl) {
    list.push({
      key: 'curriculum',
      title: 'Download your curriculum',
      body: 'Every module and what each class covers, so you know exactly where you are headed.',
      tone: 'orange',
    })
  }
  if (videoEmbedUrl.value) {
    list.push({
      key: 'video',
      title: 'Watch the onboarding video',
      body: 'A quick walkthrough before your first class.',
      tone: 'orange',
    })
  }
  programSteps.value.forEach((_, i) => list.push({ key: `program-${i}`, title: '', body: '', tone: 'slate' }))
  list.push({
    key: 'faqs',
    title: 'Need more guidance?',
    body: 'Check the FAQs for answers to common questions.',
    tone: 'violet',
  })
  return list
})

const toneClass: Record<Step['tone'], string> = {
  brand: 'bg-brand text-white',
  emerald: 'bg-emerald-600 text-white',
  orange: 'bg-orange-500 text-white',
  violet: 'bg-violet-600 text-white',
  slate: 'bg-slate-900 text-white',
}

const featuredPrograms = computed(() => programs.value.slice(0, 6))

/** The curriculum's kind, from its extension: a PDF, Word or PowerPoint file. */
const curriculumFile = computed(() => {
  const ext = (registration.value?.links.curriculumUrl ?? '').split('?')[0]?.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'doc' || ext === 'docx') return { label: 'Word document', icon: 'fa-file-word' }
  if (ext === 'ppt' || ext === 'pptx') return { label: 'PowerPoint', icon: 'fa-file-powerpoint' }
  return { label: 'PDF', icon: 'fa-file-pdf' }
})

const goPay = () => router.push({ name: 'registration', params: { token: token.value }, query: { pay: '1' } })

onMounted(async () => {
  programService
    .getAllPrograms()
    .then((list) => (programs.value = list))
    .catch((error) => console.error('Failed to fetch programs:', error))
    .finally(() => (isLoadingPrograms.value = false))

  try {
    registration.value = await enrollmentService.registration(token.value)
  } catch (error) {
    console.error('Failed to load registration:', error)
    loadError.value =
      error instanceof ApiError && error.status === 404
        ? 'We could not find this registration. Check the link in your email.'
        : 'Your next steps could not be loaded right now. Please refresh.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-white">
    <AppHeader />

    <section class="border-b border-slate-200 bg-slate-50 pb-12 pt-24 lg:pt-28">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="h-40 animate-pulse rounded-2xl bg-slate-200"></div>

        <div v-else-if="loadError || !registration" class="card px-6 py-14 text-center">
          <i class="fa-solid fa-circle-exclamation text-4xl text-slate-300"></i>
          <p class="mt-4 text-slate-600">{{ loadError }}</p>
        </div>

        <template v-else>
          <div class="mx-auto max-w-2xl">
            <RegistrationSteps
              :current="3"
              :payment="registration.status === 'free' ? 'free' : isUnpaid ? 'later' : 'done'"
            />
          </div>

          <div class="mt-10 max-w-3xl">
            <p class="eyebrow">{{ registration.course.name }}</p>
            <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {{
                justPaid
                  ? 'Payment received. You’re in!'
                  : isUnpaid
                    ? 'Here’s what to do next'
                    : 'You’re all set. Let’s get you started'
              }}
            </h1>
            <p class="mt-4 text-lg leading-8 text-slate-600">
              {{
                isUnpaid
                  ? 'Your seat is reserved. Get set up below, and pay whenever you are ready to confirm it.'
                  : 'Your place is confirmed. Work through these steps before your first class.'
              }}
            </p>
          </div>

          <div
            v-if="isUnpaid"
            class="relative mt-8 overflow-hidden rounded-2xl bg-brand-ink px-6 py-6 text-white sm:flex sm:items-center sm:gap-6 sm:px-8"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-light/30 blur-2xl"
            ></div>
            <div class="relative min-w-0 flex-1">
              <p class="flex items-center gap-2 text-sm font-semibold text-orange-300">
                <i class="fa-solid fa-hourglass-half"></i> Your seat is reserved, not yet confirmed
              </p>
              <p class="mt-2 text-lg font-semibold">
                Pay {{ formatNaira(registration.invoice.amount) }} to secure it and join the learners' group.
              </p>
              <p class="mt-1 text-sm text-white/65">
                Seats go to those who pay first. Invoice {{ registration.invoice.number }}.
              </p>
            </div>
            <button type="button" class="btn btn-light relative mt-5 w-full sm:mt-0 sm:w-auto" @click="goPay">
              Pay now <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </template>
      </div>
    </section>

    <section v-if="registration" id="next-steps" class="bg-white py-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Your next steps</h2>
        <p class="mt-2 text-slate-600">Do these in order and you'll be ready for day one.</p>

        <ol class="mt-10">
          <li v-for="(step, index) in steps" :key="step.key" class="relative flex gap-5 pb-10 last:pb-0">
            <span
              v-if="index < steps.length - 1"
              class="absolute left-[1.0625rem] top-10 h-[calc(100%-2.5rem)] w-px bg-slate-200"
              aria-hidden="true"
            ></span>
            <span
              class="relative z-10 flex h-[2.125rem] w-[2.125rem] flex-none items-center justify-center rounded-full text-sm font-bold ring-4 ring-white"
              :class="toneClass[step.tone]"
              >{{ index + 1 }}</span
            >

            <div class="min-w-0 flex-1 pt-1">
              <!-- WhatsApp -->
              <template v-if="step.key === 'whatsapp'">
                <h3 class="text-lg font-semibold text-slate-950">{{ step.title }}</h3>
                <p class="mt-1 text-slate-600">{{ step.body }}</p>
                <a
                  :href="registration.links.whatsapp ?? undefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
                >
                  <i class="fa-brands fa-whatsapp text-base"></i>
                  {{ registration.links.whatsappIsLearnersGroup ? 'Join learners’ group' : 'Join on WhatsApp' }}
                </a>
                <p v-if="isUnpaid" class="mt-3 text-xs text-slate-500">
                  <i class="fa-solid fa-lock mr-1"></i>The learners' group opens once you pay.
                </p>
              </template>

              <!-- App -->
              <template v-else-if="step.key === 'app'">
                <h3 class="text-lg font-semibold text-slate-950">{{ step.title }}</h3>
                <p class="mt-1 text-slate-600">{{ step.body }}</p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <a
                    v-if="androidAppUrl"
                    :href="androidAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <i class="fa-brands fa-google-play"></i> Google Play
                  </a>
                  <a
                    v-if="desktopAppUrl"
                    :href="desktopAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-light hover:text-brand"
                  >
                    <img :src="logoSrc" alt="" class="h-4 w-4 object-contain" /> Desktop app
                  </a>
                  <span
                    class="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400"
                    :title="iosAppUrl ? 'iOS app coming soon' : 'iOS app not available yet'"
                  >
                    <i class="fa-brands fa-apple"></i> iOS · Coming soon
                  </span>
                </div>
              </template>

              <!-- Curriculum -->
              <template v-else-if="step.key === 'curriculum'">
                <h3 class="text-lg font-semibold text-slate-950">{{ step.title }}</h3>
                <p class="mt-1 text-slate-600">{{ step.body }}</p>
                <a
                  :href="registration.links.curriculumUrl ?? undefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  class="mt-4 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-orange-300"
                >
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <i class="fa-solid" :class="curriculumFile.icon"></i>
                  </span>
                  <span class="text-left">
                    <span class="block text-sm font-semibold text-slate-900">{{ registration.course.name }} curriculum</span>
                    <span class="block text-xs text-slate-500">{{ curriculumFile.label }} · Also sent to your email</span>
                  </span>
                  <i class="fa-solid fa-download ml-2 text-slate-400"></i>
                </a>
              </template>

              <!-- Video -->
              <template v-else-if="step.key === 'video'">
                <h3 class="text-lg font-semibold text-slate-950">{{ step.title }}</h3>
                <p class="mt-1 text-slate-600">{{ step.body }}</p>
                <button
                  type="button"
                  class="group relative mt-4 block aspect-video w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  @click="showVideoModal = true"
                >
                  <img v-if="videoPreviewUrl" :src="videoPreviewUrl" alt="" class="h-full w-full object-cover" />
                  <span
                    class="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35"
                  >
                    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-orange-600 shadow-lg">
                      <i class="fa-solid fa-play ml-0.5 text-lg"></i>
                    </span>
                  </span>
                </button>
              </template>

              <!-- The program's own steps -->
              <template v-else-if="step.key.startsWith('program-')">
                <p class="leading-relaxed text-slate-700">
                  <template
                    v-for="(segment, segmentIndex) in programSteps[Number(step.key.slice(8))]?.segments ?? []"
                    :key="`${segment.kind}-${segmentIndex}`"
                  >
                    <a
                      v-if="segment.kind === 'link' && segment.href"
                      :href="segment.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-brand underline decoration-blue-300"
                      >{{ segment.content }}</a
                    >
                    <span v-else>{{ segment.content }}</span>
                  </template>
                </p>
              </template>

              <!-- FAQs -->
              <template v-else>
                <h3 class="text-lg font-semibold text-slate-950">{{ step.title }}</h3>
                <p class="mt-1 text-slate-600">{{ step.body }}</p>
                <RouterLink
                  to="/faqs"
                  class="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                >
                  <i class="fa-solid fa-circle-question"></i> Check FAQs
                </RouterLink>
              </template>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="border-t border-slate-100 bg-white py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="text-3xl font-semibold text-slate-900 md:text-4xl">Keep your learning streak alive</h2>
            <p class="mt-2 max-w-2xl text-slate-600">More programs you can join right away.</p>
          </div>
          <RouterLink
            to="/#programs"
            class="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-brand-light/50 hover:text-brand"
          >
            View all programs <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="isLoadingPrograms" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-96 animate-pulse rounded-2xl bg-slate-200"></div>
        </div>
        <div v-else-if="featuredPrograms.length" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProgramCard v-for="program in featuredPrograms" :key="program.id" :program="program" />
        </div>
      </div>
    </section>

    <div
      v-if="showVideoModal && videoEmbedUrl"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4"
      @click.self="showVideoModal = false"
    >
      <div class="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">
        <button
          type="button"
          class="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 transition-colors hover:bg-white"
          aria-label="Close video"
          @click="showVideoModal = false"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="aspect-video w-full">
          <iframe
            :src="videoEmbedUrl"
            class="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
