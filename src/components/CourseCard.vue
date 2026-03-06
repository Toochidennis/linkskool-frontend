<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Course } from '@/api/models'
import { resolveAssetUrl } from '@/api/util/assetUrl'

const props = defineProps<{
    course: Course
}>()

const displayImageUrl = computed(() => resolveAssetUrl(props.course.imageUrl))
const nairaFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
})

const cohort = computed(() => props.course.cohort)
const isFreeCourse = computed(() => cohort.value?.isFree ?? false)

const encodeRef = (value: string) => {
    try {
        return btoa(value)
    } catch {
        return value
    }
}

const courseDetailsRoute = computed(() => ({
    path: `/courses/${props.course.courseId}`,
    query: cohort.value?.slug ? { ref: encodeRef(cohort.value.slug) } : undefined,
}))

const displayPrice = computed(() => {
    if (isFreeCourse.value) return 'Free'

    const price = cohort.value?.cost ?? 0
    const discount = cohort.value?.discount ?? 0

    if (discount > 0) {
        const discountedPrice = price - (price * discount) / 100
        return {
            current: nairaFormatter.format(discountedPrice),
            original: nairaFormatter.format(price),
            discount: `${discount}% OFF`,
        }
    }

    return nairaFormatter.format(price)
})

const trialBadge = computed(() => {
    const trialType = cohort.value?.trialType
    const trialValue = cohort.value?.trialValue

    if (!trialType || !trialValue) return null

    if (trialType === 'days') {
        return `${trialValue} days trial`
    }
    if (trialType === 'views') {
        return `${trialValue} views trial`
    }
    return null
})
</script>

<template>
    <RouterLink :to="courseDetailsRoute"
        class="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
            <img v-if="displayImageUrl" :src="displayImageUrl" :alt="course.courseName" loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <i class="fa-solid fa-book text-5xl text-blue-300"></i>
            </div>

            <div v-if="trialBadge"
                class="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                {{ trialBadge }}
            </div>

            <div v-if="typeof displayPrice === 'object' && displayPrice.discount"
                class="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                {{ displayPrice.discount }}
            </div>
        </div>

        <div class="p-5">
            <h3
                class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                {{ course.courseName }}
            </h3>

            <p class="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {{ course.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div v-if="typeof displayPrice === 'string'" class="text-xl font-bold text-gray-900">
                    <span :class="isFreeCourse ? 'text-green-600' : ''">{{ displayPrice }}</span>
                </div>
                <div v-else class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-bold text-gray-900">{{ displayPrice.current }}</span>
                        <span class="text-sm text-gray-400 line-through">{{ displayPrice.original }}</span>
                    </div>
                </div>

                <div class="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-1 transition-all">
                    <span>View</span>
                    <i class="fa-solid fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform text-xs"></i>
                </div>
            </div>
        </div>
    </RouterLink>
</template>
