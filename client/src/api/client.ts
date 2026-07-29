import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// The backend root (without the /api suffix) — used to resolve relative
// upload paths like "/uploads/cover-123.jpg" into full, loadable URLs
const SERVER_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  // Paths starting with /images/ are served by the frontend itself (client/public)
  if (path.startsWith("/images/")) return path;
  // Everything else (e.g. /uploads/...) comes from the backend
  return `${SERVER_ROOT}${path}`;
}

// Attach JWT token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("cyberspice_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
