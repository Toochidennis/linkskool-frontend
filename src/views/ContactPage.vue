<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PageHero from '@/components/PageHero.vue'
import { useContactForm } from '@/composables/useContactForm'
import { usePageMeta } from '@/composables/usePageMeta'
import { contactChannels, contactReasons, officeDetails } from '@/data/contact'

usePageMeta({
  title: 'Contact LinkSkool',
  description:
    'Reach LinkSkool for enrollment and payment support, partnerships, program enquiries or technical help.',
  keywords: 'contact LinkSkool, LinkSkool support, enrollment help, program support',
  url: 'https://linkskool.com/contact',
  image: 'https://linkskool.com/og-image.png',
  type: 'website',
})

const { errors, form, submit } = useContactForm()
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-white">
    <AppHeader />

    <main>
      <PageHero
        eyebrow="Contact"
        title="Get the right help faster."
        subtitle="Choose a direct contact path or send a short message. We route support requests by topic so the right team can respond."
      >
        <div class="grid gap-5 md:grid-cols-3">
          <a
            v-for="channel in contactChannels"
            :key="channel.title"
            :href="channel.href"
            class="card card-lift group flex flex-col p-7"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl" :class="channel.accent">
              <i :class="channel.icon"></i>
            </span>
            <h2 class="mt-6 text-lg font-semibold tracking-tight text-slate-950">{{ channel.title }}</h2>
            <p class="mt-2.5 flex-1 text-[15px] leading-6 text-slate-600">{{ channel.description }}</p>
            <p class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              {{ channel.action }}
              <i class="fa-solid fa-arrow-right text-xs transition group-hover:translate-x-0.5"></i>
            </p>
          </a>
        </div>
      </PageHero>

      <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <aside class="space-y-5">
            <div class="card p-7">
              <h2 class="text-lg font-semibold tracking-tight text-slate-950">Office</h2>
              <dl class="mt-5 space-y-4 text-sm">
                <div>
                  <dt class="text-slate-500">Location</dt>
                  <dd class="mt-1 text-slate-900">{{ officeDetails.location }}</dd>
                </div>
                <div>
                  <dt class="text-slate-500">Email</dt>
                  <dd class="mt-1">
                    <a :href="`mailto:${officeDetails.email}`" class="font-semibold text-brand hover:text-brand-ink">
                      {{ officeDetails.email }}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt class="text-slate-500">Response</dt>
                  <dd class="mt-1 text-slate-900">{{ officeDetails.responseTime }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-[14px] border border-brand/12 bg-brand-soft p-7">
              <h2 class="text-base font-semibold tracking-tight text-slate-950">Before you write</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Include your program name, payment reference, or cohort details when relevant.
              </p>
            </div>
          </aside>

          <form class="card p-6 sm:p-9" @submit.prevent="submit">
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="contact-name" class="field-label">Name</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  class="field"
                  :class="errors.name && 'field-invalid'"
                />
                <p v-if="errors.name" class="field-hint">{{ errors.name }}</p>
              </div>

              <div>
                <label for="contact-email" class="field-label">Email</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  class="field"
                  :class="errors.email && 'field-invalid'"
                />
                <p v-if="errors.email" class="field-hint">{{ errors.email }}</p>
              </div>
            </div>

            <div class="mt-5">
              <label for="contact-reason" class="field-label">Reason</label>
              <select
                id="contact-reason"
                v-model="form.reason"
                class="field"
              >
                <option v-for="reason in contactReasons" :key="reason" :value="reason">
                  {{ reason }}
                </option>
              </select>
            </div>

            <div class="mt-5">
              <label for="contact-message" class="field-label">Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="7"
                class="field resize-y leading-6"
                :class="errors.message && 'field-invalid'"
              ></textarea>
              <p v-if="errors.message" class="field-hint">{{ errors.message }}</p>
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-xs leading-5 text-slate-500">
                This opens your email app with the message prepared.
              </p>
              <button
                type="submit"
                class="btn btn-primary btn-sm"
              >
                Send message
                <i class="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
