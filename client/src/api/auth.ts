import { apiClient } from "./client";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    photoUrl?: string;
  };
}

export async function sendOtp(email: string) {
  const { data } = await apiClient.post("/auth/send-otp", { email });
  return data;
}

export async function loginWithEmail(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function registerWithEmail(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  otp: string;
}) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/google", { idToken });
  return data;
}
