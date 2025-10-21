import axios from "axios";
import { API_BASE_URL } from "../constants/endpoints";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

// Tạo instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Nếu backend cần gửi cookie
});

// Interceptor: gắn token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const timeExpMs = decoded.exp * 1000;

        // Kiểm tra token hết hạn
        if (Date.now() > timeExpMs) {
          localStorage.removeItem("token");
          Navigate({ to: "/auth/login", replace: true });
          throw new Error("Token expired");
        }

        // Token hợp lệ, gắn vào header
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem("token");
        Navigate({ to: "/auth/login", replace: true });
        throw new Error(error as string);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout(); // automatically clear auth
    }
    return Promise.reject(error);
  }
);

export default api;
