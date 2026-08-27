<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Course } from '@/api/models'
import { resolveAssetUrl } from '@/api/util/assetUrl'

const props = defineProps<{
    course: Course
}>()

const displayImageUrl = computed(() => resolveAssetUrl(props.course.imageUrl))
const nairaFormatter = {
    format: (value: number) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(value),
}

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
                class="absolute left-3 top-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {{ trialBadge }}
            </div>

            <div v-if="typeof displayPrice === 'object' && displayPrice.discount"
                class="absolute right-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[11px] font-semibold text-white">
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

            <div class="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div v-if="typeof displayPrice === 'string'" class="min-w-0 truncate text-lg font-semibold tracking-tight text-slate-950">
                    <span :class="isFreeCourse ? 'text-brand' : ''">{{ displayPrice }}</span>
                </div>
                <div v-else class="flex min-w-0 flex-wrap items-baseline gap-x-2">
                    <span class="text-lg font-semibold tracking-tight text-slate-950">{{ displayPrice.current }}</span>
                    <span class="text-xs text-slate-400 line-through">{{ displayPrice.original }}</span>
                </div>

                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <i class="fa-solid fa-arrow-right text-[11px]"></i>
                </span>
            </div>
        </div>
    </RouterLink>
</template>
