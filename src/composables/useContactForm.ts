import { computed, reactive, ref } from 'vue'

const supportEmail = 'support@linkskool.com'

interface ContactFormState {
  name: string
  email: string
  reason: string
  message: string
}

export const useContactForm = () => {
  const form = reactive<ContactFormState>({
    name: '',
    email: '',
    reason: 'Enrollment',
    message: '',
  })

  const errors = reactive<Partial<Record<keyof ContactFormState, string>>>({})
  const hasSubmitted = ref(false)

  const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))

  const validate = () => {
    errors.name = ''
    errors.email = ''
    errors.reason = ''
    errors.message = ''

    if (!form.name.trim()) {
      errors.name = 'Enter your name'
    }

    if (!form.email.trim()) {
      errors.email = 'Enter your email'
    } else if (!isEmailValid.value) {
      errors.email = 'Enter a valid email'
    }

    if (!form.reason.trim()) {
      errors.reason = 'Choose a reason'
    }

    if (form.message.trim().length < 10) {
      errors.message = 'Tell us a little more'
    }

    return !errors.name && !errors.email && !errors.reason && !errors.message
  }

  const submit = () => {
    hasSubmitted.value = true

    if (!validate()) {
      return
    }

    const subject = encodeURIComponent(`${form.reason} - ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\nReason: ${form.reason}\n\n${form.message.trim()}`,
    )

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
  }

  return {
    errors,
    form,
    hasSubmitted,
    submit,
  }
}
