export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string | null;
  birthDate?: string | null;
  phone?: string | null;
}

export interface AuthPayload {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  [key: string]: unknown;
}
