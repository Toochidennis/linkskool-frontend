<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DOMPurify from 'dompurify'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PageHero from '@/components/PageHero.vue'
import type { Faqs } from '@/api/models'
import { faqsService } from '@/api/services'
import { usePageMeta } from '@/composables/usePageMeta'

const faqs = ref<Faqs[]>([])
const isLoading = ref(false)
const loadError = ref('')
const expandedFaqIds = ref<number[]>([])

const sanitizeAnswerHtml = (answer: string) =>
  DOMPurify.sanitize(answer, {
    USE_PROFILES: { html: true },
  })

const displayedFaqs = computed(() =>
  faqs.value.map((faq, index) => ({
    ...faq,
    order: index + 1,
    answerHtml: sanitizeAnswerHtml(faq.answer),
  })),
)

usePageMeta({
  title: 'FAQs | LinkSkool',
  description: 'Answers to common questions about LinkSkool programs, enrollment, payments and how the platform works.',
  keywords: 'linkskool faqs, enrollment questions, payment help, course support',
  url: 'https://linkskool.com/faqs',
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
})

const isExpanded = (faqId: number) => expandedFaqIds.value.includes(faqId)

const toggleFaq = (faqId: number) => {
  if (isExpanded(faqId)) {
    expandedFaqIds.value = expandedFaqIds.value.filter((id) => id !== faqId)
    return
  }
  expandedFaqIds.value = [...expandedFaqIds.value, faqId]
}

const fetchFaqs = async () => {
  isLoading.value = true
  loadError.value = ''
  faqs.value = []
  expandedFaqIds.value = []

  try {
    faqs.value = await faqsService.getFaqs()
  } catch (error) {
    console.error('Failed to load FAQs:', error)
    loadError.value = 'Unable to load FAQs right now. Please try again shortly.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFaqs()
})
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-white">
    <AppHeader />

    <PageHero
      eyebrow="Help centre"
      title="Frequently asked questions"
      subtitle="Quick answers to common questions about our programs, payments and enrollment process."
      align="center"
    />

    <section class="pb-20 sm:pb-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div>
          <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 6" :key="i" class="border-b border-slate-100 py-6">
              <div class="h-5 w-4/5 animate-pulse rounded bg-slate-200"></div>
              <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
              <div class="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100"></div>
            </div>
          </div>

          <div v-else-if="loadError" class="rounded-[14px] border border-red-100 bg-red-50 px-6 py-8 text-center">
            <i class="fa-solid fa-circle-exclamation text-2xl text-red-500"></i>
            <p class="mt-3 text-red-700">{{ loadError }}</p>
            <button type="button" @click="fetchFaqs"
              class="btn btn-sm mt-5 bg-red-600 text-white hover:bg-red-500">
              <i class="fa-solid fa-rotate-right"></i>
              <span>Try again</span>
            </button>
          </div>

          <div v-else-if="displayedFaqs.length > 0" class="border-t border-slate-100">
            <article v-for="faq in displayedFaqs" :key="faq.id" class="border-b border-slate-100">
              <button type="button" @click="toggleFaq(faq.id)"
                class="group flex w-full cursor-pointer items-start justify-between gap-5 py-6 text-left"
                :aria-expanded="isExpanded(faq.id)">
                <div class="flex min-w-0 items-start gap-4">
                  <span class="mt-0.5 shrink-0 text-sm font-medium tabular-nums text-slate-400">
                    {{ String(faq.order).padStart(2, '0') }}
                  </span>
                  <h2 class="min-w-0 break-words text-base font-semibold leading-7 tracking-tight text-slate-950 transition-colors group-hover:text-brand sm:text-lg">
                    {{ faq.question }}
                  </h2>
                </div>
                <span class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-brand/30 group-hover:text-brand"
                  :class="isExpanded(faq.id) && 'border-brand/30 bg-brand-soft text-brand'">
                  <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200"
                    :class="isExpanded(faq.id) && 'rotate-180'"></i>
                </span>
              </button>

              <transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100" leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                <div v-if="isExpanded(faq.id)" class="overflow-hidden pb-7 pl-9 pr-12">
                  <div
                    class="leading-7 text-slate-600 [&_a]:font-semibold [&_a]:text-brand [&_a:hover]:text-brand-ink [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-slate-900"
                    v-html="faq.answerHtml">
                  </div>
                </div>
              </transition>
            </article>
          </div>

          <div v-else class="rounded-[14px] border border-dashed border-slate-300 px-6 py-14 text-center">
            <i class="fa-solid fa-comments text-3xl text-slate-300"></i>
            <p class="mt-4 text-slate-600">No FAQs are available yet. Please check back soon.</p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>
