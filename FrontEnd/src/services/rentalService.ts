import type {
  ApiResponse,
  CreateRentalRequestDto,
  RentalCreateResponse,
  RentalResponse,
  RentalResponseDto,
  RentalStatus,
  RentalUpdateRequestDto,
  RentalUpdateResponse,
} from "@/types/entity.type";
import api from "./api";
import { handleApiError } from "./apiErrorHandler";
import { RENTAL_ENDPOINTS } from "@/constants/endpoints";

// ============================
// 🧾 GET METHODS
// ============================

export const getAllRentals = async (
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_ALL, {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error); // 👈 throw instead of return
  }
};

export const getActiveRentals = async (
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_ACTIVE, {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRentalById = async (
  id: string
): Promise<ApiResponse<RentalResponseDto>> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_BY_ID(id));
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRentalsByCustomer = async (
  customerId: string,
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_BY_CUSTOMER(customerId), {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRentalsByEquipment = async (
  equipmentId: string,
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_BY_EQUIPMENT(equipmentId), {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRentalsByStatus = async (
  status: RentalStatus,
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_BY_STATUS(status), {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRentalsByDateRange = async (
  startDate: string,
  endDate: string,
  page: number,
  pageSize: number
): Promise<RentalResponse> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.GET_BY_DATE_RANGE, {
      params: { startDate, endDate, page, pageSize },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================
// ✍️ CREATE / UPDATE / DELETE
// ============================

export const createRental = async (
  dto: CreateRentalRequestDto
): Promise<RentalCreateResponse> => {
  try {
    const res = await api.post(RENTAL_ENDPOINTS.CREATE, dto);
    const response = res.data;

    if (!response.success) {
      throw new Error(response.error?.message || "API returned an error");
    }

    return response;
  } catch (error) {
    throw handleApiError(error); // 👈 throw, don’t return
  }
};

export const updateRental = async (
  id: string,
  dto: RentalUpdateRequestDto
): Promise<RentalUpdateResponse> => {
  try {
    const res = await api.put(RENTAL_ENDPOINTS.UPDATE(id), dto);
    const response = res.data;

    if (!response.success) {
      throw new Error(response.error?.message || "API returned an error");
    }

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteRental = async (
  id: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.delete(RENTAL_ENDPOINTS.DELETE(id));
    const response = res.data;

    if (!response.success) {
      throw new Error(response.error?.message || "API returned an error");
    }

    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================
// ⚙️ ACTIONS (PATCH)
// ============================

export const approveRental = async (
  id: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.patch(RENTAL_ENDPOINTS.APPROVE(id));
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelRental = async (
  id: string,
  reason: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.patch(RENTAL_ENDPOINTS.CANCEL(id), reason, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const completeRental = async (
  id: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.patch(RENTAL_ENDPOINTS.COMPLETE(id));
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================
// 🔍 CHECK AVAILABILITY
// ============================

export const checkEquipmentAvailability = async (
  equipmentId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.get(RENTAL_ENDPOINTS.CHECK_AVAILABILITY, {
      params: { equipmentId, startDate, endDate },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
