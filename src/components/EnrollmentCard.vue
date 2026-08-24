<script setup lang="ts">
import { computed } from 'vue'
import type { CourseDetail } from '@/api/models'

const props = defineProps<{ courseDetail: CourseDetail }>()
const emit = defineEmits<{ enroll: []; reserve: [] }>()

const nairaFormatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 })
const displayPrice = computed(() => {
  if (props.courseDetail.cohort.isFree) return 'Free'
  const price = props.courseDetail.cohort.cost || 0
  const discount = props.courseDetail.cohort.discount || 0
  if (discount > 0) return { current: nairaFormatter.format(price - (price * discount) / 100), original: nairaFormatter.format(price), discount }
  return nairaFormatter.format(price)
})
const isFreeCourse = computed(() => Boolean(props.courseDetail.cohort.isFree))
const learningTypeLabel = computed(() => props.courseDetail.cohort.learningType === 'instructor_led' ? 'Instructor-led' : 'Self-paced')
const enrollmentDeadlineDate = computed(() => {
  const raw = props.courseDetail.cohort.enrollmentDeadline
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
})
const isEnrollmentClosed = computed(() => props.courseDetail.cohort.learningType === 'instructor_led' && enrollmentDeadlineDate.value !== null && enrollmentDeadlineDate.value.getTime() < Date.now())
const formatDate = (value?: string) => {
  if (!value) return 'Not set'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not set' : date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
}
const information = computed(() => [
  { label: 'Starts', value: formatDate(props.courseDetail.cohort.startDate), icon: 'fa-calendar-day' },
  { label: 'Ends', value: formatDate(props.courseDetail.cohort.endDate), icon: 'fa-calendar-check' },
  { label: 'Format', value: learningTypeLabel.value, icon: 'fa-signal' },
  ...(props.courseDetail.cohort.instructorName ? [{ label: 'Instructor', value: props.courseDetail.cohort.instructorName, icon: 'fa-user' }] : []),
])
</script>

<template>
  <div class="card card-raised sticky top-24 overflow-hidden">
    <div class="border-b border-slate-100 p-7">
      <p class="text-sm font-medium text-slate-500">Course fee</p>
      <div v-if="typeof displayPrice === 'string'" class="mt-1.5 break-words text-3xl font-semibold tracking-tight text-slate-950">{{ displayPrice }}</div>
      <div v-else class="mt-1 min-w-0">
        <div class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="break-all text-3xl font-semibold tracking-tight text-slate-950">{{ displayPrice.current }}</span>
          <span class="text-sm text-slate-400 line-through">{{ displayPrice.original }}</span>
        </div>
        <p class="mt-2 text-sm font-medium text-brand">Save {{ displayPrice.discount }}%</p>
      </div>
    </div>

    <div class="p-7">
      <button type="button" @click="emit('enroll')" :disabled="isEnrollmentClosed" class="btn btn-primary btn-block">
        {{ isEnrollmentClosed ? 'Enrollment closed' : isFreeCourse ? 'Enroll for free' : 'Enroll now' }}
        <i v-if="!isEnrollmentClosed" class="fa-solid fa-arrow-right text-sm"></i>
      </button>
      <button v-if="!isFreeCourse && !isEnrollmentClosed" type="button" @click="emit('reserve')" class="btn btn-secondary btn-block mt-3">Reserve a seat</button>
      <p v-if="isEnrollmentClosed" class="mt-3 text-sm leading-6 text-red-600">Enrollment has closed for this cohort.</p>

      <dl class="mt-8 space-y-5 border-t border-slate-100 pt-7">
        <div v-for="item in information" :key="item.label" class="flex min-w-0 items-start gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><i :class="['fa-solid', item.icon, 'text-sm']"></i></div>
          <div class="min-w-0"><dt class="text-xs text-slate-500">{{ item.label }}</dt><dd class="mt-0.5 break-words text-sm font-semibold text-slate-800">{{ item.value }}</dd></div>
        </div>
      </dl>

      <ul class="mt-8 space-y-3 border-t border-slate-100 pt-7 text-sm text-slate-600">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-xs text-brand"></i>Access on mobile and desktop</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-xs text-brand"></i>Certificate of completion</li>
      </ul>
    </div>
  </div>

  <div class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_-18px_rgba(15,23,42,.45)] backdrop-blur lg:hidden">
    <button type="button" @click="emit('enroll')" :disabled="isEnrollmentClosed" class="btn btn-primary mx-auto flex w-full max-w-lg items-center justify-between">
      <span>{{ isEnrollmentClosed ? 'Enrollment closed' : isFreeCourse ? 'Enroll for free' : 'Enroll now' }}</span>
      <span v-if="!isEnrollmentClosed" class="flex items-center gap-3"><strong class="font-semibold">{{ typeof displayPrice === 'object' ? displayPrice.current : displayPrice }}</strong><i class="fa-solid fa-arrow-right text-sm"></i></span>
    </button>
  </div>
</template>
