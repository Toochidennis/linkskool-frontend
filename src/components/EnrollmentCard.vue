<script setup lang="ts">
import { computed } from 'vue'

import type { CourseDetail } from '@/api/models'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{ courseDetail: CourseDetail }>()
const emit = defineEmits<{ enroll: []; reserve: [] }>()

const formatNaira = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

const cohort = computed(() => props.courseDetail.cohort)
const isFreeCourse = computed(() => Boolean(cohort.value.isFree))
const discountPercent = computed(() => (isFreeCourse.value ? 0 : (cohort.value.discount ?? 0)))

const priceCurrent = computed(() => {
  if (isFreeCourse.value) return 'Free'
  const cost = cohort.value.cost ?? 0
  return formatNaira(cost - (cost * discountPercent.value) / 100)
})
const priceOriginal = computed(() =>
  discountPercent.value > 0 ? formatNaira(cohort.value.cost ?? 0) : '',
)

const parseDate = (raw?: string | null) => {
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

const enrollmentDeadline = computed(() => parseDate(cohort.value.enrollmentDeadline))
const countdown = useCountdown(enrollmentDeadline)

/** Under a day left is genuinely urgent — that is the only point we raise our voice. */
const isClosingSoon = computed(
  () => countdown.isRunning.value && (countdown.remaining.value ?? 0) <= 24 * 60 * 60 * 1000,
)

/**
 * Deliberate: only instructor-led cohorts ever close. A self-paced course
 * normally has no deadline at all, but if one is set it must NOT block
 * enrollment — the countdown simply stops rendering and the button stays live.
 * Do not "fix" this by dropping the learningType guard.
 */
const isEnrollmentClosed = computed(
  () =>
    cohort.value.learningType === 'instructor_led' &&
    enrollmentDeadline.value !== null &&
    countdown.hasExpired.value,
)

const ctaLabel = computed(() => {
  if (isEnrollmentClosed.value) return 'Enrollment closed'
  return isFreeCourse.value ? 'Enroll for free' : 'Enroll now'
})

const formatDate = (value?: string | null, fallback = 'Not set') => {
  const date = parseDate(value)
  return date
    ? date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
    : fallback
}

const deadlineLabel = computed(() => formatDate(cohort.value.enrollmentDeadline, ''))

const learningTypeLabel = computed(() =>
  cohort.value.learningType === 'instructor_led' ? 'Instructor-led' : 'Self-paced',
)

const information = computed(() => [
  { label: 'Starts', value: formatDate(cohort.value.startDate), icon: 'fa-calendar-day' },
  { label: 'Ends', value: formatDate(cohort.value.endDate), icon: 'fa-calendar-check' },
  { label: 'Format', value: learningTypeLabel.value, icon: 'fa-signal' },
  ...(cohort.value.instructorName
    ? [{ label: 'Instructor', value: cohort.value.instructorName, icon: 'fa-user' }]
    : []),
])
</script>

<template>
  <div class="card card-raised sticky top-24 overflow-hidden">
    <!-- fee -->
    <div class="p-7" :class="countdown.isRunning.value ? 'pb-6' : 'border-b border-slate-100'">
      <p class="text-sm font-medium text-slate-500">Course fee</p>
      <div class="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span class="break-all text-3xl font-semibold tracking-tight text-slate-950">{{ priceCurrent }}</span>
        <span v-if="priceOriginal" class="text-sm text-slate-400 line-through">{{ priceOriginal }}</span>
      </div>
      <p v-if="discountPercent > 0" class="mt-2 text-sm font-medium text-brand">
        Save {{ discountPercent }}%
      </p>
    </div>

    <!-- enrollment deadline: quiet, hairline-separated numerals -->
    <div v-if="countdown.isRunning.value" class="border-y border-slate-100 px-7 py-6">
      <div class="flex items-baseline justify-between gap-3">
        <p
          class="flex items-center gap-2 text-xs font-medium"
          :class="isClosingSoon ? 'text-orange' : 'text-slate-500'"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :class="isClosingSoon ? 'bg-orange' : 'bg-brand'"
          ></span>
          Enrollment closes in
        </p>
        <p v-if="deadlineLabel" class="text-xs text-slate-400">{{ deadlineLabel }}</p>
      </div>
      <dl class="mt-4 flex">
        <div
          v-for="segment in countdown.displaySegments.value"
          :key="segment.label"
          class="min-w-0 flex-1 border-l border-slate-100 pl-3 first:border-l-0 first:pl-0"
        >
          <dd class="text-2xl font-semibold tabular-nums tracking-tight text-slate-950">
            {{ countdown.pad(segment.value) }}
          </dd>
          <dt class="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">{{ segment.label }}</dt>
        </div>
      </dl>
      <p v-if="isClosingSoon" class="mt-4 text-xs leading-5 text-slate-500">
        Last day to join this cohort.
      </p>
    </div>

    <div class="p-7">
      <button
        type="button"
        class="btn btn-primary btn-block"
        :disabled="isEnrollmentClosed"
        @click="emit('enroll')"
      >
        {{ ctaLabel }}
        <i v-if="!isEnrollmentClosed" class="fa-solid fa-arrow-right text-xs"></i>
      </button>
      <button
        v-if="!isFreeCourse && !isEnrollmentClosed"
        type="button"
        class="btn btn-secondary btn-block mt-3"
        @click="emit('reserve')"
      >
        Reserve a seat
      </button>
      <p v-if="isEnrollmentClosed" class="mt-3 text-sm leading-6 text-slate-500">
        Enrollment has closed for this cohort.
      </p>

      <dl class="mt-8 space-y-5 border-t border-slate-100 pt-7">
        <div v-for="item in information" :key="item.label" class="flex min-w-0 items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <i :class="['fa-solid', item.icon, 'text-sm']"></i>
          </div>
          <div class="min-w-0">
            <dt class="text-xs text-slate-500">{{ item.label }}</dt>
            <dd class="mt-0.5 break-words text-sm font-semibold text-slate-800">{{ item.value }}</dd>
          </div>
        </div>
      </dl>

      <ul class="mt-8 space-y-3 border-t border-slate-100 pt-7 text-sm text-slate-600">
        <li class="flex items-center gap-2">
          <i class="fa-solid fa-check text-xs text-brand"></i>Access on mobile and desktop
        </li>
        <li class="flex items-center gap-2">
          <i class="fa-solid fa-check text-xs text-brand"></i>Certificate of completion
        </li>
      </ul>
    </div>
  </div>

  <!-- mobile action bar -->
  <div
    class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_-18px_rgba(15,23,42,.45)] backdrop-blur lg:hidden"
  >
    <button
      type="button"
      :disabled="isEnrollmentClosed"
      class="mx-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-[18px] bg-brand px-5 py-3 text-left text-white shadow-[0_10px_30px_-14px_rgba(27,58,158,0.9)] transition hover:bg-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
      @click="emit('enroll')"
    >
      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="flex items-center gap-2">
          <span class="text-[15px] font-semibold">{{ ctaLabel }}</span>
          <span
            v-if="discountPercent > 0 && !isEnrollmentClosed"
            class="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold"
          >
            {{ discountPercent }}% off
          </span>
        </span>
        <span
          v-if="countdown.isRunning.value && !isEnrollmentClosed"
          class="flex items-center gap-1.5 text-[11px] font-medium tabular-nums"
          :class="isClosingSoon ? 'text-white/90' : 'text-white/65'"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :class="isClosingSoon ? 'bg-orange' : 'bg-white/40'"
          ></span>
          <span class="truncate">Closes in {{ countdown.compact.value }}</span>
        </span>
      </span>

      <span v-if="!isEnrollmentClosed" class="flex shrink-0 items-center gap-2.5">
        <span class="flex flex-col items-end">
          <span class="text-[15px] font-semibold leading-tight">{{ priceCurrent }}</span>
          <span v-if="priceOriginal" class="text-[11px] leading-tight text-white/50 line-through">
            {{ priceOriginal }}
          </span>
        </span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </span>
    </button>
  </div>
</template>
