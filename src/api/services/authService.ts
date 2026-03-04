import { apiRequest } from "../client";
import type { User } from "../models/user";

export const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_SCOPE = "openid email profile";

const buildAuthUrl = () => {
  const base = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_SCOPE,
    include_granted_scopes: "true",
    access_type: "offline",
    prompt: "consent",
  });
  return `${base}?${params.toString()}`;
};

export const authService = {
  getGoogleAuthUrl: buildAuthUrl,
  async exchangeGoogleToken(code: string) {
    const response = await apiRequest<AuthPayload>("cbt/users/google", {
      method: "POST",
      body: { google_token: code },
    });
    return response.data;
  },

  async loginWithEmail(email: string, password: string) {
    const response = await apiRequest<AuthPayload>("cbt/users/login", {
      method: "POST",
      body: { email, password },
    });
    return response.data;
  },

  async registerWithEmail(user: User) {
    const response = await apiRequest<AuthPayload>("cbt/users/signup", {
      method: "POST",
      body: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        gender: user.gender,
        birthDate: user.birthDate,
        phone: user.phone
      },
    });
    return response.data;
  },
};
