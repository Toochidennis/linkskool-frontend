<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import type { Program } from '@/api/models'
import { programService } from '@/api/services'

const email = ref('')
const programs = ref<Program[]>([])
const isLoadingPrograms = ref(false)

const abbreviateProgramName = (name: string, maxLength = 24) => {
  if (name.length <= maxLength) {
    return name
  }
  return `${name.slice(0, maxLength - 1).trimEnd()}…`
}

const footerPrograms = computed(() =>
  programs.value.slice(0, 4).map((program) => ({
    ...program,
    displayName: abbreviateProgramName(program.name),
  })),
)

const subscribeNewsletter = () => {
  if (email.value) {
    alert('Thank you for subscribing!')
    email.value = ''
  }
}

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
  <footer class="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        <!-- Brand Column -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <img src="@/assets/logo.png" alt="LinkSkool" class="h-8 w-auto" />
            <span class="text-xl font-bold text-white">LinkSkool</span>
          </div>
          <p class="text-gray-400 mb-6 max-w-sm">
            Empowering learners worldwide with quality education and innovative learning experiences.
          </p>

          <!-- Newsletter -->
          <div class="space-y-3">
            <h4 class="text-white font-semibold">Subscribe to our newsletter</h4>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-2">
              <input v-model="email" type="email" placeholder="Enter your email" required
                class="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500" />
              <button type="submit"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <!-- Programs -->
        <div>
          <h3 class="text-white font-semibold mb-4">Programs</h3>
          <ul class="space-y-3">
            <template v-if="isLoadingPrograms">
              <li v-for="i in 4" :key="`program-loading-${i}`" class="h-5 w-32 rounded bg-gray-800/80 animate-pulse">
              </li>
            </template>
            <template v-else-if="footerPrograms.length > 0">
              <li v-for="program in footerPrograms" :key="program.id">
                <RouterLink :to="`/programs/${program.slug}`" :title="program.name"
                  class="hover:text-white transition-colors">
                  {{ program.displayName }}
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/#programs" class="text-blue-300 hover:text-blue-200 transition-colors">
                  View all programs
                </RouterLink>
              </li>
            </template>
            <li v-else>
              <RouterLink to="/#programs" class="hover:text-white transition-colors">
                Explore Programs
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-white font-semibold mb-4">Resources</h3>
          <ul class="space-y-3">
            <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
            <li>
              <RouterLink to="/faqs" class="hover:text-white transition-colors">FAQs</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="text-white font-semibold mb-4">Company</h3>
          <ul class="space-y-3">
            <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            <li>
              <RouterLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy
              </RouterLink>
            </li>
            <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} LinkSkool. All rights reserved.
          </p>

          <!-- Social Icons -->
          <div class="flex items-center gap-4">
            <a href="https://www.facebook.com/share/1Dwd5kQsgM/"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
              aria-label="Facebook">
              <i class="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a href="https://x.com/DigitalDreamsNG"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-400 transition-colors"
              aria-label="X (formerly Twitter)">
              <i class="fa-brands fa-x text-sm"></i>
            </a>
            <a href="https://www.instagram.com/digitaldreamslimited/?hl=en"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition-colors"
              aria-label="Instagram">
              <i class="fa-brands fa-instagram text-sm"></i>
            </a>
            <a href="https://www.linkedin.com/company/digital-dreams-limited/posts/?feedView=all"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 transition-colors"
              aria-label="LinkedIn">
              <i class="fa-brands fa-linkedin-in text-sm"></i>
            </a>
            <a href="https://www.youtube.com/@digitaldreamslimited"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-600 transition-colors"
              aria-label="YouTube">
              <i class="fa-brands fa-youtube text-sm"></i>
            </a>
          </div>

          <!-- Contact Email -->
          <a href="mailto:hello@linkskool.com" class="text-gray-400 hover:text-white transition-colors text-sm">
            hello@linkskool.com
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
