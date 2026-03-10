import { apiRequest } from "../client";
import type { PaymentPayload, ReservePayload } from "../models";

export const enrollmentService = {
    async makePayment(payload: PaymentPayload, signal?: AbortSignal) {
        const response = await apiRequest('learning/cohorts/enrollments/checkout', {
            method: "POST",
            signal,
            body: payload,
        });
        return response.data;
    },

    async reserve(payload: ReservePayload, signal?: AbortSignal) {
        const response = await apiRequest('learning/cohorts/enrollments/reserve', {
            method: "POST",
            signal,
            body: payload,
        });
        return response.data;
    },
};
