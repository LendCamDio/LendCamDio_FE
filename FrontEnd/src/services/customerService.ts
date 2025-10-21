import type {
  ApiResponse,
  CreateCustomerRequestDto,
  CustomerDto,
  CustomerResponse,
  UserStatus,
  MembershipLevel,
  PaginatedData,
  UpdateCustomerRequestDto,
} from "@/types/entity.type";
import api from "./api";
import { handleApiError } from "./apiErrorHandler";
import { CUSTOMER_ENDPOINTS } from "@/constants/endpoints";

// ============================
// 🧾 GET METHODS
// ============================

// Get all customers (paged)
export const getAllCustomers = async (
  page: number,
  pageSize: number
): Promise<CustomerResponse> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.LIST, {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get active customers
export const getActiveCustomers = async (
  page: number,
  pageSize: number
): Promise<CustomerResponse> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.ACTIVE_LIST, {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get customer by ID
export const getCustomerById = async (
  id: string
): Promise<CustomerResponse> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.DETAILS(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get customer by User ID
export const getCustomerByUserId = async (
  userId: string
): Promise<ApiResponse<CustomerDto>> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.BY_USER_ID(userId));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get customers by membership level
export const getCustomersByMembershipLevel = async (
  level: MembershipLevel,
  page: number,
  pageSize: number
): Promise<CustomerResponse> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.BY_MEMBERSHIP_LEVEL(level), {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get customers by status
export const getCustomersByStatus = async (
  status: UserStatus,
  page: number,
  pageSize: number
): Promise<CustomerResponse> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.BY_STATUS(status), {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get loyalty points
export const getCustomerLoyaltyPoints = async (
  id: string
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.get(CUSTOMER_ENDPOINTS.GET_LOYALTY_POINTS(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================
// ✏️ CREATE / UPDATE / DELETE
// ============================

// Create new customer
export const createCustomer = async (
  data: CreateCustomerRequestDto
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.post(CUSTOMER_ENDPOINTS.CREATE, data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update customer
export const updateCustomer = async (
  id: string,
  data: UpdateCustomerRequestDto
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.put(CUSTOMER_ENDPOINTS.UPDATE(id), data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete customer
export const deleteCustomer = async (
  id: string
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.delete(CUSTOMER_ENDPOINTS.DELETE(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================
// 🔧 PATCH METHODS
// ============================

// Update membership level
export const updateMembershipLevel = async (
  id: string,
  level: MembershipLevel
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.patch(
      CUSTOMER_ENDPOINTS.UPDATE_MEMBERSHIP_LEVEL(id),
      level
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update loyalty points
export const updateLoyaltyPoints = async (
  id: string,
  points: number
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.patch(
      CUSTOMER_ENDPOINTS.UPDATE_LOYALTY_POINTS(id),
      points
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update customer status
export const updateCustomerStatus = async (
  id: string,
  status: UserStatus
): Promise<ApiResponse<PaginatedData<object>>> => {
  try {
    const res = await api.patch(CUSTOMER_ENDPOINTS.UPDATE_STATUS(id), status);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
