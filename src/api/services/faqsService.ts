import { apiRequest } from "../client";
import type { Faqs } from "../models";

export const faqsService = {
    async getFaqs(signal?: AbortSignal) {
        const response = await apiRequest<Faqs[]>('faqs', {
            method: "GET",
            signal,
        });
        return response.data;
    },
};
