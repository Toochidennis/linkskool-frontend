<script setup lang="ts">
import { computed } from 'vue'

/**
 * Where someone is in Register now: 1 Register, 2 Pay, 3 Start learning.
 * `current` is the step in progress; earlier ones show as done. Paying later
 * leaves step 2 open with a "Pay later" note while they move on to step 3.
 */
const props = withDefaults(
  defineProps<{ current: 1 | 2 | 3; payment?: 'due' | 'later' | 'done' | 'free' }>(),
  { payment: 'due' },
)

const steps = computed(() => [
  { n: 1, label: 'Register', note: 'Your details' },
  {
    n: 2,
    label: props.payment === 'free' ? 'Free course' : 'Pay',
    note:
      props.payment === 'done'
        ? 'Paid'
        : props.payment === 'free'
          ? 'Nothing to pay'
          : props.payment === 'later'
            ? 'Pay later'
            : 'Secure your seat',
  },
  { n: 3, label: 'Start learning', note: 'Join and get set up' },
])

const state = (n: number) => {
  if (n === 2 && props.payment === 'later') return 'pending'
  if (n === 2 && (props.payment === 'done' || props.payment === 'free')) return 'done'
  if (n < props.current) return 'done'
  return n === props.current ? 'current' : 'upcoming'
}
</script>

<template>
  <ol class="flex w-full items-start" aria-label="Registration progress">
    <li
      v-for="(step, i) in steps"
      :key="step.n"
      class="relative flex flex-1 flex-col items-center text-center"
      :aria-current="state(step.n) === 'current' ? 'step' : undefined"
    >
      <span
        v-if="i > 0"
        class="absolute right-1/2 top-[1.0625rem] h-0.5 w-full -translate-y-1/2"
        :class="state(step.n) === 'upcoming' ? 'bg-slate-200' : 'bg-brand'"
        aria-hidden="true"
      ></span>
      <span
        class="relative z-10 flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full text-sm font-semibold ring-4 ring-white transition-colors"
        :class="{
          'bg-brand text-white': state(step.n) === 'done' || state(step.n) === 'current',
          'bg-orange-50 text-orange-600 border border-orange-200': state(step.n) === 'pending',
          'border border-slate-300 bg-white text-slate-400': state(step.n) === 'upcoming',
        }"
      >
        <i v-if="state(step.n) === 'done'" class="fa-solid fa-check text-xs"></i>
        <i v-else-if="state(step.n) === 'pending'" class="fa-solid fa-clock text-xs"></i>
        <template v-else>{{ step.n }}</template>
      </span>
      <span
        class="mt-2 text-sm font-semibold"
        :class="state(step.n) === 'upcoming' ? 'text-slate-400' : 'text-slate-900'"
        >{{ step.label }}</span
      >
      <span
        class="text-xs"
        :class="state(step.n) === 'pending' ? 'text-orange-600' : 'text-slate-500'"
        >{{ step.note }}</span
      >
    </li>
  </ol>
</template>
