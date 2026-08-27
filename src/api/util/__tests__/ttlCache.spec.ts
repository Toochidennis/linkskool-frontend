import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TtlCache } from '../ttlCache'

describe('TtlCache', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('serves a value while it is fresh and drops it once the ttl passes', () => {
    const cache = new TtlCache<{ n: number }>({ ttlMs: 10_000 })
    cache.set('k', { n: 1 })

    vi.advanceTimersByTime(9_999)
    expect(cache.get('k')).toEqual({ n: 1 })

    vi.advanceTimersByTime(2)
    expect(cache.get('k')).toBeUndefined()
  })

  it('isolates stored values from later mutation by the caller', () => {
    const cache = new TtlCache<{ items: number[] }>({ ttlMs: 10_000 })
    const original = { items: [1, 2] }

    cache.set('k', original)
    original.items.push(3)
    expect(cache.get('k')).toEqual({ items: [1, 2] })

    const first = cache.get('k')!
    first.items.push(99)
    expect(cache.get('k')).toEqual({ items: [1, 2] })
  })

  it('evicts the oldest entry past maxEntries', () => {
    const cache = new TtlCache<number>({ ttlMs: 10_000, maxEntries: 2 })
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('clears everything on demand', () => {
    const cache = new TtlCache<number>({ ttlMs: 10_000 })
    cache.set('a', 1)
    cache.clear()
    expect(cache.get('a')).toBeUndefined()
  })
})
