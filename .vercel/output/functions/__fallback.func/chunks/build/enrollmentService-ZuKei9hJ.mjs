import { a as apiRequest } from './client-DcOxoYBd.mjs';

const enrollmentService = {
  async makePayment(payload, signal) {
    const response = await apiRequest("learning/cohorts/enrollments/checkout", {
      method: "POST",
      signal,
      body: payload
    });
    return response.data;
  },
  async reserve(payload, signal) {
    const response = await apiRequest("learning/cohorts/enrollments/reserve", {
      method: "POST",
      signal,
      body: payload
    });
    return response.data;
  },
  async freeEnrollment(payload, signal) {
    const response = await apiRequest("learning/cohorts/enrollments/free", {
      method: "POST",
      signal,
      body: payload
    });
    return response.data;
  },
  async paymentStatus(reference, signal) {
    const response = await apiRequest(`learning/cohorts/enrollments/checkout/${reference}/status`, {
      method: "GET",
      signal
    });
    return response.data;
  }
};

export { enrollmentService as e };
//# sourceMappingURL=enrollmentService-ZuKei9hJ.mjs.map
