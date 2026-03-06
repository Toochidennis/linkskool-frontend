<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-2 group">
                    <img src="@/assets/logo.png" alt="LinkSkool"
                        class="h-8 w-auto transition-transform group-hover:scale-105" />
                    <span
                        class="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">LinkSkool</span>
                </RouterLink>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center gap-8">
                    <RouterLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        Home
                    </RouterLink>
                    <RouterLink to="/#programs" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        Programs
                    </RouterLink>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        About
                    </a>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                        Contact
                    </a>

                    <button
                        class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium cursor-pointer">
                        Get Started
                    </button>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="toggleMobileMenu"
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Toggle menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Navigation -->
            <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                <div class="flex flex-col gap-4">
                    <RouterLink to="/" @click="toggleMobileMenu"
                        class="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                        Home
                    </RouterLink>
                    <RouterLink to="/#programs" @click="toggleMobileMenu"
                        class="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                        Programs
                    </RouterLink>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                        About
                    </a>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2">
                        Contact
                    </a>
                    <button
                        class="mt-2 w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>
