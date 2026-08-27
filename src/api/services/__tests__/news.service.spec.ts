import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.fn()
vi.mock('../../client', () => ({ apiRequest: (...args: unknown[]) => apiRequest(...args) }))

const { newsService } = await import('../news.service')

const listPayload = { data: { categories: {}, news: [] }, meta: { total: 0 } }
const detailPayload = { news: { id: 1, slug: 'a' }, more: [] }

describe('newsService caching', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    apiRequest.mockReset()
    newsService.clearCache()
  })
  afterEach(() => vi.useRealTimers())

  it('fetches a page once and serves repeats from cache', async () => {
    apiRequest.mockResolvedValue({ data: listPayload })

    await newsService.getAllNews({ page: 1, limit: 25 })
    await newsService.getAllNews({ page: 1, limit: 25 })

    expect(apiRequest).toHaveBeenCalledTimes(1)
  })

  it('treats each page as its own entry', async () => {
    apiRequest.mockResolvedValue({ data: listPayload })

    await newsService.getAllNews({ page: 1, limit: 25 })
    await newsService.getAllNews({ page: 2, limit: 25 })

    expect(apiRequest).toHaveBeenCalledTimes(2)
  })

  it('refetches once the 10 minute ttl expires', async () => {
    apiRequest.mockResolvedValue({ data: listPayload })

    await newsService.getAllNews({ page: 1 })
    vi.advanceTimersByTime(10 * 60 * 1000 + 1)
    await newsService.getAllNews({ page: 1 })

    expect(apiRequest).toHaveBeenCalledTimes(2)
  })

  it('caches articles by slug', async () => {
    apiRequest.mockResolvedValue({ data: detailPayload })

    await newsService.getNewsBySlug('a')
    await newsService.getNewsBySlug('a')
    await newsService.getNewsBySlug('b')

    expect(apiRequest).toHaveBeenCalledTimes(2)
  })

  it('still reports AbortError on a cache hit for an aborted caller', async () => {
    apiRequest.mockResolvedValue({ data: detailPayload })
    await newsService.getNewsBySlug('a')

    const controller = new AbortController()
    controller.abort()

    await expect(newsService.getNewsBySlug('a', controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    })
    expect(apiRequest).toHaveBeenCalledTimes(1)
  })

  it('does not cache a failed request', async () => {
    apiRequest.mockRejectedValueOnce(new Error('boom'))
    await expect(newsService.getAllNews({ page: 1 })).rejects.toThrow('boom')

    apiRequest.mockResolvedValue({ data: listPayload })
    await newsService.getAllNews({ page: 1 })

    expect(apiRequest).toHaveBeenCalledTimes(2)
  })
})
