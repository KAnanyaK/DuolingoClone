export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  (typeof window !== "undefined" ? "" : "http://localhost:8000");
