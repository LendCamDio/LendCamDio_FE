/* eslint-disable @typescript-eslint/no-unused-vars */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
  // Email/Password Authentication
  LOGIN: "/auth/signin",
  ADMIN_LOGIN: "/auth/admin/signin",
  SUPPLIER_LOGIN: "/auth/supplier/signin",
  // Google Authentication
  LOGIN_GOOGLE: "/auth/signin-google",
  ADMIN_LOGIN_GOOGLE: "/auth/admin/signin-google",
  SUPPLIER_LOGIN_GOOGLE: "/auth/supplier/signin-google",
  // Registration
  REGISTER: "/auth/register",
  REGISTER_GOOGLE: "/auth/register-google",
  // User Actions
  LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",
  VERIFY_EMAIL: (_email: string, _token: string) => `/auth/verify-email`,
};

export const AI_ENDPOINTS = {
  CHAT: "/api/ai/chat",
  GENERATE_RECOMMENDATIONS: (customerId: string) =>
    `/api/ai/generate-recommendations/${customerId}`,
  GENERATE_RECOMMENDATIONS_BY_CATEGORY: (
    customerId: string,
    categoryName: string
  ) =>
    `/api/ai/generate-recommendations/${customerId}/category/${categoryName}`,
  RATE_RECOMMENDATION: "/api/ai/rate-recommendation",
  RECOMMEND: (customerId: string) => `/api/ai/recommend/${customerId}`,
};

export const USER_ENDPOINTS = {
  LIST: "/users",
  DETAILED_LIST: "/users/detailed",
  DETAILS: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  DETAILED_PROFILE: (id: string) => `/users/${id}/detailed`,
  PROFILE: "/users/profile",
  PROFILE_DETAILED: "/users/profile/detailed",
  ACTIVE: "/users/active",
  SEARCH: "/users/search",
  UPDATE_AVATAR: (id: string) => `/users/${id}/avatar`,
  UPDATE_STATUS: (id: string) => `/users/${id}/status`,
  DEBUG_CLAIMS: "/users/debug/claims",
};

export const EQUIPMENT_ENDPOINTS = {
  LIST: "/equipments",
  AVAILABLE: "/equipments/available",
  DETAILS: (id: string) => `/equipments/${id}`,
  CREATE: "/equipments",
  UPDATE: (id: string) => `/equipments/${id}`,
  DELETE: (id: string) => `/equipments/${id}`,
  SEARCH: "/equipments/search",
  CATEGORY: (category: string) => `/equipments/category/${category}`,
  SUPPLIER: (supplierId: string) => `/equipments/supplier/${supplierId}`,
  CONDITION: (condition: string) => `/equipments/condition/${condition}`,
  PRICE_RANGE: "/equipments/price-range",
  AVAILABILITY: (id: string) => `/equipments/${id}/availability`,
  STOCK: (id: string) => `/equipments/${id}/stock`,
};

export const EQUIPMENT_CATEGORY_ENDPOINTS = {
  LIST: "/equipment-categories",
  ACTIVE: "/equipment-categories/active",
  DETAILS: (id: string) => `/equipment-categories/${id}`,
  CREATE: "/equipment-categories",
  UPDATE: (id: string) => `/equipment-categories/${id}`,
  DELETE: (id: string) => `/equipment-categories/${id}`,
  ROOT: "/equipment-categories/root",
  CHILDREN: (parentId: string) => `/equipment-categories/${parentId}/children`,
  HIERARCHY: (id: string) => `/equipment-categories/${id}/hierarchy`,
  HAS_CHILDREN: (id: string) => `/equipment-categories/${id}/has-children`,
  SEARCH: "/equipment-categories/search",
  STATUS: (status: string) => `/equipment-categories/status/${status}`,
  CAN_DELETE: (id: string) => `/equipment-categories/${id}/can-delete`,
  VALIDATE_PARENT: (categoryId: string) =>
    `/equipment-categories/${categoryId}/validate-parent`,
};

export const EQUIPMENT_IMAGE_ENDPOINTS = {
  LIST: "/equipment-images",
  DETAILS: (id: string) => `/equipment-images/${id}`,
  CREATE: "/equipment-images",
  UPDATE: (id: string) => `/equipment-images/${id}`,
  DELETE: (id: string) => `/equipment-images/${id}`,
  BY_EQUIPMENT: (equipmentId: string) =>
    `/equipment-images/equipment/${equipmentId}`,
  PRIMARY: (equipmentId: string) =>
    `/equipment-images/equipment/${equipmentId}/primary`,
  TYPE: (type: string) => `/equipment-images/type/${type}`,
  SET_PRIMARY: (id: string) => `/equipment-images/${id}/set-primary`,
  STATUS: (id: string) => `/equipment-images/${id}/status`,
  BELONGS_TO: (imageId: string, equipmentId: string) =>
    `/equipment-images/${imageId}/belongs-to/${equipmentId}`,
  UPLOAD: "/equipment-images/upload",
};

export const REVIEW_ENDPOINTS = {
  LIST: "/reviews",
  COUNT_BY_EQUIPMENT: (equipmentId: string) =>
    `/reviews/equipment/${equipmentId}/review-count`,
  AVERAGE_RATING_BY_EQUIPMENT: (equipmentId: string) =>
    `/reviews/equipment/${equipmentId}/average-rating`,
};
