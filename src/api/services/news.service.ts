import { apiRequest } from "../client";
import type { GetNewsOptions, NewsDetailPayload, NewsListPayload } from "../models/news";
import { TtlCache } from "../util/ttlCache";

/** News is published a few times a day at most, so serve it from memory for a while. */
const NEWS_TTL_MS = 10 * 60 * 1000;

const listCache = new TtlCache<NewsListPayload>({ ttlMs: NEWS_TTL_MS, maxEntries: 20 });
const detailCache = new TtlCache<NewsDetailPayload>({ ttlMs: NEWS_TTL_MS, maxEntries: 40 });

/**
 * A cache hit skips the network, so it would otherwise resolve for a caller
 * that has already torn down. Callers treat AbortError as "ignore this" —
 * keep that contract.
 */
const throwIfAborted = (signal?: AbortSignal) => {
    if (signal?.aborted) {
        throw new DOMException("The operation was aborted.", "AbortError");
    }
};

export const newsService = {
    async getAllNews(options: GetNewsOptions = {}) {
        const params = new URLSearchParams();

        if (options.page) {
            params.set('page', String(options.page));
        }

        if (options.limit) {
            params.set('limit', String(options.limit));
        }

        const query = params.toString();
        const cacheKey = query || 'default';

        const cached = listCache.get(cacheKey);
        if (cached) {
            throwIfAborted(options.signal);
            return cached;
        }

        const response = await apiRequest<NewsListPayload>(`news/list${query ? `?${query}` : ''}`, {
            method: "GET",
            signal: options.signal,
        });

        listCache.set(cacheKey, response.data);
        return response.data;
    },

    async getNewsBySlug(slug: string, signal?: AbortSignal) {
        const cached = detailCache.get(slug);
        if (cached) {
            throwIfAborted(signal);
            return cached;
        }

        const response = await apiRequest<NewsDetailPayload>(`news/slug/${slug}`, {
            method: "GET",
            signal: signal,
        });

        detailCache.set(slug, response.data);
        return response.data;
    },

    /** Drops every cached page and article — call after publishing. */
    clearCache() {
        listCache.clear();
        detailCache.clear();
    },
};
