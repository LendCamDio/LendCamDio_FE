import api from "./api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";

export const loginWithGoogle = async (idToken: string) => {
  const res = await api.post(AUTH_ENDPOINTS.GOOGLE, { idToken });
  return res.data;
};

export const loginWithEmail = async (email: string, password: string) => {
  const res = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
  return res.data;
};

export const registerWithGoogle = async (idToken: string) => {
  const res = await api.post(AUTH_ENDPOINTS.REGISTER_GOOGLE, { idToken });
  return res.data;
};
