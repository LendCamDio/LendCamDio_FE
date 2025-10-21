import api from "./api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
} from "@/types/entity.type";
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
}: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
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

export const logout = async (): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(AUTH_ENDPOINTS.LOGOUT);
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

export const changePassword = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      { oldPassword, newPassword }
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

export const verifyEmail = async (
  email: string,
  token: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.get<ApiResponse<object>>(
      AUTH_ENDPOINTS.VERIFY_EMAIL,
      {
        params: { email, token },
      }
    );
    if (!res.data.success) {
      throw new Error(res.data.error?.message || "Xác thực email thất bại");
    }
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};
