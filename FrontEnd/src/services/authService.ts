import api from "./api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type { ApiResponse, AuthResponse } from "@/types/entity.type";
import { handleApiError } from "./apiErrorHandler";

export const loginWithGoogle = async (
  idToken: string,
  userType: "Customer" | "Supplier" | "Admin"
): Promise<ApiResponse<AuthResponse>> => {
  try {
    let res;
    switch (userType) {
      case "Customer":
        res = await api.post<ApiResponse<AuthResponse>>(
          AUTH_ENDPOINTS.LOGIN_GOOGLE,
          { idToken }
        );
        break;
      case "Supplier":
        res = await api.post<ApiResponse<AuthResponse>>(
          AUTH_ENDPOINTS.SUPPLIER_LOGIN_GOOGLE,
          { idToken }
        );
        break;
      case "Admin":
        res = await api.post<ApiResponse<AuthResponse>>(
          AUTH_ENDPOINTS.ADMIN_LOGIN_GOOGLE,
          { idToken }
        );
        break;
      default:
        throw new Error("Invalid user type");
    }
    return res.data;
  } catch (error) {
    return handleApiError<AuthResponse>(error);
  }
};

export const loginWithEmail = async (
  email: string,
  password: string,
  userType: "Customer" | "Supplier" | "Admin" = "Customer"
): Promise<ApiResponse<AuthResponse>> => {
  try {
    let res;
    switch (userType) {
      case "Customer":
        res = await api.post<ApiResponse<AuthResponse>>(AUTH_ENDPOINTS.LOGIN, {
          email,
          password,
        });
        break;
      case "Supplier":
        res = await api.post<ApiResponse<AuthResponse>>(
          AUTH_ENDPOINTS.SUPPLIER_LOGIN,
          { email, password }
        );
        break;
      case "Admin":
        res = await api.post<ApiResponse<AuthResponse>>(
          AUTH_ENDPOINTS.ADMIN_LOGIN,
          { email, password }
        );
        break;
      default:
        throw new Error("Invalid user type");
    }
    return res.data;
  } catch (error) {
    return handleApiError<AuthResponse>(error);
  }
};

export const registerWithEmail = async ({
  fullName,
  email,
  password,
  phone,
}: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}): Promise<ApiResponse<AuthResponse>> => {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      { fullName, email, password, phone }
    );
    return res.data;
  } catch (error) {
    return handleApiError<AuthResponse>(error);
  }
};

export const registerWithGoogle = async (
  idToken: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>(
      AUTH_ENDPOINTS.REGISTER_GOOGLE,
      { idToken }
    );
    return res.data;
  } catch (error) {
    return handleApiError<AuthResponse>(error);
  }
};
