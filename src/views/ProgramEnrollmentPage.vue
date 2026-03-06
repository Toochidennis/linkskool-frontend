<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import type { Course, Program, TrialType } from '@/api/models'
import { programService } from '@/api/services'
import { resolveAssetUrl } from '@/api/util/assetUrl'
import { usePageMeta } from '@/composables/usePageMeta'

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

const program = ref<Program | null>(null)
const courses = ref<Course[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showBillingModal = ref(false)
const loadError = ref('')
const submitError = ref('')
const successMessage = ref('')

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
    ? `Enroll in ${program.value.name} | Linkskool`
    : 'Program Enrollment | Linkskool',
  description: program.value
    ? `Enroll in ${program.value.name}. ${program.value.description}`
    : 'Choose your courses and enroll in our professional learning program.',
  keywords: `${program.value?.name || 'program'} enrollment, online course enrollment, skill development, professional training`,
  url: `https://linkskool.com/programs/${programRef.value}/enroll`,
  image: 'https://linkskool.com/assets/og-image.png',
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

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
})

const formatPrice = (value: number) => nairaFormatter.format(value)

const courseImage = (imageUrl: string | null | undefined) => resolveAssetUrl(imageUrl)

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

const parseEnrollmentDeadline = (course: CourseSelectionModel) => {
  if (!course.enrollmentDeadline) return null
  const parsed = new Date(course.enrollmentDeadline)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

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

const openBillingModal = () => {
  submitError.value = ''
  successMessage.value = ''

  if (selectedCourses.value.length === 0) {
    submitError.value = 'Select at least one course to continue.'
    return
  }

  showBillingModal.value = true
}

const closeBillingModal = () => {
  showBillingModal.value = false
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

const submitPayment = async () => {
  submitError.value = ''
  successMessage.value = ''

  if (selectedCourses.value.length === 0) {
    submitError.value = 'Select at least one course to continue.'
    return
  }

  if (!validateForm()) {
    submitError.value = 'Please fix the highlighted form fields.'
    return
  }

  const selectedCohorts = selectedCourses.value.filter((course) => course.cohortId)

  if (selectedCohorts.length === 0) {
    submitError.value = 'None of the selected courses has an active enrollment cohort.'
    return
  }

  isSubmitting.value = true

  try {
    await Promise.all(
      selectedCohorts.map((course) =>
        programService.enrollInCourse(course.cohortId as number, {
          firstName: customerForm.firstName.trim(),
          lastName: customerForm.lastName.trim(),
          email: customerForm.email.trim(),
          phoneNumber: customerForm.phoneNumber.trim(),
          mode: 'pay',
        }),
      ),
    )

    successMessage.value = 'Payment initiated and enrollment completed for selected courses.'
    showBillingModal.value = false
  } catch (error) {
    console.error('Failed to submit multi-course enrollment:', error)
    submitError.value = 'Payment could not be completed right now. Please try again.'
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
  }
}

onMounted(() => {
  fetchProgramCourses()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <section class="pt-24 pb-10 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-11 bg-white/20 rounded-lg w-2/3 mb-4"></div>
          <div class="h-5 bg-white/20 rounded-lg w-1/2"></div>
        </div>

        <div v-else-if="program" class="max-w-4xl">
          <nav class="flex items-center gap-2 text-blue-100 mb-5">
            <RouterLink to="/" class="hover:text-white transition-colors">Home</RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <RouterLink :to="`/programs/${program.slug}`" class="hover:text-white transition-colors">{{ program.name }}
            </RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <span class="text-white">Enrollment</span>
          </nav>

          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Enroll In {{ program.name }}</h1>
          <p class="text-blue-100 text-lg leading-relaxed max-w-3xl">
            Select one or more courses from this program and complete a single checkout flow.
          </p>
        </div>

        <div v-else>
          <h1 class="text-3xl font-bold text-white">Enrollment unavailable</h1>
          <p class="text-blue-100 mt-2">{{ loadError || 'Please try again later.' }}</p>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loadError && !isLoading"
          class="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {{ loadError }}
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Choose Courses</h2>
                  <p class="text-gray-600 mt-1">Select all courses you want to include in this purchase.</p>
                </div>
                <div class="flex items-center gap-3">
                  <button type="button"
                    class="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                    @click="selectAllCourses">
                    Select all
                  </button>
                  <button type="button"
                    class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    @click="clearSelection">
                    Clear
                  </button>
                </div>
              </div>

              <div v-if="isLoading" class="space-y-4">
                <div v-for="index in 4" :key="index" class="h-28 rounded-xl bg-gray-100 animate-pulse"></div>
              </div>

              <div v-else class="space-y-4">
                <div v-for="course in normalizedCourses" :key="course.courseId"
                  class="rounded-xl border p-4 transition-all duration-200"
                  :class="isSelected(course.courseId) ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'">
                  <label class="flex items-start gap-4"
                    :class="canSelectCourse(course) ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'">
                    <input type="checkbox"
                      class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      :checked="isSelected(course.courseId)" :disabled="!canSelectCourse(course)"
                      @change="toggleCourseSelection(course.courseId)" />

                    <div class="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img v-if="courseImage(course.imageUrl)" :src="courseImage(course.imageUrl) as string"
                        loading="lazy" :alt="course.courseName" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-blue-300">
                        <i class="fa-solid fa-book"></i>
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900 leading-snug">{{ course.courseName }}</h3>
                          <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ course.description }}</p>
                        </div>

                        <div class="text-right">
                          <div v-if="course.isFree" class="text-lg font-bold text-green-600">Free</div>
                          <div v-else class="space-y-0.5">
                            <div class="text-lg font-bold text-gray-900">{{ formatPrice(courseFinalPrice(course)) }}
                            </div>
                            <div v-if="course.discount" class="text-xs text-gray-400 line-through">{{
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
                          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
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
            <div class="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-5">
              <h2 class="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div class="space-y-3 max-h-56 overflow-auto pr-1">
                <div v-for="course in selectedCourses" :key="course.courseId"
                  class="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ course.courseName }}</p>
                    <p class="text-xs text-gray-500">{{ course.isFree ? 'Free' : 'Paid course' }}</p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900">{{ course.isFree ? 'Free' :
                    formatPrice(courseFinalPrice(course)) }}</p>
                </div>
              </div>

              <div class="space-y-2 pt-1 text-sm">
                <div class="flex items-center justify-between text-gray-600">
                  <span>Selected Courses</span>
                  <span>{{ selectedCourses.length }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-600">
                  <span>Paid Courses</span>
                  <span>{{ selectedPaidCount }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-600">
                  <span>Free Courses</span>
                  <span>{{ selectedFreeCount }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex items-center justify-between text-green-700">
                  <span>Discounts</span>
                  <span>- {{ formatPrice(discountAmount) }}</span>
                </div>
                <div class="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between">
                  <span class="text-base font-semibold text-gray-900">Total</span>
                  <span class="text-xl font-bold text-blue-700">{{ formatPrice(total) }}</span>
                </div>
              </div>

              <div v-if="submitError" class="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {{ submitError }}
              </div>

              <div v-if="successMessage"
                class="rounded-xl border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm">
                {{ successMessage }}
              </div>

              <button type="button"
                class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                :disabled="isSubmitting" @click="openBillingModal">
                <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-lock"></i>
                <span>{{ isSubmitting ? 'Processing...' : 'Pay & Enroll' }}</span>
              </button>

              <p class="text-xs text-gray-500 text-center">
                Secure checkout. Your selected courses will be activated after successful payment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div v-if="showBillingModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeBillingModal">
      <div class="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Billing Information</h2>
            <p class="text-sm text-gray-600 mt-1">Enter your details to continue payment for selected courses.</p>
          </div>
          <button type="button" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            @click="closeBillingModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-6">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="billingFirstName" class="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input id="billingFirstName" v-model="customerForm.firstName" type="text"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'" />
              <p v-if="formErrors.firstName" class="text-xs text-red-600 mt-1">{{ formErrors.firstName }}</p>
            </div>

            <div>
              <label for="billingLastName" class="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input id="billingLastName" v-model="customerForm.lastName" type="text"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'" />
              <p v-if="formErrors.lastName" class="text-xs text-red-600 mt-1">{{ formErrors.lastName }}</p>
            </div>

            <div>
              <label for="billingEmail" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input id="billingEmail" v-model="customerForm.email" type="email"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'" />
              <p v-if="formErrors.email" class="text-xs text-red-600 mt-1">{{ formErrors.email }}</p>
            </div>

            <div>
              <label for="billingPhoneNumber" class="block text-sm font-medium text-gray-700 mb-1.5">Phone
                Number</label>
              <input id="billingPhoneNumber" v-model="customerForm.phoneNumber" type="tel"
                class="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"
                :class="formErrors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'" />
              <p v-if="formErrors.phoneNumber" class="text-xs text-red-600 mt-1">{{ formErrors.phoneNumber }}</p>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <span class="text-sm text-gray-700">Total to pay</span>
            <span class="text-xl font-bold text-blue-700">{{ formatPrice(total) }}</span>
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button type="button"
              class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              @click="closeBillingModal">
              Cancel
            </button>
            <button type="button"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              :disabled="isSubmitting" @click="submitPayment">
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-lock"></i>
              <span>{{ isSubmitting ? 'Processing...' : 'Confirm & Pay' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
