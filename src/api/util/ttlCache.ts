export interface TtlCacheOptions {
  /** How long an entry stays fresh, in milliseconds. */
  ttlMs: number
  /** Upper bound on stored entries; the oldest is evicted first. */
  maxEntries?: number
}

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const copy = <T>(value: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T)

/**
 * Small in-memory cache with per-entry expiry.
 *
 * Entries are copied in and out, so a caller mutating what it received — or
 * Vue wrapping it in a reactive proxy — can never write back into the cache.
 */
export class TtlCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>()
  private readonly ttlMs: number
  private readonly maxEntries: number

  constructor({ ttlMs, maxEntries = 50 }: TtlCacheOptions) {
    this.ttlMs = ttlMs
    this.maxEntries = maxEntries
  }

  get(key: string): T | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key)
      return undefined
    }

    return copy(entry.value)
  }

  /** Stores a copy, so the value the caller keeps is theirs to mutate. */
  set(key: string, value: T): void {
    this.prune()
    this.entries.delete(key)
    this.entries.set(key, { value: copy(value), expiresAt: Date.now() + this.ttlMs })

    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next()
      if (oldest.done) break
      this.entries.delete(oldest.value)
    }
  }

  delete(key: string): void {
    this.entries.delete(key)
  }

  clear(): void {
    this.entries.clear()
  }

  private prune(): void {
    const now = Date.now()
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key)
    }
  }
}
