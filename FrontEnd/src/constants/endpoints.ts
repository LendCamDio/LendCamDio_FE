/* eslint-disable @typescript-eslint/no-unused-vars */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.lendcamdio.io.vn";

export const AUTH_ENDPOINTS = {
  // Email/Password Authentication
  LOGIN: "/api/auth/signin",
  ADMIN_LOGIN: "/api/auth/admin/signin",
  SUPPLIER_LOGIN: "/api/auth/supplier/signin",
  // Google Authentication
  LOGIN_GOOGLE: "/api/auth/signin-google",
  ADMIN_LOGIN_GOOGLE: "/api/auth/admin/signin-google",
  SUPPLIER_LOGIN_GOOGLE: "/api/auth/supplier/signin-google",
  // Registration
  REGISTER: "/api/auth/register",
  REGISTER_GOOGLE: "/api/auth/register-google",
  // User Actions
  LOGOUT: "/api/auth/logout",
  CHANGE_PASSWORD: "/api/auth/change-password",
  VERIFY_EMAIL: `/api/auth/verify-email`,
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
  // GET /api/users
  LIST: "/api/users",
  // GET /api/users/detailed
  DETAILED_LIST: "/api/users/detailed",
  // GET /api/users/{id}
  DETAILS: (id: string | number) => `/api/users/${id}`,
  // PUT /api/users/{id}
  UPDATE: (id: string | number) => `/api/users/${id}`,
  // DELETE /api/users/{id}
  DELETE: (id: string | number) => `/api/users/${id}`,
  // GET /api/users/{id}/detailed
  DETAILED_PROFILE_BY_ID: (id: string | number) => `/api/users/${id}/detailed`,
  // GET /api/users/profile
  PROFILE: "/api/users/profile",
  // GET /api/users/profile/detailed
  PROFILE_DETAILED: "/api/users/profile/detailed",
  // GET /api/users/active
  ACTIVE: "/api/users/active",
  // GET /api/users/search?email={email}
  SEARCH: "/api/users/search",
  // PATCH /api/users/{id}/avatar
  UPDATE_AVATAR: (id: string | number) => `/api/users/${id}/avatar`,
  // PUT /api/users/{id}/status
  UPDATE_STATUS: (id: string | number) => `/api/users/${id}/status`,
  // PUT /api/users/{id}/role
  UPDATE_ROLE: (id: string | number) => `/api/users/${id}/role`,
  // GET /api/users/debug/claims
  DEBUG_CLAIMS: "/api/users/debug/claims",
};

export const CUSTOMER_ENDPOINTS = {
  // GET /api/customers
  LIST: "/api/customers",
  // GET /api/customers/active
  ACTIVE_LIST: "/api/customers/active",
  // GET /api/customers/{id}
  DETAILS: (id: string) => `/api/customers/${id}`,
  // GET /api/customers/user/{userId}
  BY_USER_ID: (userId: string) => `/api/customers/user/${userId}`,
  // POST /api/customers
  CREATE: "/api/customers",
  // PUT /api/customers/{id}
  UPDATE: (id: string) => `/api/customers/${id}`,
  // DELETE /api/customers/{id}
  DELETE: (id: string) => `/api/customers/${id}`,
  // PATCH /api/customers/{id}/membership-level
  UPDATE_MEMBERSHIP_LEVEL: (id: string) =>
    `/api/customers/${id}/membership-level`,
  // PATCH /api/customers/{id}/loyalty-points
  UPDATE_LOYALTY_POINTS: (id: string) => `/api/customers/${id}/loyalty-points`,
  // GET /api/customers/{id}/loyalty-points
  GET_LOYALTY_POINTS: (id: string) => `/api/customers/${id}/loyalty-points`,
  // PATCH /api/customers/{id}/status
  UPDATE_STATUS: (id: string) => `/api/customers/${id}/status`,
  // GET /api/customers/membership-level/{level}
  BY_MEMBERSHIP_LEVEL: (level: string) =>
    `/api/customers/membership-level/${level}`,
  // GET /api/customers/status/{status}
  BY_STATUS: (status: string) => `/api/customers/status/${status}`,
};

export const EQUIPMENT_ENDPOINTS = {
  LIST: "/api/equipments",
  AVAILABLE: "/api/equipments/available",
  DETAILS: (id: string) => `/api/equipments/${id}`,
  CREATE: "/api/equipments",
  UPDATE: (id: string) => `/api/equipments/${id}`,
  DELETE: (id: string) => `/api/equipments/${id}`,
  SEARCH: "/api/equipments/search",
  SEARCH_ALL: "/api/equipments/search-all",
  CATEGORY: (category: string) => `/api/equipments/category/${category}`,
  SUPPLIER: (supplierId: string) => `/api/equipments/supplier/${supplierId}`,
  CONDITION: (condition: string) => `/api/equipments/condition/${condition}`,
  PRICE_RANGE: "/api/equipments/price-range",
  AVAILABILITY: (id: string) => `/api/equipments/${id}/availability`,
  STOCK: (id: string) => `/api/equipments/${id}/stock`,
};

export const EQUIPMENT_CATEGORY_ENDPOINTS = {
  LIST: "/api/equipment-categories",
  ACTIVE: "/api/equipment-categories/active",
  DETAILS: (id: string) => `/api/equipment-categories/${id}`,
  CREATE: "/api/equipment-categories",
  UPDATE: (id: string) => `/api/equipment-categories/${id}`,
  DELETE: (id: string) => `/api/equipment-categories/${id}`,
  ROOT: "/api/equipment-categories/root",
  CHILDREN: (parentId: string) =>
    `/api/equipment-categories/${parentId}/children`,
  HIERARCHY: (id: string) => `/api/equipment-categories/${id}/hierarchy`,
  HAS_CHILDREN: (id: string) => `/api/equipment-categories/${id}/has-children`,
  SEARCH: "/api/equipment-categories/search",
  STATUS: (status: string) => `/api/equipment-categories/status/${status}`,
  CAN_DELETE: (id: string) => `/api/equipment-categories/${id}/can-delete`,
  VALIDATE_PARENT: (categoryId: string) =>
    `/api/equipment-categories/${categoryId}/validate-parent`,
};

export const EQUIPMENT_IMAGE_ENDPOINTS = {
  LIST: "/api/equipment-images",
  DETAILS: (id: string) => `/api/equipment-images/${id}`,
  CREATE: "/api/equipment-images",
  UPDATE: (id: string) => `/api/equipment-images/${id}`,
  DELETE: (id: string) => `/api/equipment-images/${id}`,
  BY_EQUIPMENT: (equipmentId: string) =>
    `/api/equipment-images/equipment/${equipmentId}`,
  PRIMARY: (equipmentId: string) =>
    `/api/equipment-images/equipment/${equipmentId}/primary`,
  TYPE: (type: string) => `/api/equipment-images/type/${type}`,
  SET_PRIMARY: (id: string) => `/api/equipment-images/${id}/set-primary`,
  STATUS: (id: string) => `/api/equipment-images/${id}/status`,
  BELONGS_TO: (imageId: string, equipmentId: string) =>
    `/api/equipment-images/${imageId}/belongs-to/${equipmentId}`,
  UPLOAD: "/api/equipment-images/upload",
};

export const REVIEW_ENDPOINTS = {
  LIST: "/api/reviews",
  COUNT_BY_EQUIPMENT: (equipmentId: string) =>
    `/api/reviews/equipment/${equipmentId}/review-count`,
  AVERAGE_RATING_BY_EQUIPMENT: (equipmentId: string) =>
    `/api/reviews/equipment/${equipmentId}/average-rating`,
};

export const PAYMENT_ENDPOINTS = {
  ROOT: "/api/payments",
  LIST: "/api/payments",
  DETAILS: (id: string) => `/api/payments/${id}`,
  BY_RENTAL: (rentalId: string, page = 1, pageSize = 10) =>
    `/api/payments/rental/${rentalId}?page=${page}&pageSize=${pageSize}`,
  BY_CUSTOMER: (customerId: string, page = 1, pageSize = 10) =>
    `/api/payments/customer/${customerId}?page=${page}&pageSize=${pageSize}`,
  BY_STATUS: (status: string, page = 1, pageSize = 10) =>
    `/api/payments/status/${status}?page=${page}&pageSize=${pageSize}`,
  BY_METHOD: (method: string, page = 1, pageSize = 10) =>
    `/api/payments/method/${method}?page=${page}&pageSize=${pageSize}`,
  BY_DATE_RANGE: (
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 10
  ) =>
    `/api/payments/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`,
  CREATE: "/api/payments",
  UPDATE: (id: string) => `/api/payments/${id}`,
  DELETE: (id: string) => `/api/payments/${id}`,
  REFUND: (id: string) => `/api/payments/${id}/refund`,
  TOTAL_FOR_PERIOD: (startDate: string, endDate: string) =>
    `/api/payments/total-for-period?startDate=${startDate}&endDate=${endDate}`,
  CONFIRM: (id: string) => `/api/payments/${id}/confirm`,

  // PayOS endpoints for regular payments
  CREATE_PAYOS: "/api/payments/create-payos",
  PAYOS_WEBHOOK: "/api/payments/payos/webhook",
  PAYOS_RETURN: "/api/payments/payos/return",
  PAYOS_CANCEL_REDIRECT: "/api/payments/payos/cancel",
  PAYOS_ORDER: (orderCode: number) => `/api/payments/payos/order/${orderCode}`,
  PAYOS_CANCEL: (orderCode: number) =>
    `/api/payments/payos/${orderCode}/cancel`,

  // Order payment endpoints
  CREATE_ORDER_PAYMENT: "/api/payments/orders",
  COMPLETE_ORDER_PAYMENT: (orderPaymentId: string) =>
    `/api/payments/orders/${orderPaymentId}/complete`,
  CREATE_PAYOS_FOR_ORDER: (orderPaymentId: string) =>
    `/api/payments/orders/${orderPaymentId}/payos`,
  PAYOS_WEBHOOK_FOR_ORDER: "/api/payments/orders/payos/webhook",
  PAYOS_INFO_FOR_ORDER: (orderCode: number) =>
    `/api/payments/orders/payos/${orderCode}`,
  PAYOS_CANCEL_FOR_ORDER: (orderCode: number) =>
    `/api/payments/orders/payos/${orderCode}/cancel`,
};

export const RENTAL_ENDPOINTS = {
  GET_ALL: "/api/rentals",
  GET_BY_ID: (id: string) => `/api/rentals/${id}`,
  CREATE: "/api/rentals",
  UPDATE: (id: string) => `/api/rentals/${id}`,
  DELETE: (id: string) => `/api/rentals/${id}`,
  GET_ACTIVE: "/api/rentals/active",
  GET_BY_CUSTOMER: (customerId: string, page = 1, pageSize = 10) =>
    `/api/rentals/customer/${customerId}?page=${page}&pageSize=${pageSize}`,
  GET_BY_EQUIPMENT: (equipmentId: string, page = 1, pageSize = 10) =>
    `/api/rentals/equipment/${equipmentId}?page=${page}&pageSize=${pageSize}`,
  GET_BY_STATUS: (status: string, page = 1, pageSize = 10) =>
    `/api/rentals/status/${status}?page=${page}&pageSize=${pageSize}`,
  GET_BY_DATE_RANGE: (
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 10
  ) =>
    `/api/rentals/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`,
  CHECK_AVAILABILITY: "/api/rentals/check-availability",
  APPROVE: (id: string) => `/api/rentals/${id}/approve`,
  CANCEL: (id: string) => `/api/rentals/${id}/cancel`,
  COMPLETE: (id: string) => `/api/rentals/${id}/complete`,
  TOP_RENTED: (topN: number) => `/api/rental-histories/top-rented/${topN}`,
};

export const CART_ENDPOINTS = {
  GET: "/api/cart",
  GET_BY_ID: (cartId: string) => `/api/cart/${cartId}`,
  ADD_ITEM: "/api/cart/items",
  UPDATE_ITEM: (cartItemId: string) => `/api/cart/items/${cartItemId}`,
  REMOVE_ITEM: (cartItemId: string) => `/api/cart/items/${cartItemId}`,
  CLEAR: "/api/cart/clear",
};

export const ORDER_ENDPOINTS = {
  CREATE: "/api/orders",
  GET_ALL: "/api/orders",
  GET_BY_ID: (orderId: string) => `/api/orders/${orderId}`,
  GET_BY_NUMBER: (orderNumber: string) => `/api/orders/number/${orderNumber}`,
  MY_ORDERS: "/api/orders/my-orders",
  UPDATE_STATUS: (orderId: string) => `/api/orders/${orderId}/status`,
  CANCEL: (orderId: string) => `/api/orders/${orderId}/cancel`,
};

export const SUPPLIER_ENDPOINTS = {
  LIST: "/api/suppliers",
  DETAILS: (id: string) => `/api/suppliers/${id}`,
  CREATE: "/api/suppliers",
  UPDATE: (id: string) => `/api/suppliers/${id}`,
  DELETE: (id: string) => `/api/suppliers/${id}`,
  BY_STATUS: (status: string) => `/api/suppliers/status/${status}`,
  BY_USER_ID: (userId: string) => `/api/suppliers/user/${userId}`,
  UPDATE_VERIFICATION: (id: string) => `/api/suppliers/${id}/verification`,
  UPDATE_STATUS: (id: string) => `/api/suppliers/${id}/status`,
};

export const ANALYTICS_ENDPOINTS = {
  GET: "/api/analytics",
};

export const IDENTITY_VERIFICATION_ENDPOINTS = {
  // GET /api/identity-verifications/{id}
  GET_BY_ID: (id: string) => `/api/identity-verifications/${id}`,
  // GET /api/identity-verifications/user/{userId}
  GET_BY_USER_ID: (userId: string) =>
    `/api/identity-verifications/user/${userId}`,
  // GET /api/identity-verifications/me
  GET_ME: "/api/identity-verifications/me",
  // POST /api/identity-verifications
  CREATE: "/api/identity-verifications",
  // PUT /api/identity-verifications/{id}
  UPDATE: (id: string) => `/api/identity-verifications/${id}`,
  // DELETE /api/identity-verifications/{id}
  DELETE: (id: string) => `/api/identity-verifications/${id}`,
};
