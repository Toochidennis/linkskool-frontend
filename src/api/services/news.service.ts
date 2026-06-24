import { apiRequest } from "../client";

export const newsService = {
    async getAllNews(signal?: AbortSignal) {
        const response = await apiRequest('news/list', {
            method: "GET",
            signal: signal,
        });
        return response.data;
    },
}
