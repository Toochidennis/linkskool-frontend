import { apiRequest } from "../client";

export const courseService = {
    async getUserLearningStats(profileId: number, signal?: AbortSignal) {
        const response = await apiRequest(`learning/profiles/${profileId}/stats`, {
            method: "GET",
            signal,
        });
        return response.data;
    },
}