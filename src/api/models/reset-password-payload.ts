export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
