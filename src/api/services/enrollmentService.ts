import { apiRequest } from "../client";
import type { PaymentPayload, PaymentResponse, ReservePayload } from "../models";

export const enrollmentService = {
  async makePayment(payload: PaymentPayload, signal?: AbortSignal) {
    const response = await apiRequest<PaymentResponse>('learning/cohorts/enrollments/checkout', {
      method: "POST",
      signal,
      body: payload,
    });
    return response.data;
  },

  async reserve(payload: ReservePayload, signal?: AbortSignal) {
    const response = await apiRequest<boolean>('learning/cohorts/enrollments/reserve', {
      method: "POST",
      signal,
      body: payload,
    });
    return response.data;
  },

  async paymentStatus(reference: string, signal?: AbortSignal) {
    const response = await apiRequest<boolean>(`learning/cohorts/enrollments/checkout/${reference}/status`, {
      method: "GET",
      signal,
    });
    return response.data;
  }
};
