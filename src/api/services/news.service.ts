import { apiRequest } from "../client";
import type { GetNewsOptions, NewsDetailPayload, NewsListPayload } from "../models/news";

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

        const response = await apiRequest<NewsListPayload>(`news/list${query ? `?${query}` : ''}`, {
            method: "GET",
            signal: options.signal,
        });
        return response.data;
    },
    async getNewsBySlug(slug: string, signal?: AbortSignal) {
        const response = await apiRequest<NewsDetailPayload>(`news/slug/${slug}`, {
            method: "GET",
            signal: signal,
        });
        return response.data;
    },
}
