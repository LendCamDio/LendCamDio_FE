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
  VERIFY_EMAIL: `/auth/verify-email`,
};

export const AI_ENDPOINTS = {
  CHAT: "/ai/chat",
  GENERATE_RECOMMENDATIONS: (customerId: string) =>
    `/ai/generate-recommendations/${customerId}`,
  GENERATE_RECOMMENDATIONS_BY_CATEGORY: (
    customerId: string,
    categoryName: string
  ) => `/ai/generate-recommendations/${customerId}/category/${categoryName}`,
  RATE_RECOMMENDATION: "/ai/rate-recommendation",
  RECOMMEND: (customerId: string) => `/ai/recommend/${customerId}`,
};

export const USER_ENDPOINTS = {
  // GET /api/users
  LIST: "/users",
  // GET /api/users/detailed
  DETAILED_LIST: "/users/detailed",
  // GET /api/users/{id}
  DETAILS: (id: string | number) => `/users/${id}`,
  // PUT /api/users/{id}
  UPDATE: (id: string | number) => `/users/${id}`,
  // DELETE /api/users/{id}
  DELETE: (id: string | number) => `/users/${id}`,
  // GET /api/users/{id}/detailed
  DETAILED_PROFILE_BY_ID: (id: string | number) => `/users/${id}/detailed`, // Renamed for clarity vs. PROFILE
  // GET /api/users/profile
  PROFILE: "/users/profile",
  // GET /api/users/profile/detailed
  PROFILE_DETAILED: "/users/profile/detailed",
  // GET /api/users/active
  ACTIVE: "/users/active",
  // GET /api/users/search?email={email}
  SEARCH: "/users/search",
  // PATCH /api/users/{id}/avatar
  UPDATE_AVATAR: (id: string | number) => `/users/${id}/avatar`,
  // PUT /api/users/{id}/status
  UPDATE_STATUS: (id: string | number) => `/users/${id}/status`,
  // GET /api/users/debug/claims
  DEBUG_CLAIMS: "/users/debug/claims",
};

export const CUSTOMER_ENDPOINTS = {
  // GET /api/customers
  LIST: "/customers",
  // GET /api/customers/active
  ACTIVE_LIST: "/customers/active",
  // GET /api/customers/{id}
  DETAILS: (id: string) => `/customers/${id}`,
  // GET /api/customers/user/{userId}
  BY_USER_ID: (userId: string) => `/customers/user/${userId}`,
  // POST /api/customers
  CREATE: "/customers",
  // PUT /api/customers/{id}
  UPDATE: (id: string) => `/customers/${id}`,
  // DELETE /api/customers/{id}
  DELETE: (id: string) => `/customers/${id}`,
  // PATCH /api/customers/{id}/membership-level
  UPDATE_MEMBERSHIP_LEVEL: (id: string) => `/customers/${id}/membership-level`,
  // PATCH /api/customers/{id}/loyalty-points
  UPDATE_LOYALTY_POINTS: (id: string) => `/customers/${id}/loyalty-points`,
  // GET /api/customers/{id}/loyalty-points
  GET_LOYALTY_POINTS: (id: string) => `/customers/${id}/loyalty-points`,
  // PATCH /api/customers/{id}/status
  UPDATE_STATUS: (id: string) => `/customers/${id}/status`,
  // GET /api/customers/membership-level/{level}
  BY_MEMBERSHIP_LEVEL: (level: string) =>
    `/customers/membership-level/${level}`,
  // GET /api/customers/status/{status}
  BY_STATUS: (status: string) => `/customers/status/${status}`,
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

export const PAYMENT_ENDPOINTS = {
  // Base route
  ROOT: "/payments",
  // GET all
  LIST: "/payments",
  // GET by ID
  DETAILS: (id: string) => `/payments/${id}`,
  // GET by rentalId
  BY_RENTAL: (rentalId: string, page = 1, pageSize = 10) =>
    `/payments/rental/${rentalId}?page=${page}&pageSize=${pageSize}`,
  // GET by customerId
  BY_CUSTOMER: (customerId: string, page = 1, pageSize = 10) =>
    `/payments/customer/${customerId}?page=${page}&pageSize=${pageSize}`,
  // GET by status
  BY_STATUS: (status: string, page = 1, pageSize = 10) =>
    `/payments/status/${status}?page=${page}&pageSize=${pageSize}`,
  // GET by method
  BY_METHOD: (method: string, page = 1, pageSize = 10) =>
    `/payments/method/${method}?page=${page}&pageSize=${pageSize}`,
  // GET by date range
  BY_DATE_RANGE: (
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 10
  ) =>
    `/payments/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`,
  // POST create
  CREATE: "/payments",
  // PUT update
  UPDATE: (id: string) => `/payments/${id}`,
  // DELETE
  DELETE: (id: string) => `/payments/${id}`,
  // PATCH refund
  REFUND: (id: string) => `/payments/${id}/refund`,
  // GET total for period
  TOTAL_FOR_PERIOD: (startDate: string, endDate: string) =>
    `/payments/total-for-period?startDate=${startDate}&endDate=${endDate}`,
  // (Optional future) PATCH process, confirm, etc.
  // PROCESS: (id: string) => `/payments/${id}/process`,
  // CONFIRM: (id: string) => `/payments/${id}/confirm`,
  // PAYOS_CALLBACK: "/payments/payos/callback",
};

export const RENTAL_ENDPOINTS = {
  // 📜 CRUD
  GET_ALL: "/rentals",
  GET_BY_ID: (id: string) => `/rentals/${id}`,
  CREATE: "/rentals",
  UPDATE: (id: string) => `/rentals/${id}`,
  DELETE: (id: string) => `/rentals/${id}`,

  // 🧾 Filters / Queries
  GET_ACTIVE: "/rentals/active",
  GET_BY_CUSTOMER: (customerId: string) => `/rentals/customer/${customerId}`,
  GET_BY_EQUIPMENT: (equipmentId: string) =>
    `/rentals/equipment/${equipmentId}`,
  GET_BY_STATUS: (status: string) => `/rentals/status/${status}`,
  GET_BY_DATE_RANGE: "/rentals/date-range",
  CHECK_AVAILABILITY: "/rentals/check-availability",

  // ⚙️ Actions
  APPROVE: (id: string) => `/rentals/${id}/approve`,
  CANCEL: (id: string) => `/rentals/${id}/cancel`,
  COMPLETE: (id: string) => `/rentals/${id}/complete`,
};
