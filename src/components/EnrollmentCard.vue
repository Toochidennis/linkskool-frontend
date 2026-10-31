<script setup lang="ts">
import { computed } from 'vue'

import type { CourseDetail } from '@/api/models'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{ courseDetail: CourseDetail }>()
const emit = defineEmits<{ register: [] }>()

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
  return isFreeCourse.value ? 'Register for free' : 'Register now'
})

const formatDate = (value?: string | null, fallback = 'Not set') => {
  const date = parseDate(value)
  return date
    ? date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
    : fallback
}

const deadlineLabel = computed(() => formatDate(cohort.value.enrollmentDeadline, ''))

/** Register now in three steps; a free course has nothing to pay. */
const howItWorks = computed(() =>
  isFreeCourse.value
    ? ['Register', 'Get set up', 'Start learning']
    : ['Register', 'Pay now or later', 'Start learning'],
)

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
    <div class="p-7" :class="countdown.isRunning.value ? 'pb-5' : 'border-b border-slate-100'">
      <p class="text-sm font-medium text-slate-500">Course fee</p>
      <div class="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span class="break-all text-3xl font-semibold tracking-tight text-slate-950">{{ priceCurrent }}</span>
        <span v-if="priceOriginal" class="text-sm text-slate-400 line-through">{{ priceOriginal }}</span>
      </div>
      <p v-if="discountPercent > 0" class="mt-2 text-sm font-medium text-brand">
        Save {{ discountPercent }}%
      </p>
    </div>

    <!-- enrollment deadline -->
    <div v-if="countdown.isRunning.value" class="px-7 pb-2">
      <div class="countdown-panel rounded-2xl px-5 py-5 text-white">
        <div class="flex items-center justify-between gap-3">
          <p class="flex items-center gap-2 text-xs font-medium text-white/70">
            <span class="relative flex h-2 w-2 shrink-0">
              <span
                v-if="isClosingSoon"
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60"
              ></span>
              <span
                class="relative inline-flex h-2 w-2 rounded-full"
                :class="isClosingSoon ? 'bg-orange' : 'bg-emerald-400'"
              ></span>
            </span>
            {{ isClosingSoon ? 'Last day to join' : 'Enrollment closes in' }}
          </p>
          <p v-if="deadlineLabel" class="text-xs text-white/45">{{ deadlineLabel }}</p>
        </div>
        <dl class="mt-4 flex items-start justify-between">
          <template v-for="(segment, i) in countdown.displaySegments.value" :key="segment.label">
            <span
              v-if="i > 0"
              class="pt-0.5 text-2xl font-light leading-none text-white/25"
              aria-hidden="true"
              >:</span
            >
            <div class="flex min-w-[3rem] flex-col items-center">
              <dd class="text-[1.75rem] font-semibold leading-none tabular-nums tracking-tight">
                {{ countdown.pad(segment.value) }}
              </dd>
              <dt class="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                {{ segment.label }}
              </dt>
            </div>
          </template>
        </dl>
      </div>
    </div>

    <div class="p-7">
      <button
        type="button"
        class="btn btn-primary btn-block"
        :disabled="isEnrollmentClosed"
        @click="emit('register')"
      >
        {{ ctaLabel }}
        <i v-if="!isEnrollmentClosed" class="fa-solid fa-arrow-right text-xs"></i>
      </button>
      <p v-if="isEnrollmentClosed" class="mt-3 text-sm leading-6 text-slate-500">
        Enrollment has closed for this cohort.
      </p>

      <ol v-else class="mt-6 flex items-start" aria-label="How registering works">
        <li
          v-for="(step, i) in howItWorks"
          :key="step"
          class="relative flex flex-1 flex-col items-center text-center"
        >
          <span
            v-if="i > 0"
            class="absolute right-1/2 top-3 h-px w-full bg-slate-200"
            aria-hidden="true"
          ></span>
          <span
            class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand ring-4 ring-white"
            >{{ i + 1 }}</span
          >
          <span class="mt-1.5 text-[11px] leading-4 text-slate-500">{{ step }}</span>
        </li>
      </ol>

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
      @click="emit('register')"
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

<style scoped>
.countdown-panel {
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(79, 118, 216, 0.35) 0%, transparent 55%),
    linear-gradient(160deg, #14286e 0%, #0b1637 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
</style>
