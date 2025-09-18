import api from "./api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";

export const loginWithGoogle = async (token: string) => {
  const res = await api.post(AUTH_ENDPOINTS.GOOGLE, { token });
  return res.data;
};

export const loginWithEmail = async (email: string, password: string) => {
  const res = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
  return res.data;
};

export const register = async (data: { email: string; password: string }) => {
  const res = await api.post(AUTH_ENDPOINTS.REGISTER, data);
  return res.data;
};
