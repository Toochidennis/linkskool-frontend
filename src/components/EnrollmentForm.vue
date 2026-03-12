<script setup lang="ts">
import { reactive } from 'vue'
import type { CourseDetail } from '@/api/models'

const props = defineProps<{
    courseDetail: CourseDetail
    mode: 'pay' | 'reserve'
    submitError?: string
    isSubmitting?: boolean
}>()

const emit = defineEmits<{
    close: []
    submit: [formData: EnrollmentFormData]
}>()

interface EnrollmentFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
}

const formData = reactive<EnrollmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
})

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
})

const validateForm = (): boolean => {
    let isValid = true

    // Reset errors
    errors.firstName = ''
    errors.lastName = ''
    errors.email = ''
    errors.phone = ''

    // First Name
    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required'
        isValid = false
    }

    // Last Name
    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required'
        isValid = false
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email'
        isValid = false
    }

    // Phone
    const phoneRegex = /^[\d\s\-+()]+$/
    if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required'
        isValid = false
    } else if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Please enter a valid phone number'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return
    emit('submit', { ...formData })
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div
            class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto animate-scale-in">
            <!-- Header -->
            <div class="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                <button @click="emit('close')"
                    class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Close">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>

                <h2 class="text-2xl font-bold mb-2">Enroll in Course</h2>
                <p class="text-blue-100">{{ courseDetail.course.courseName }}</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-8 pb-12">
                <div class="space-y-6">
                    <div v-if="props.submitError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {{ props.submitError }}
                    </div>

                    <!-- Name Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- First Name -->
                        <div>
                            <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">
                                First Name <span class="text-red-500">*</span>
                            </label>
                            <input id="firstName" v-model="formData.firstName" type="text" :class="[
                                'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all',
                                errors.firstName
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            ]" placeholder="John" />
                            <p v-if="errors.firstName" class="mt-1.5 text-sm text-red-600">{{ errors.firstName }}</p>
                        </div>

                        <!-- Last Name -->
                        <div>
                            <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name <span class="text-red-500">*</span>
                            </label>
                            <input id="lastName" v-model="formData.lastName" type="text" :class="[
                                'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all',
                                errors.lastName
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            ]" placeholder="Doe" />
                            <p v-if="errors.lastName" class="mt-1.5 text-sm text-red-600">{{ errors.lastName }}</p>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i class="fa-solid fa-envelope text-gray-400"></i>
                            </div>
                            <input id="email" v-model="formData.email" type="email" :class="[
                                'w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all',
                                errors.email
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            ]" placeholder="john.doe@example.com" />
                        </div>
                        <p v-if="errors.email" class="mt-1.5 text-sm text-red-600">{{ errors.email }}</p>
                    </div>

                    <!-- Phone -->
                    <div>
                        <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i class="fa-solid fa-phone text-gray-400"></i>
                            </div>
                            <input id="phone" v-model="formData.phone" type="tel" :class="[
                                'w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all',
                                errors.phone
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            ]" placeholder="+234 801 234 5678" />
                        </div>
                        <p v-if="errors.phone" class="mt-1.5 text-sm text-red-600">{{ errors.phone }}</p>
                    </div>

                    <!-- Terms -->
                    <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                        <i class="fa-solid fa-info-circle text-blue-600 mt-0.5"></i>
                        <p class="text-sm text-gray-700">
                            By enrolling, you agree to our Terms of Service and Privacy Policy.
                            You will receive course updates and important notifications via email.
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 mt-8">
                    <button type="button" @click="emit('close')"
                        class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" :disabled="props.isSubmitting" :class="[
                        'flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
                        props.isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-xl hover:scale-105'
                    ]">
                        <i v-if="props.isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                        <span v-else>{{ mode === 'reserve' ? 'Reserve Seat' : 'Proceed to Payment' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
    animation: scale-in 0.3s ease-out;
}
</style>
