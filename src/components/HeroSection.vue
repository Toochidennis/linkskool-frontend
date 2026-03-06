<script setup lang="ts">
const scrollToPrograms = () => {
    const element = document.getElementById('programs')
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<template>
    <section
        class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob">
            </div>
            <div
                class="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000">
            </div>
            <div
                class="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000">
            </div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Left Content -->
                <div class="text-center lg:text-left space-y-8">
                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
                        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-gray-700">Transform Your Future with Learning</span>
                    </div>

                    <!-- Main Heading -->
                    <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                        <span class="text-gray-900">Unlock Your</span>
                        <br />
                        <span
                            class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent">
                            Potential
                        </span>
                    </h1>

                    <!-- Subtitle -->
                    <p class="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        Learn from industry experts through carefully crafted programs. Build skills that matter,
                        at your own pace, with hands-on projects and real-world applications.
                    </p>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button @click="scrollToPrograms"
                            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer">
                            <span>Browse Programs</span>
                            <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </button>

                        <button
                            class="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            Watch Demo
                        </button>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-bold text-gray-900">50K+</div>
                            <div class="text-sm text-gray-600 mt-1">Students</div>
                        </div>
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-bold text-gray-900">200+</div>
                            <div class="text-sm text-gray-600 mt-1">Courses</div>
                        </div>
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-bold text-gray-900">98%</div>
                            <div class="text-sm text-gray-600 mt-1">Satisfaction</div>
                        </div>
                    </div>
                </div>

                <!-- Right Illustration -->
                <div class="relative hidden lg:block">
                    <div class="relative z-10">
                        <!-- Main Illustration Card -->
                        <div
                            class="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                            <div
                                class="aspect-square bg-gradient-to-br from-blue-100 via-blue-50 to-orange-50 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-graduation-cap text-9xl text-blue-600 opacity-80"></i>
                            </div>
                        </div>

                        <!-- Floating Cards -->
                        <div class="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 animate-float">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fa-solid fa-check text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">Course Complete</div>
                                    <div class="text-xs text-gray-500">+100 XP earned</div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="absolute -bottom-6 -left-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-4 text-white animate-float animation-delay-2000">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i class="fa-solid fa-trophy text-xl"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold">Top Learner</div>
                                    <div class="text-xs opacity-90">This Week</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <i class="fa-solid fa-chevron-down text-gray-400 text-2xl"></i>
        </div>
    </section>
</template>

<style scoped>
@keyframes blob {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(30px, -50px) scale(1.1);
    }

    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

.animate-blob {
    animation: blob 7s infinite;
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}
</style>
