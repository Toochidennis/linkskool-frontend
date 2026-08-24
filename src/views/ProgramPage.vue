<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AmbientBackdrop from '@/components/AmbientBackdrop.vue'
import AppHeader from '@/components/AppHeader.vue'
import CourseCard from '@/components/CourseCard.vue'
import type { Course, Program } from '@/api/models'
import { programService } from '@/api/services'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()

const program = ref<Program | null>(null)
const courses = ref<Course[]>([])
const isLoading = ref(false)
const loadError = ref('')

const programRef = computed(() => {
  const value = route.params.s
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
})

const enrollProgramPath = computed(() => {
  if (!programRef.value || courses.value.length === 0) {
    return ''
  }
  return `/programs/${programRef.value}/enroll`
})

// Dynamic meta tags based on program data
usePageMeta(() => ({
  title: program.value
    ? `${program.value.name} | Learn with LinkSkool`
    : 'Program | LinkSkool',
  description: program.value?.description || 'Explore this LinkSkool program and the courses inside it.',
  keywords: `${program.value?.name || 'program'}, online courses, skill development, professional training`,
  url: `https://linkskool.com/programs/${programRef.value}`,
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
}))

const fetchProgramCourses = async () => {
  isLoading.value = true
  loadError.value = ''
  program.value = null
  courses.value = []

  if (!programRef.value) {
    loadError.value = 'Program reference is missing in the URL.'
    isLoading.value = false
    return
  }

  try {
    const response = await programService.getProgramCourses(programRef.value)
    program.value = response.program
    courses.value = response.courses
  } catch (error) {
    console.error('Failed to fetch program courses:', error)
    loadError.value = 'Unable to load this program right now.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProgramCourses()
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-white">
    <AppHeader />

    <section class="relative isolate overflow-hidden bg-white pb-14 pt-16 sm:pb-16">
      <AmbientBackdrop />
      <div class="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div v-if="isLoading" class="animate-pulse">
          <div class="mb-5 h-4 w-48 rounded-full bg-slate-200"></div>
          <div class="mb-4 h-12 w-2/3 rounded-2xl bg-slate-200"></div>
          <div class="h-6 w-1/2 rounded-xl bg-slate-200"></div>
        </div>

        <div v-else-if="program" class="max-w-4xl">
          <nav class="mb-6 flex min-w-0 flex-wrap items-center gap-2 text-sm text-slate-500">
            <RouterLink to="/" class="hover:text-brand">Home</RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <RouterLink to="/#programs" class="hover:text-brand">Programs</RouterLink>
            <i class="fa-solid fa-chevron-right text-xs"></i>
            <span class="min-w-0 truncate text-slate-700">{{ program.name }}</span>
          </nav>

          <h1 class="break-words text-pretty text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
            {{ program.name }}
          </h1>
          <p class="mt-6 max-w-3xl break-words text-lg leading-8 text-slate-600">
            {{ program.description }}
          </p>

          <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <RouterLink v-if="enrollProgramPath" :to="enrollProgramPath" class="btn btn-primary">
              Enroll
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </RouterLink>
            <button v-else type="button" disabled class="btn btn-primary">
              Enroll
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <p class="flex items-center gap-2 text-sm text-slate-500">
              <i class="fa-solid fa-book text-xs"></i>
              {{ courses.length }} {{ courses.length === 1 ? 'course' : 'courses' }} in this program
            </p>
          </div>
        </div>

        <div v-else class="max-w-4xl">
          <h1 class="text-[2.4rem] font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl">Program not found</h1>
          <p class="mt-5 text-lg text-slate-600">{{ loadError || 'Please check the program link and try again.' }}</p>
          <RouterLink to="/#programs" class="btn btn-primary mt-8">
            Browse all programs
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <p class="eyebrow">Curriculum</p>
          <h2 class="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[2.6rem]">
            Courses in this program
          </h2>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            Work through them in order, or jump to the one you need.
          </p>
        </div>

        <div v-if="isLoading" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-80 animate-pulse rounded-[24px] bg-slate-100"></div>
        </div>

        <div v-else-if="courses.length > 0" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard v-for="course in courses" :key="course.courseId" :course="course" />
        </div>

        <div v-else class="mt-12 rounded-[24px] border border-dashed border-slate-300 px-6 py-16 text-center">
          <i class="fa-solid fa-book-open text-3xl text-slate-300"></i>
          <p class="mt-4 text-slate-600">{{ loadError || 'No courses available yet.' }}</p>
        </div>
      </div>
    </section>

    <section class="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[32px] bg-slate-50 px-7 py-10 sm:px-12 sm:py-12 lg:flex-row lg:items-center">
        <div class="max-w-xl">
          <h2 class="text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-slate-950 sm:text-3xl">
            Looking for something else?
          </h2>
          <p class="mt-3 leading-7 text-slate-600">
            Browse every LinkSkool program and find the path that fits your goal.
          </p>
        </div>
        <RouterLink to="/#programs" class="btn btn-primary shrink-0">
          View all programs
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </RouterLink>
      </div>
    </section>

    <AppFooter />
  </div>
</template>
