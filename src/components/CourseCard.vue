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
        class="card card-lift group flex flex-col overflow-hidden">
        <div class="relative aspect-video overflow-hidden bg-brand-soft">
            <img v-if="displayImageUrl" :src="displayImageUrl" :alt="course.courseName" loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <div v-else class="flex h-full w-full items-center justify-center">
                <i class="fa-solid fa-book text-4xl text-brand/25"></i>
            </div>

            <div v-if="trialBadge"
                class="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                {{ trialBadge }}
            </div>

            <div v-if="typeof displayPrice === 'object' && displayPrice.discount"
                class="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                {{ displayPrice.discount }}
            </div>
        </div>

        <div class="flex flex-1 flex-col p-5">
            <h3
                class="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand">
                {{ course.courseName }}
            </h3>

            <p class="mb-6 mt-2.5 line-clamp-2 text-[15px] leading-6 text-slate-600">
                {{ course.description }}
            </p>

            <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <div v-if="typeof displayPrice === 'string'" class="text-xl font-semibold tracking-tight text-slate-950">
                    <span :class="isFreeCourse ? 'text-emerald-600' : ''">{{ displayPrice }}</span>
                </div>
                <div v-else class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-semibold tracking-tight text-slate-950">{{ displayPrice.current }}</span>
                        <span class="text-sm text-slate-400 line-through">{{ displayPrice.original }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-1.5 text-sm font-semibold text-brand">
                    <span>View</span>
                    <i class="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </div>
            </div>
        </div>
    </RouterLink>
</template>
