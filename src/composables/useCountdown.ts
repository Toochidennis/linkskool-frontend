import { computed, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export interface CountdownSegment {
  label: string
  value: number
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Ticks once a second toward `target`, and stops itself the moment there is
 * nothing left to count — so a page with no deadline never holds a timer.
 */
export function useCountdown(target: MaybeRefOrGetter<Date | null | undefined>) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  const stop = () => {
    if (timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  }

  const start = () => {
    if (timer === undefined) {
      timer = setInterval(() => {
        now.value = Date.now()
      }, SECOND)
    }
  }

  const remaining = computed(() => {
    const date = toValue(target)
    if (!date) return null
    return Math.max(0, date.getTime() - now.value)
  })

  const isRunning = computed(() => remaining.value !== null && remaining.value > 0)
  const hasExpired = computed(() => remaining.value !== null && remaining.value <= 0)

  watch(isRunning, (running) => (running ? start() : stop()), { immediate: true })
  onUnmounted(stop)

  const segments = computed<CountdownSegment[]>(() => {
    const ms = remaining.value ?? 0
    return [
      { label: 'Days', value: Math.floor(ms / DAY) },
      { label: 'Hrs', value: Math.floor((ms % DAY) / HOUR) },
      { label: 'Mins', value: Math.floor((ms % HOUR) / MINUTE) },
      { label: 'Secs', value: Math.floor((ms % MINUTE) / SECOND) },
    ]
  })

  /**
   * Leading units that are still zero carry no information — drop them so a
   * deadline hours away reads "06 : 59 : 54" rather than "00 DAYS ...".
   * Minutes and seconds always survive.
   */
  const displaySegments = computed<CountdownSegment[]>(() => {
    const all = segments.value
    let start = 0
    while (start < all.length - 2 && all[start]!.value === 0) start += 1
    return all.slice(start)
  })

  /** One-line form for tight spaces, e.g. "2d 14h 35m 09s". */
  const compact = computed(() => {
    if (!isRunning.value) return ''
    const [days, hours, minutes, seconds] = segments.value.map((segment) => segment.value) as [
      number,
      number,
      number,
      number,
    ]
    const tail = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    return days > 0 ? `${days}d ${tail}` : tail
  })

  return { remaining, segments, displaySegments, compact, isRunning, hasExpired, pad }
}
