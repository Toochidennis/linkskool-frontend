<script setup lang="ts">
import { computed } from 'vue'
import type { CourseDetail } from '@/api/models'

const props = defineProps<{
  courseDetail: CourseDetail
}>()

const emit = defineEmits<{
  enroll: []
  reserve: []
}>()

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2
})

const displayPrice = computed(() => {
  const price = props.courseDetail.cohort.cost || 0
  const discount = props.courseDetail.cohort.discount || 0

  if (discount > 0) {
    const discountedPrice = price - (price * discount / 100)
    return {
      current: nairaFormatter.format(discountedPrice),
      original: nairaFormatter.format(price),
      discount: discount
    }
  }

  return nairaFormatter.format(price)
})

const learningTypeLabel = computed(() =>
  props.courseDetail.cohort.learningType === 'instructor_led' ? 'Instructor-led' : 'Self-paced'
)

const enrollmentDeadlineDate = computed(() => {
  const rawValue = props.courseDetail.cohort.enrollmentDeadline
  if (!rawValue) return null
  const parsed = new Date(rawValue)
  return Number.isNaN(parsed.getTime()) ? null : parsed
})

const isEnrollmentClosed = computed(() =>
  props.courseDetail.cohort.learningType === 'instructor_led' &&
  enrollmentDeadlineDate.value !== null &&
  enrollmentDeadlineDate.value.getTime() < Date.now()
)

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Not set'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (value: Date | null) => {
  if (!value) return 'Not set'
  return value.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
    <!-- Price Section -->
    <div class="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-b border-gray-200">
      <div v-if="typeof displayPrice === 'string'" class="text-center">
        <div class="text-4xl font-bold text-gray-900">{{ displayPrice }}</div>
      </div>
      <div v-else class="text-center space-y-2">
        <div class="flex items-center justify-center gap-3">
          <span class="text-4xl font-bold text-gray-900">{{ displayPrice.current }}</span>
          <span class="text-xl text-gray-400 line-through">{{ displayPrice.original }}</span>
        </div>
        <div class="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          Save {{ displayPrice.discount }}%
        </div>
      </div>
    </div>

    <!-- Course Details -->
    <div class="p-6 space-y-6">
      <!-- Enrollment Buttons -->
      <div class="space-y-3">
        <button @click="emit('enroll')" :disabled="isEnrollmentClosed" :class="[
          'w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group',
          isEnrollmentClosed
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
        ]">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>Enroll Now</span>
          <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-sm"></i>
        </button>

        <button @click="emit('reserve')" :disabled="isEnrollmentClosed" :class="[
          'w-full px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2',
          isEnrollmentClosed
            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600 hover:shadow-lg cursor-pointer'
        ]">
          <i class="fa-solid fa-bookmark"></i>
          <span>Reserve Seat</span>
        </button>

        <p v-if="isEnrollmentClosed" class="text-sm text-red-600 font-medium">
          Enrollment is closed for this instructor-led cohort.
        </p>
      </div>

      <div class="pt-6 border-t border-gray-200 space-y-4">
        <h3 class="font-semibold text-gray-900 text-lg">Course Information</h3>

        <!-- Start Date -->
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-calendar-day text-blue-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-500">Start Date</div>
            <div class="font-semibold text-gray-900">{{ formatDate(courseDetail.cohort.startDate) }}</div>
          </div>
        </div>

        <!-- End Date -->
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-calendar-check text-orange-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-500">End Date</div>
            <div class="font-semibold text-gray-900">{{ formatDate(courseDetail.cohort.endDate) }}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-signal text-indigo-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-500">Learning Type</div>
            <div class="font-semibold text-gray-900">{{ learningTypeLabel }}</div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-hourglass-end text-red-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-500">Enrollment Deadline</div>
            <div class="font-semibold text-gray-900">{{ formatDateTime(enrollmentDeadlineDate) }}</div>
          </div>
        </div>

        <!-- Instructor -->
        <div v-if="courseDetail.cohort.instructorName" class="flex items-start gap-3">
          <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-user-tie text-green-600"></i>
          </div>
          <div class="flex-1">
            <div class="text-sm text-gray-500">Instructor</div>
            <div class="font-semibold text-gray-900">{{ courseDetail.cohort.instructorName }}</div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="pt-6 border-t border-gray-200 space-y-3">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fa-solid fa-check-circle text-green-500"></i>
          <span>Lifetime access</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fa-solid fa-certificate text-blue-500"></i>
          <span>Certificate of completion</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fa-solid fa-mobile-screen text-orange-500"></i>
          <span>Access on mobile and desktop</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Enrollment Button (Desktop Only) -->
  <button v-if="!isEnrollmentClosed" @click="emit('enroll')"
    class="hidden lg:flex fixed bottom-8 right-8 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.5)] hover:scale-110 transition-all duration-300 items-center gap-3 group z-50 cursor-pointer animate-bounce-slow">
    <i class="fa-solid fa-graduation-cap text-xl"></i>
    <span>Enroll Now</span>
    <i class="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
  </button>
</template>

<style scoped>
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.animate-bounce-slow:hover {
  animation: none;
}
</style>
