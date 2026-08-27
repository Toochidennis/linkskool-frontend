<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import type { Course, PaymentPayload, Program, ReservePayload, TrialType } from '@/api/models'
import { enrollmentService, programService } from '@/api/services'
import { resolveAssetUrl } from '@/api/util/assetUrl'
import { usePageMeta } from '@/composables/usePageMeta'
import {
  clearPendingPayment,
  readPendingPayment,
  savePendingPayment,
  type PendingPayment,
} from '@/utils/pendingPayment'

type CourseSelectionModel = Course & {
  hasActiveCohort: boolean;
  cohortId: number | null;
  isFree: boolean;
  trialType: TrialType;
  trialValue: number | null;
  discount: number | null;
  cost: number;
  learningType: 'instructor_led' | 'self_paced';
  enrollmentDeadline: string | null;
}

const route = useRoute()
const router = useRouter()

const program = ref<Program | null>(null)
const courses = ref<Course[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const isRedirectingToCheckout = ref(false)
const showBillingModal = ref(false)
const showReservationSuccessModal = ref(false)
const enrollmentAction = ref<'pay' | 'reserve'>('pay')
const loadError = ref('')
const submitError = ref('')
const successMessage = ref('')
const lastPaymentReference = ref('')
const lastPaymentUrl = ref('')
const pendingPayment = ref<PendingPayment | null>(readPendingPayment())
const isCheckingPendingPayment = ref(false)
const currentTime = ref(Date.now())
const configuredPaymentCallbackUrl = (import.meta.env.VITE_PAYMENT_CALLBACK_URL as string | undefined)?.trim() ?? ''
const PAYMENT_CALLBACK_URL = configuredPaymentCallbackUrl || `${window.location.origin}/payment/completion`

const buildPaymentCallbackUrl = (programSlug?: string | null, whatsappGroupLink?: string | null) => {
  const raw = PAYMENT_CALLBACK_URL.trim()
  if (!raw) return `${window.location.origin}/payment/completion`

  const whatsapp = whatsappGroupLink?.trim() ?? ''

  try {
    const callbackUrl = new URL(raw)
    if (programSlug) {
      callbackUrl.searchParams.set('program', programSlug)
    }
    if (whatsapp) {
      callbackUrl.searchParams.set('whatsapp', whatsapp)
    }
    return callbackUrl.toString()
  } catch {
    const queryParts: string[] = []
    if (programSlug) {
      queryParts.push(`program=${encodeURIComponent(programSlug)}`)
    }
    if (whatsapp) {
      queryParts.push(`whatsapp=${encodeURIComponent(whatsapp)}`)
    }

    if (queryParts.length === 0) {
      return raw
    }

    const separator = raw.includes('?') ? '&' : '?'
    return `${raw}${separator}${queryParts.join('&')}`
  }
}

const selectedCourseIds = ref<number[]>([])

const customerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
})

const formErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
})

const programRef = computed(() => {
  const value = route.params.s
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
})

// Dynamic meta tags based on enrollment data
usePageMeta(() => ({
  title: program.value
    ? `Enroll in ${program.value.name} | LinkSkool`
    : 'Program Enrollment | LinkSkool',
  description: program.value
    ? `Enroll in ${program.value.name}. ${program.value.description}`
    : 'Choose your courses and enrol in this LinkSkool program.',
  keywords: `${program.value?.name || 'program'} enrollment, online course enrollment, skill development, professional training`,
  url: `https://linkskool.com/programs/${programRef.value}/enroll`,
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
}))

const normalizedCourses = computed<CourseSelectionModel[]>(() =>
  courses.value.map((course) => ({
    ...course,
    hasActiveCohort: Boolean(course.cohort?.cohortId),
    cohortId: course.cohort?.cohortId ?? null,
    isFree: course.cohort?.isFree ?? false,
    trialType: course.cohort?.trialType ?? null,
    trialValue: course.cohort?.trialValue ?? null,
    discount: course.cohort?.discount ?? null,
    cost: course.cohort?.cost ?? 0,
    learningType: course.cohort?.learningType ?? 'instructor_led',
    enrollmentDeadline: course.cohort?.enrollmentDeadline ?? null,
  })),
)

const selectedCourses = computed(() =>
  normalizedCourses.value.filter((course) => selectedCourseIds.value.includes(course.courseId)),
)

const selectedEnrollmentItems = computed(() =>
  selectedCourses.value
    .filter((course) => Boolean(course.cohortId))
    .map((course) => ({
      courseId: course.courseId,
      cohortId: course.cohortId as number,
    })),
)

const resolveWhatsappGroupLink = (...candidates: Array<string | null | undefined>) =>
  candidates
    .map((value) => value?.trim() ?? '')
    .find(Boolean) ?? ''

const selectedCourseWhatsappGroupLink = computed(() =>
  selectedCourses.value
    .map((course) => course.cohort?.whatsappGroupLink)
    .find((value) => Boolean(value?.trim()))?.trim() ?? '',
)

const effectiveWhatsappGroupLink = computed(() =>
  resolveWhatsappGroupLink(
    program.value?.whatsappGroupLink,
    selectedCourseWhatsappGroupLink.value,
  ),
)

const hasWhatsappGroupUrl = computed(() => Boolean(effectiveWhatsappGroupLink.value))

const whatsappJoinLink = computed(() => {
  return effectiveWhatsappGroupLink.value
})

const subtotal = computed(() =>
  selectedCourses.value.reduce((sum, course) => {
    if (course.isFree) {
      return sum
    }
    return sum + course.cost
  }, 0),
)

const discountAmount = computed(() =>
  selectedCourses.value.reduce((sum, course) => {
    if (course.isFree || !course.discount || course.discount <= 0) {
      return sum
    }
    return sum + (course.cost * course.discount) / 100
  }, 0),
)

const total = computed(() => Math.max(0, subtotal.value - discountAmount.value))

const selectedPaidCount = computed(() =>
  selectedCourses.value.filter((course) => !course.isFree && course.cost > 0).length,
)

const selectedFreeCount = computed(() => selectedCourses.value.length - selectedPaidCount.value)
const hasPendingPayment = computed(() => Boolean(pendingPayment.value?.reference && pendingPayment.value?.paymentUrl))

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
})

const formatPrice = (value: number) => nairaFormatter.format(value)

const courseImage = (imageUrl: string | null | undefined) => resolveAssetUrl(imageUrl)

const parseDate = (value: string | null | undefined) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatLongDate = (value: Date | null) => {
  if (!value) return 'Not set'
  return value.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const programStartDate = computed(() => parseDate(program.value?.startDate))

const programCountdown = computed(() => {
  const startDate = programStartDate.value
  if (!startDate) return null

  const diff = startDate.getTime() - currentTime.value
  if (diff <= 0) {
    return { isStarted: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const totalSeconds = Math.floor(diff / 1000)
  return {
    isStarted: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
})

const countdownSegments = computed(() => {
  const countdown = programCountdown.value
  if (!countdown || countdown.isStarted) return []

  return [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ]
})

const courseFinalPrice = (course: CourseSelectionModel) => {
  if (course.isFree) {
    return 0
  }
  if (!course.discount || course.discount <= 0) {
    return course.cost
  }
  return Math.max(0, course.cost - (course.cost * course.discount) / 100)
}

const displayTrial = (course: CourseSelectionModel) => {
  if (!course.trialType || !course.trialValue) {
    return ''
  }
  if (course.trialType === 'days') {
    return `${course.trialValue} days trial`
  }
  return `${course.trialValue} views trial`
}

const learningTypeLabel = (course: CourseSelectionModel) =>
  course.learningType === 'instructor_led' ? 'Instructor-led' : 'Self-paced'

const parseEnrollmentDeadline = (course: CourseSelectionModel) => parseDate(course.enrollmentDeadline)

const formatDeadlineDateTime = (course: CourseSelectionModel) => {
  const deadline = parseEnrollmentDeadline(course)
  if (!deadline) return 'Not set'
  return deadline.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const isEnrollmentExpired = (course: CourseSelectionModel) => {
  if (course.learningType !== 'instructor_led') return false
  const deadline = parseEnrollmentDeadline(course)
  if (!deadline) return false
  return deadline.getTime() < Date.now()
}

const selectionBlockReason = (course: CourseSelectionModel) => {
  if (!course.cohortId) {
    return 'No active enrollment available for this course.'
  }
  if (isEnrollmentExpired(course)) {
    return 'Enrollment deadline has passed for this instructor-led course.'
  }
  return ''
}

const canSelectCourse = (course: CourseSelectionModel) => !selectionBlockReason(course)

const isSelected = (courseId: number) => selectedCourseIds.value.includes(courseId)

const toggleCourseSelection = (courseId: number) => {
  const course = normalizedCourses.value.find((item) => item.courseId === courseId)
  if (!course || !canSelectCourse(course)) {
    submitError.value = course ? selectionBlockReason(course) : 'This course cannot be selected.'
    return
  }

  if (isSelected(courseId)) {
    selectedCourseIds.value = selectedCourseIds.value.filter((id) => id !== courseId)
    return
  }
  selectedCourseIds.value = [...selectedCourseIds.value, courseId]
}

const selectAllCourses = () => {
  selectedCourseIds.value = normalizedCourses.value
    .filter((course) => canSelectCourse(course))
    .map((course) => course.courseId)
}

const clearSelection = () => {
  selectedCourseIds.value = []
}

const syncPendingPaymentState = (value: PendingPayment | null) => {
  pendingPayment.value = value
  lastPaymentReference.value = value?.reference ?? ''
  lastPaymentUrl.value = value?.paymentUrl ?? ''
}

const setPendingPaymentState = (value: PendingPayment) => {
  savePendingPayment(value)
  syncPendingPaymentState(value)
}

const clearPendingPaymentState = () => {
  clearPendingPayment()
  syncPendingPaymentState(null)
}

const resumePendingPayment = () => {
  if (!pendingPayment.value?.paymentUrl) return
  window.location.assign(pendingPayment.value.paymentUrl)
}

const discardPendingPayment = () => {
  clearPendingPaymentState()
  submitError.value = ''
  successMessage.value = 'Previous checkout cleared. You can start a new payment now.'
}

const checkPendingPaymentStatus = async () => {
  const reference = pendingPayment.value?.reference
  if (!reference) return

  isCheckingPendingPayment.value = true

  try {
    const isPaid = await enrollmentService.paymentStatus(reference)
    clearPendingPaymentState()
    submitError.value = ''
    successMessage.value = isPaid
      ? 'Your previous payment has been confirmed.'
      : 'Previous checkout is no longer active. You can start a new payment.'
  } catch (error) {
    console.error('Failed to verify pending payment status:', error)
  } finally {
    isCheckingPendingPayment.value = false
  }
}

const handleWindowFocus = () => {
  if (hasPendingPayment.value && !isCheckingPendingPayment.value) {
    checkPendingPaymentStatus()
  }
}

const handleDocumentVisibility = () => {
  if (document.visibilityState === 'visible') {
    handleWindowFocus()
  }
}

const openEnrollmentModal = (mode: 'pay' | 'reserve') => {
  submitError.value = ''
  successMessage.value = ''

  if (hasPendingPayment.value) {
    submitError.value = 'You already have a checkout in progress. Resume or clear it before starting another one.'
    return
  }

  if (selectedCourses.value.length === 0) {
    submitError.value = 'Select at least one course to continue.'
    return
  }

  enrollmentAction.value = mode
  showBillingModal.value = true
}

const closeBillingModal = () => {
  showBillingModal.value = false
}

const closeReservationSuccessModal = () => {
  showReservationSuccessModal.value = false
}

const validateForm = () => {
  let valid = true

  formErrors.firstName = ''
  formErrors.lastName = ''
  formErrors.email = ''
  formErrors.phoneNumber = ''

  if (!customerForm.firstName.trim()) {
    formErrors.firstName = 'First name is required'
    valid = false
  }

  if (!customerForm.lastName.trim()) {
    formErrors.lastName = 'Last name is required'
    valid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!customerForm.email.trim()) {
    formErrors.email = 'Email is required'
    valid = false
  } else if (!emailRegex.test(customerForm.email)) {
    formErrors.email = 'Enter a valid email address'
    valid = false
  }

  const phoneRegex = /^[\d\s\-+()]+$/
  if (!customerForm.phoneNumber.trim()) {
    formErrors.phoneNumber = 'Phone number is required'
    valid = false
  } else if (!phoneRegex.test(customerForm.phoneNumber) || customerForm.phoneNumber.replace(/\D/g, '').length < 10) {
    formErrors.phoneNumber = 'Enter a valid phone number'
    valid = false
  }

  return valid
}

const submitEnrollment = async () => {
  submitError.value = ''
  successMessage.value = ''
  isRedirectingToCheckout.value = false
  if (!hasPendingPayment.value) {
    lastPaymentReference.value = ''
    lastPaymentUrl.value = ''
  }

  if (selectedCourses.value.length === 0) {
    submitError.value = 'Select at least one course to continue.'
    return
  }

  if (!validateForm()) {
    submitError.value = 'Please fix the highlighted form fields.'
    return
  }

  if (selectedEnrollmentItems.value.length === 0) {
    submitError.value = 'None of the selected courses has an active enrollment cohort.'
    return
  }

  if (!program.value?.id) {
    submitError.value = 'Program details are not ready yet. Please refresh and try again.'
    return
  }

  isSubmitting.value = true

  try {
    const basePayload = {
      firstName: customerForm.firstName.trim(),
      lastName: customerForm.lastName.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phoneNumber.trim(),
      programId: program.value.id,
      items: selectedEnrollmentItems.value,
    }

    if (enrollmentAction.value === 'pay') {
      const payload: PaymentPayload = {
        ...basePayload,
        callbackUrl: buildPaymentCallbackUrl(program.value?.slug, effectiveWhatsappGroupLink.value),
      }

      const paymentResponse = await enrollmentService.makePayment(payload)
      const paymentStatus = paymentResponse.status
      const paymentMessage = typeof paymentResponse.message === 'string'
        ? paymentResponse.message.trim()
        : ''

      if (paymentStatus === 'blocked') {
        clearPendingPaymentState()
        isRedirectingToCheckout.value = false
        submitError.value = paymentMessage || 'Payment is currently blocked. Please contact support.'
        return
      }

      const paymentUrl = typeof paymentResponse.paymentUrl === 'string'
        ? paymentResponse.paymentUrl.trim()
        : ''

      if (!paymentUrl) {
        submitError.value = paymentMessage || 'Payment link was not returned. Please try again.'
        return
      }

      const pendingCheckout = {
        reference: paymentResponse.reference || '',
        paymentUrl,
        createdAt: Date.now(),
      }

      setPendingPaymentState(pendingCheckout)
      isRedirectingToCheckout.value = true
      showBillingModal.value = false
      successMessage.value = 'Payment initialized. Redirecting to secure checkout...'
      window.setTimeout(() => {
        window.location.assign(paymentUrl)
      }, 150)
      return
    }

    const payload: ReservePayload = basePayload
    const isReserved = await enrollmentService.reserve(payload)

    if (!isReserved) {
      submitError.value = 'Reservation was not completed. Please try again.'
      return
    }

    showBillingModal.value = false
    successMessage.value = 'Your seat reservation is complete.'
    await router.push({
      name: 'reservation-completion',
      query: {
        program: program.value?.slug ?? '',
        whatsapp: effectiveWhatsappGroupLink.value,
      },
    })
  } catch (error) {
    console.error('Failed to submit enrollment request:', error)
    isRedirectingToCheckout.value = false
    submitError.value = enrollmentAction.value === 'reserve'
      ? 'Reservation could not be completed right now. Please try again.'
      : 'Payment could not be completed right now. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const fetchProgramCourses = async () => {
  isLoading.value = true
  loadError.value = ''
  program.value = null
  courses.value = []
  selectedCourseIds.value = []

  if (!programRef.value) {
    loadError.value = 'Program reference is missing in the URL.'
    isLoading.value = false
    return
  }

  try {
    const response = await programService.getProgramCourses(programRef.value)
    program.value = response.program
    courses.value = response.courses
    selectedCourseIds.value = normalizedCourses.value
      .filter((course) => canSelectCourse(course))
      .slice(0, 1)
      .map((course) => course.courseId)
  } catch (error) {
    console.error('Failed to fetch program courses for enrollment:', error)
    loadError.value = 'Unable to load enrollment page right now.'
  } finally {
    isLoading.value = false
    if (hasPendingPayment.value && !isCheckingPendingPayment.value) {
      checkPendingPaymentStatus()
    }
  }
}

let countdownInterval: number | null = null

onMounted(() => {
  syncPendingPaymentState(readPendingPayment())
  countdownInterval = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
  window.addEventListener('focus', handleWindowFocus)
  document.addEventListener('visibilitychange', handleDocumentVisibility)
  fetchProgramCourses()
  checkPendingPaymentStatus()
})

onBeforeUnmount(() => {
  if (countdownInterval !== null) {
    window.clearInterval(countdownInterval)
  }
  window.removeEventListener('focus', handleWindowFocus)
  document.removeEventListener('visibilitychange', handleDocumentVisibility)
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-slate-50">
    <AppHeader />

    <section class="border-b border-slate-200 bg-white pb-10 pt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-11 bg-white/20 rounded-lg w-2/3 mb-4"></div>
          <div class="h-5 bg-white/20 rounded-lg w-1/2"></div>
        </div>

        <div v-else-if="program" class="max-w-4xl">
          <nav class="mb-5 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-500">
            <RouterLink to="/" class="hover:text-brand">Home</RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <RouterLink :to="`/programs/${program.slug}`" class="min-w-0 truncate hover:text-brand">{{ program.name }}
            </RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <span class="text-slate-700">Enrollment</span>
          </nav>

          <h1 class="mb-4 break-words text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Enroll in {{ program.name }}</h1>
          <p class="max-w-3xl text-lg leading-8 text-slate-600">
            Select one or more courses from this program and complete a single checkout flow.
          </p>

          <div v-if="programStartDate" class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Program starts</p>
                <p class="mt-1 text-xl font-semibold text-slate-950">{{ formatLongDate(programStartDate) }}</p>
                <p class="mt-1 text-sm text-slate-600">
                  {{ programCountdown?.isStarted ? 'This program has started.' : 'Countdown to your next cohort.' }}
                </p>
              </div>

              <div v-if="!programCountdown?.isStarted" class="grid w-full grid-cols-4 gap-1.5 sm:w-auto sm:gap-3">
                <div v-for="segment in countdownSegments" :key="segment.label"
                  class="min-w-0 rounded-xl border border-slate-200 bg-white px-1 py-2 text-center sm:px-3">
                  <p class="text-xl font-semibold text-slate-950 sm:text-2xl">{{ String(segment.value).padStart(2, '0') }}</p>
                  <p class="truncate text-[9px] uppercase tracking-wider text-slate-500 sm:text-[11px]">{{ segment.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <h1 class="text-3xl font-semibold text-slate-950">Enrollment unavailable</h1>
          <p class="mt-2 text-slate-600">{{ loadError || 'Please try again later.' }}</p>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loadError && !isLoading"
          class="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {{ loadError }}
        </div>

        <div class="grid min-w-0 gap-8 lg:grid-cols-3">
          <div class="min-w-0 space-y-8 lg:col-span-2">
            <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">Choose Courses</h2>
                  <p class="text-slate-600 mt-1">Select all courses you want to include in this purchase.</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button"
                    class="px-4 py-2 rounded-lg border border-brand-light/40 text-brand font-medium hover:bg-brand-soft transition-colors cursor-pointer"
                    @click="selectAllCourses">
                    Select all
                  </button>
                  <button type="button"
                    class="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                    @click="clearSelection">
                    Clear
                  </button>
                </div>
              </div>

              <div v-if="isLoading" class="space-y-4">
                <div v-for="index in 4" :key="index" class="h-28 rounded-xl bg-slate-100 animate-pulse"></div>
              </div>

              <div v-else class="space-y-4">
                <div v-for="course in normalizedCourses" :key="course.courseId"
                  class="rounded-xl border p-4 transition-all duration-200"
                  :class="isSelected(course.courseId) ? 'border-brand-light bg-brand-soft/50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-light/40'">
                  <label class="flex items-start gap-4"
                    :class="canSelectCourse(course) ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'">
                    <input type="checkbox"
                      class="mt-1 h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand-light"
                      :checked="isSelected(course.courseId)" :disabled="!canSelectCourse(course)"
                      @change="toggleCourseSelection(course.courseId)" />

                    <div class="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img v-if="courseImage(course.imageUrl)" :src="courseImage(course.imageUrl) as string"
                        loading="lazy" :alt="course.courseName" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-brand-light">
                        <i class="fa-solid fa-book"></i>
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 class="text-lg font-semibold text-slate-900 leading-snug">{{ course.courseName }}</h3>
                          <p class="text-sm text-slate-600 mt-1 line-clamp-2">{{ course.description }}</p>
                        </div>

                        <div class="text-right">
                          <div v-if="course.isFree" class="text-lg font-bold text-green-600">Free</div>
                          <div v-else class="space-y-0.5">
                            <div class="text-lg font-bold text-slate-900">{{ formatPrice(courseFinalPrice(course)) }}
                            </div>
                            <div v-if="course.discount" class="text-xs text-slate-400 line-through">{{
                              formatPrice(course.cost) }}</div>
                          </div>
                        </div>
                      </div>

                      <div class="mt-3 flex flex-wrap gap-2">
                        <span
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                          {{ learningTypeLabel(course) }}
                        </span>
                        <span v-if="course.discount"
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {{ course.discount }}% OFF
                        </span>
                        <span v-if="displayTrial(course)"
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          {{ displayTrial(course) }}
                        </span>
                        <span v-if="!course.cohortId"
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          No active cohort
                        </span>
                        <span v-if="course.enrollmentDeadline"
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Deadline: {{ formatDeadlineDateTime(course) }}
                        </span>
                      </div>
                      <p v-if="selectionBlockReason(course)" class="mt-2 text-xs font-medium text-red-600">
                        {{ selectionBlockReason(course) }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>

          <aside class="lg:col-span-1">
            <div class="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-5">
              <h2 class="text-2xl font-bold text-slate-900">Order Summary</h2>

              <div class="space-y-3 max-h-56 overflow-auto pr-1">
                <div v-for="course in selectedCourses" :key="course.courseId"
                  class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate">{{ course.courseName }}</p>
                    <p class="text-xs text-slate-500">{{ course.isFree ? 'Free' : 'Paid course' }}</p>
                  </div>
                  <p class="text-sm font-semibold text-slate-900">{{ course.isFree ? 'Free' :
                    formatPrice(courseFinalPrice(course)) }}</p>
                </div>
              </div>

              <div class="space-y-2 pt-1 text-sm">
                <div v-if="programStartDate" class="rounded-xl border border-brand-soft bg-brand-soft px-4 py-3">
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand">
                      <i class="fa-solid fa-calendar-day"></i>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Program Start Date</p>
                      <p class="mt-1 text-sm font-semibold text-slate-900">{{ formatLongDate(programStartDate) }}</p>
                      <p class="mt-1 text-xs text-slate-600">
                        {{ programCountdown?.isStarted
                          ? 'Program is already in progress.'
                          : `${countdownSegments[0]?.value ?? 0}d ${String(countdownSegments[1]?.value ?? 0).padStart(2,
                            '0')}h ${String(countdownSegments[2]?.value ?? 0).padStart(2, '0')}m
                        ${String(countdownSegments[3]?.value ?? 0).padStart(2, '0')}s left` }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-slate-600">
                  <span>Selected Courses</span>
                  <span>{{ selectedCourses.length }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-600">
                  <span>Paid Courses</span>
                  <span>{{ selectedPaidCount }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-600">
                  <span>Free Courses</span>
                  <span>{{ selectedFreeCount }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex items-center justify-between text-green-700">
                  <span>Discounts</span>
                  <span>- {{ formatPrice(discountAmount) }}</span>
                </div>
                <div class="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between">
                  <span class="text-base font-semibold text-slate-900">Total</span>
                  <span class="text-xl font-bold text-brand">{{ formatPrice(total) }}</span>
                </div>
              </div>

              <div v-if="submitError" class="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {{ submitError }}
              </div>

              <div v-if="successMessage"
                class="rounded-xl border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm">
                {{ successMessage }}
              </div>

              <div v-if="hasPendingPayment"
                class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                <p class="font-semibold">Checkout in progress</p>
                <p class="mt-1 text-amber-800">
                  Finish the existing payment before starting another checkout for this enrollment.
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-3">
                  <button type="button"
                    class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500 cursor-pointer"
                    @click="resumePendingPayment">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>Resume Payment</span>
                  </button>
                  <button type="button"
                    class="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 cursor-pointer"
                    @click="discardPendingPayment">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>Start New Checkout</span>
                  </button>
                  <span v-if="lastPaymentReference" class="text-xs text-amber-800">Ref: {{ lastPaymentReference
                    }}</span>
                </div>
              </div>

              <div v-if="lastPaymentUrl && !hasPendingPayment"
                class="rounded-xl border border-brand-light/40 bg-brand-soft px-3 py-3 text-sm text-brand-ink">
                <p class="font-semibold">Checkout link ready</p>
                <p class="mt-1 text-brand">If you were interrupted, continue with the button below.</p>
                <div class="mt-2 flex flex-wrap items-center gap-3">
                  <button type="button"
                    class="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-light cursor-pointer"
                    @click="resumePendingPayment">
                    <i class="fa-solid fa-up-right-from-square"></i>
                    <span>Resume Payment</span>
                  </button>
                  <span v-if="lastPaymentReference" class="min-w-0 break-all text-xs text-brand">Ref: {{ lastPaymentReference }}</span>
                </div>
              </div>

              <button type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-semibold text-white transition hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSubmitting || isCheckingPendingPayment || hasPendingPayment"
                @click="openEnrollmentModal('pay')">
                <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-lock"></i>
                <span>{{ isSubmitting && enrollmentAction === 'pay' ? 'Processing...' : 'Pay Now' }}</span>
              </button>

              <button type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSubmitting || isCheckingPendingPayment || hasPendingPayment"
                @click="openEnrollmentModal('reserve')">
                <i v-if="isSubmitting && enrollmentAction === 'reserve'" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-bookmark"></i>
                <span>{{ isSubmitting && enrollmentAction === 'reserve' ? 'Processing...' : 'Reserve Seat' }}</span>
              </button>

              <p class="text-xs text-slate-500 text-center">
                Secure checkout for paid enrollment, or reserve your spot now and complete payment later.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div v-if="showBillingModal" class="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/40 p-0 backdrop-blur-sm sm:p-4"
      @click.self="closeBillingModal">
      <div class="mx-auto mt-0 max-h-[100dvh] max-w-2xl overflow-x-hidden overflow-y-auto rounded-b-2xl bg-white sm:mt-10 sm:max-h-[90dvh] sm:rounded-2xl">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">
              {{ enrollmentAction === 'reserve' ? 'Reserve Your Seat' : 'Billing Information' }}
            </h2>
            <p class="text-sm text-slate-600 mt-1">
              {{ enrollmentAction === 'reserve'
                ? 'Enter your details to reserve the selected courses.'
                : 'Enter your details to continue payment for selected courses.' }}
            </p>
          </div>
          <button type="button" class="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            @click="closeBillingModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-6">
          <div v-if="submitError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ submitError }}
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="billingFirstName" class="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
              <input id="billingFirstName" v-model="customerForm.firstName" type="text" placeholder="e.g. John"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-brand-light'" />
              <p v-if="formErrors.firstName" class="text-xs text-red-600 mt-1">{{ formErrors.firstName }}</p>
            </div>

            <div>
              <label for="billingLastName" class="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
              <input id="billingLastName" v-model="customerForm.lastName" type="text" placeholder="e.g. Doe"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-brand-light'" />
              <p v-if="formErrors.lastName" class="text-xs text-red-600 mt-1">{{ formErrors.lastName }}</p>
            </div>

            <div>
              <label for="billingEmail" class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input id="billingEmail" v-model="customerForm.email" type="email" placeholder="you@example.com"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-brand-light'" />
              <p v-if="formErrors.email" class="text-xs text-red-600 mt-1">{{ formErrors.email }}</p>
            </div>

            <div>
              <label for="billingPhoneNumber" class="block text-sm font-medium text-slate-700 mb-1.5">Phone
                Number</label>
              <input id="billingPhoneNumber" v-model="customerForm.phoneNumber" type="tel"
                placeholder="+234 801 234 5678"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-brand-light'" />
              <p v-if="formErrors.phoneNumber" class="text-xs text-red-600 mt-1">{{ formErrors.phoneNumber }}</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-brand-soft border border-brand-soft flex items-center justify-between">
            <span class="text-sm text-slate-700">
              {{ enrollmentAction === 'reserve' ? 'Selected course total' : 'Total to pay' }}</span>
            <span class="text-xl font-bold text-brand">{{ formatPrice(total) }}</span>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button type="button"
              class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              @click="closeBillingModal">
              Cancel
            </button>
            <button type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSubmitting" @click="submitEnrollment">
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-lock"></i>
              <span>
                {{
                  isSubmitting
                    ? enrollmentAction === 'reserve' ? 'Reserving...' : 'Processing...'
                    : enrollmentAction === 'reserve' ? 'Reserve Seat' : 'Confirm & Pay'
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isRedirectingToCheckout"
      class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 px-6 py-8 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Preparing your checkout</h3>
        <p class="mt-2 text-sm text-slate-600">
          Please wait while we redirect you to secure payment. Do not close this tab.
        </p>
      </div>
    </div>

    <div v-if="showReservationSuccessModal" class="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/40 p-0 backdrop-blur-sm sm:p-4"
      @click.self="closeReservationSuccessModal">
      <div class="mx-auto mt-0 max-h-[100dvh] max-w-xl overflow-x-hidden overflow-y-auto rounded-b-2xl bg-white sm:mt-12 sm:max-h-[90dvh] sm:rounded-2xl">
        <div class="border-b border-slate-200 bg-slate-950 px-5 py-6 text-white sm:px-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Reservation Complete</p>
              <h2 class="mt-2 text-2xl font-bold">Your seat has been reserved</h2>
              <p class="mt-2 text-blue-100">Watch your inbox for next steps from the LinkSkool team.</p>
            </div>
            <button type="button" class="w-10 h-10 rounded-full hover:bg-white/15 text-white cursor-pointer"
              @click="closeReservationSuccessModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div v-if="hasWhatsappGroupUrl" class="rounded-xl border border-brand-soft bg-brand-soft p-4">
            <p class="text-sm text-brand-ink">
              Stay updated in our learner community for onboarding updates, reminders, and live support.
            </p>
            <a :href="whatsappJoinLink" target="_blank" rel="noopener noreferrer"
              class="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400">
              <i class="fa-brands fa-whatsapp"></i>
              <span>Join WhatsApp Group</span>
            </a>
          </div>

          <div class="rounded-xl border border-orange-100 bg-orange-50 p-4">
            <p class="text-sm text-orange-900">Need quick answers before your classes begin?</p>
            <RouterLink to="/faqs"
              class="mt-3 inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100">
              <i class="fa-solid fa-circle-question"></i>
              <span>Check FAQs</span>
            </RouterLink>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-1">
            <RouterLink to="/#programs"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-light/50 hover:text-brand">
              <span>Explore More Programs</span>
              <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>
            <button type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
              @click="closeReservationSuccessModal">
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
