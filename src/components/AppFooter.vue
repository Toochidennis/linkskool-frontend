<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import logoSrc from '@/assets/logo.png'
import type { Program } from '@/api/models'
import { programService } from '@/api/services'
import { siteLinks } from '@/config/site'

const email = ref('')
const programs = ref<Program[]>([])
const isLoadingPrograms = ref(false)

const abbreviateProgramName = (name: string, maxLength = 24) =>
  name.length <= maxLength ? name : `${name.slice(0, maxLength - 1).trimEnd()}…`

const footerPrograms = computed(() =>
  programs.value.slice(0, 4).map((program) => ({
    ...program,
    displayName: abbreviateProgramName(program.name),
  })),
)

// NOTE: not wired to a backend yet — this only acknowledges the input locally.
const subscribeNewsletter = () => {
  if (email.value) {
    alert('Thank you for subscribing!')
    email.value = ''
  }
}

const socials = [
  { label: 'Facebook', icon: 'fa-facebook-f', url: 'https://www.facebook.com/share/1Dwd5kQsgM/' },
  { label: 'X (formerly Twitter)', icon: 'fa-x-twitter', url: 'https://x.com/DigitalDreamsNG' },
  { label: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/digitaldreamslimited/?hl=en' },
  { label: 'LinkedIn', icon: 'fa-linkedin-in', url: 'https://www.linkedin.com/company/digital-dreams-limited/posts/?feedView=all' },
  { label: 'YouTube', icon: 'fa-youtube', url: 'https://www.youtube.com/@digitaldreamslimited' },
]

onMounted(async () => {
  isLoadingPrograms.value = true
  try {
    programs.value = await programService.getAllPrograms()
  } catch (error) {
    console.error('Failed to load footer programs:', error)
  } finally {
    isLoadingPrograms.value = false
  }
})
</script>

<template>
  <footer class="bg-slate-950 text-slate-400">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
        <!-- Brand -->
        <div class="lg:col-span-2 lg:pr-8">
          <RouterLink to="/" class="inline-flex items-center gap-2.5">
            <img :src="logoSrc" alt="" class="h-8 w-auto" />
            <span class="text-xl font-semibold tracking-tight"><span class="text-brand">Link</span><span class="text-orange">Skool</span></span>
          </RouterLink>
          <p class="mt-5 max-w-sm leading-7">
            Education infrastructure for Africa — connecting learning, assessment, records and
            reporting inside one platform.
          </p>

          <div class="mt-8">
            <p class="text-sm font-semibold text-white">Get product updates</p>
            <form class="mt-3 flex flex-col gap-2.5 sm:flex-row" @submit.prevent="subscribeNewsletter">
              <label for="footer-email" class="sr-only">Email address</label>
              <input
                id="footer-email"
                v-model="email"
                type="email"
                placeholder="you@school.edu.ng"
                required
                class="min-w-0 flex-1 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-[15px] text-white outline-none transition placeholder:text-slate-500 focus:border-brand-light focus:ring-4 focus:ring-brand/25"
              />
              <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <!-- Programs -->
        <nav aria-labelledby="footer-programs">
          <h2 id="footer-programs" class="text-sm font-semibold text-white">Programs</h2>
          <ul class="mt-5 space-y-3.5 text-[15px]">
            <template v-if="isLoadingPrograms">
              <li v-for="i in 4" :key="`program-loading-${i}`" class="h-4 w-32 animate-pulse rounded-full bg-slate-800"></li>
            </template>
            <template v-else-if="footerPrograms.length">
              <li v-for="program in footerPrograms" :key="program.id">
                <RouterLink :to="`/programs/${program.slug}`" :title="program.name" class="transition hover:text-white">
                  {{ program.displayName }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/#programs" class="font-medium text-brand-light transition hover:text-white">
                  View all programs
                </RouterLink>
              </li>
            </template>
            <li v-else>
              <RouterLink to="/#programs" class="transition hover:text-white">Explore programs</RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Platform -->
        <nav aria-labelledby="footer-platform">
          <h2 id="footer-platform" class="text-sm font-semibold text-white">Platform</h2>
          <ul class="mt-5 space-y-3.5 text-[15px]">
            <li><RouterLink to="/#flow" class="transition hover:text-white">LinkSkool Flow</RouterLink></li>
            <li><RouterLink to="/#platform" class="transition hover:text-white">CBT &amp; assessments</RouterLink></li>
            <li>
              <a :href="siteLinks.app" target="_blank" rel="noopener noreferrer" class="transition hover:text-white">
                Open the app
              </a>
            </li>
            <li><RouterLink to="/news" class="transition hover:text-white">News</RouterLink></li>
          </ul>
        </nav>

        <!-- Company -->
        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" class="text-sm font-semibold text-white">Company</h2>
          <ul class="mt-5 space-y-3.5 text-[15px]">
            <li><RouterLink to="/about" class="transition hover:text-white">About us</RouterLink></li>
            <li><RouterLink to="/contact" class="transition hover:text-white">Contact</RouterLink></li>
            <li><RouterLink to="/faqs" class="transition hover:text-white">FAQs</RouterLink></li>
            <li><RouterLink to="/privacy-policy" class="transition hover:text-white">Privacy policy</RouterLink></li>
            <li><RouterLink to="/terms-of-use" class="transition hover:text-white">Terms of use</RouterLink></li>
          </ul>
        </nav>
      </div>

      <!-- Bottom bar -->
      <div class="mt-14 flex flex-col items-center justify-between gap-6 border-t border-slate-800/80 pt-8 sm:mt-16 md:flex-row">
        <p class="order-3 text-sm md:order-1">
          © {{ new Date().getFullYear() }} LinkSkool Online Ventures Limited.
        </p>

        <div class="order-1 flex items-center gap-2.5 md:order-2">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
          >
            <i :class="['fa-brands', social.icon, 'text-sm']"></i>
          </a>
        </div>

        <a href="mailto:info@linkskool.com" class="order-2 text-sm transition hover:text-white md:order-3">
          info@linkskool.com
        </a>
      </div>
    </div>
  </footer>
</template>
