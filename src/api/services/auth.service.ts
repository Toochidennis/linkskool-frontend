import { apiRequest } from "../client";
import type { ResetPasswordPayload } from "../models";

export const authService = {
    async resetPassword(payload: ResetPasswordPayload, signal?: AbortSignal) {
        const response = await apiRequest<boolean>('cbt/users/reset-password', {
          method: "POST",
          signal,
          body: payload,
        });
        return response.data;
      },
};
