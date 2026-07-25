import { apiClient } from "./client";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
}) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/google", { idToken });
  return data;
}