<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-2 group">
                    <img src="@/assets/logo.png" alt="LinkSkool"
                        class="h-8 w-auto transition-transform group-hover:scale-105" />
                    <span class="text-xl font-bold tracking-tight"><span class="text-brand">Link</span><span class="text-orange">Skool</span></span>
                </RouterLink>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center gap-7">
                    <RouterLink to="/" class="text-slate-600 hover:text-brand transition-colors font-medium">
                        Home
                    </RouterLink>
                    <RouterLink to="/#programs" class="text-slate-600 hover:text-brand transition-colors font-medium">
                        Programs
                    </RouterLink>
                    <RouterLink to="/news" class="text-slate-600 hover:text-brand transition-colors font-medium">
                        News
                    </RouterLink>
                    <RouterLink to="/about" class="text-slate-600 hover:text-brand transition-colors font-medium">
                        About
                    </RouterLink>
                    <RouterLink to="/contact" class="text-slate-600 hover:text-brand transition-colors font-medium">
                        Contact
                    </RouterLink>

                    <a href="/#programs" class="btn btn-primary btn-sm">Explore programs</a>
                </div>

                <!-- Mobile Menu Button -->
                <button @click="toggleMobileMenu"
                    class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
            <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-100 animate-fade-in">
                <div class="flex flex-col gap-4">
                    <RouterLink to="/" @click="toggleMobileMenu"
                        class="text-slate-600 hover:text-brand transition-colors font-medium py-2">
                        Home
                    </RouterLink>
                    <RouterLink to="/#programs" @click="toggleMobileMenu"
                        class="text-slate-600 hover:text-brand transition-colors font-medium py-2">
                        Programs
                    </RouterLink>
                    <RouterLink to="/news" @click="toggleMobileMenu"
                        class="text-slate-600 hover:text-brand transition-colors font-medium py-2">
                        News
                    </RouterLink>
                    <RouterLink to="/about" @click="toggleMobileMenu"
                        class="text-slate-600 hover:text-brand transition-colors font-medium py-2">
                        About
                    </RouterLink>
                    <RouterLink to="/contact" @click="toggleMobileMenu"
                        class="text-slate-600 hover:text-brand transition-colors font-medium py-2">
                        Contact
                    </RouterLink>
                    <a href="/#programs" @click="toggleMobileMenu" class="btn btn-primary btn-sm btn-block mt-2">Explore programs</a>
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
