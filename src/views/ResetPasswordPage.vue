<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { authService } from '@/api/services/auth.service'

const route = useRoute()

const token = computed(() => {
  const raw = route.query.token
  return Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')
})

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const appLoginUrl =
  (import.meta.env.VITE_LINKSKOOL_APP_LOGIN_URL as string | undefined)?.trim() ||
  'https://linkskool.com/login?source=reset-password&status=success'

const submit = async () => {
  error.value = ''
  if (!newPassword.value) {
    error.value = 'Please enter a new password.'
    return
  }
  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await authService.resetPassword({
      token: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })
    success.value = true
  } catch {
    error.value = 'Failed to reset password. The link may have expired.'
  } finally {
    loading.value = false
  }
}

const goToAppLogin = () => {
  window.location.assign(appLoginUrl)
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-slate-50">
    <AppHeader />

    <!-- Hero banner -->
    <section class="border-b border-slate-200 bg-white pb-10 pt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="mb-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Reset your password</h1>
        <p class="mx-auto max-w-xl text-lg text-slate-600">
          Choose a strong new password to secure your account.
        </p>
      </div>
    </section>

    <!-- Card -->
    <section class="py-16 px-4">
      <div class="max-w-md mx-auto">

        <!-- Success -->
        <div v-if="success" class="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i class="fa-solid fa-shield-halved text-green-600 text-2xl"></i>
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Password updated!</h2>
          <p class="text-slate-600 mb-8">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <button
            class="btn btn-primary btn-block"
            @click="goToAppLogin">
            Open App to Login
          </button>
        </div>

        <!-- Form -->
        <div v-else class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-brand-soft rounded-xl flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-lock-open text-brand text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">Set a new password</h2>
            <p class="text-slate-500 mt-1 text-sm">Enter and confirm your new password below.</p>
          </div>

          <form @submit.prevent="submit" novalidate>
            <!-- New password -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-slate-700 mb-1.5" for="new-password">
                New password
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <i class="fa-solid fa-lock text-sm"></i>
                </span>
                <input id="new-password" v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                  autocomplete="new-password" placeholder="Min. 8 characters"
                  class="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent text-slate-900 placeholder-slate-400 transition" />
                <button type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  @click="showNewPassword = !showNewPassword">
                  <i :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Confirm password -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1.5" for="confirm-password">
                Confirm password
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <i class="fa-solid fa-lock text-sm"></i>
                </span>
                <input id="confirm-password" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password" placeholder="Repeat your password"
                  class="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent text-slate-900 placeholder-slate-400 transition" />
                <button type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-sm text-red-600 mb-4 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ error }}
            </p>

            <button type="submit" :disabled="loading"
              class="btn btn-primary btn-block">
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-circle-notch animate-spin"></i>
                Resetting…
              </span>
              <span v-else>Reset Password</span>
            </button>
          </form>
        </div>

      </div>
    </section>

    <AppFooter />
  </div>
</template>
