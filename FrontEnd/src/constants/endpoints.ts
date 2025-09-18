export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GOOGLE: "/auth/google",
};

export const USER_ENDPOINTS = {
  PROFILE: "/users/me",
};
