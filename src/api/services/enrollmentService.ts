import { apiRequest } from "../client";
import type {
  PaymentPayload,
  PaymentResponse,
  RegisterPayload,
  RegisterResult,
  Registration,
  RegistrationCheckout,
  ReservePayload,
} from "../models";

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

  /** Register now: details in, a place held, and the registration's token back. */
  async register(payload: RegisterPayload, signal?: AbortSignal) {
    const response = await apiRequest<RegisterResult>('learning/cohorts/enrollments/register', {
      method: "POST",
      signal,
      body: payload,
    });
    return response.data;
  },

  async registration(token: string, signal?: AbortSignal) {
    const response = await apiRequest<Registration>(
      `learning/cohorts/enrollments/registrations/${encodeURIComponent(token)}`,
      { method: "GET", signal },
    );
    return response.data;
  },

  /** A fresh checkout for an unpaid registration. */
  async registrationCheckout(token: string, callbackUrl: string, signal?: AbortSignal) {
    const response = await apiRequest<RegistrationCheckout>(
      `learning/cohorts/enrollments/registrations/${encodeURIComponent(token)}/checkout`,
      { method: "POST", signal, body: { callbackUrl } },
    );
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
