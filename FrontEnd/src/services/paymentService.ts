import api from "./api";
import { PAYMENT_ENDPOINTS } from "../constants/endpoints";
import type {
  ApiResponse,
  PaymentResponse,
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
  CreatePayOSPaymentRequestDto,
  PayOSPaymentLinkResponseDto,
  PayOSPaymentInfoResponseDto,
  PaymentResponseDto,
} from "@/types/entity.type";
import { handleApiError } from "./apiErrorHandler";

// 🧾 Get all payments (Admin, Supplier)
export const getAllPayments = async (
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get<PaymentResponse>(PAYMENT_ENDPOINTS.LIST, {
      params: { page, pageSize },
    });
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 🔍 Get payment by ID
export const getPaymentById = async (id: string): Promise<ApiResponse<PaymentResponseDto>> => {
  try {
    const res = await api.get<ApiResponse<PaymentResponseDto>>(PAYMENT_ENDPOINTS.DETAILS(id));
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponseDto>(error);
  }
};

// 💳 Get payments by rental ID
export const getPaymentsByRentalId = async (
  rentalId: string,
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get<PaymentResponse>(
      PAYMENT_ENDPOINTS.BY_RENTAL(rentalId, page, pageSize)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 👤 Get payments by customer ID
export const getPaymentsByCustomerId = async (
  customerId: string,
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get(
      PAYMENT_ENDPOINTS.BY_CUSTOMER(customerId, page, pageSize)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 🏷️ Get payments by status
export const getPaymentsByStatus = async (
  status: string,
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get<PaymentResponse>(
      PAYMENT_ENDPOINTS.BY_STATUS(status, page, pageSize)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 💰 Get payments by method
export const getPaymentsByMethod = async (
  method: string,
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get<PaymentResponse>(
      PAYMENT_ENDPOINTS.BY_METHOD(method, page, pageSize)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 🗓️ Get payments in date range
export const getPaymentsByDateRange = async (
  startDate: string,
  endDate: string,
  page = 1,
  pageSize = 10
): Promise<PaymentResponse> => {
  try {
    const res = await api.get(
      PAYMENT_ENDPOINTS.BY_DATE_RANGE(startDate, endDate, page, pageSize)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponse>(error) as PaymentResponse;
  }
};

// 🆕 Create new payment
export const createPayment = async (
  dto: CreatePaymentRequestDto
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.CREATE,
      dto
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// ✏️ Update existing payment
export const updatePayment = async (
  id: string,
  dto: UpdatePaymentRequestDto
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.put<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.UPDATE(id),
      dto
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// ❌ Delete payment (Admin only)
export const deletePayment = async (
  id: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.delete<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.DELETE(id)
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// 💸 Refund payment
export const refundPayment = async (
  id: string,
  reason: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.patch<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.REFUND(id),
      reason,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// 📊 Get total payments in period
export const getTotalPaymentsForPeriod = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.get<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.TOTAL_FOR_PERIOD(startDate, endDate)
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// ✅ Confirm manual payment (Admin)
export const confirmPayment = async (
  id: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.patch<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.CONFIRM(id)
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// 🏦 PayOS: Create payment link
export const createPayOSPayment = async (
  dto: CreatePayOSPaymentRequestDto
): Promise<ApiResponse<PayOSPaymentLinkResponseDto>> => {
  try {
    const res = await api.post<ApiResponse<PayOSPaymentLinkResponseDto>>(
      PAYMENT_ENDPOINTS.CREATE_PAYOS,
      dto
    );
    return res.data;
  } catch (error) {
    return handleApiError<PayOSPaymentLinkResponseDto>(error);
  }
};

// 🏦 PayOS: Get payment info from PayOS gateway
export const getPayOSPaymentInfo = async (
  orderCode: number
): Promise<ApiResponse<PayOSPaymentInfoResponseDto>> => {
  try {
    const res = await api.get<ApiResponse<PayOSPaymentInfoResponseDto>>(
      PAYMENT_ENDPOINTS.PAYOS_INFO(orderCode)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PayOSPaymentInfoResponseDto>(error);
  }
};

// 🏦 PayOS: Get payment by order code from database
export const getPaymentByOrderCode = async (
  orderCode: number
): Promise<ApiResponse<PaymentResponseDto>> => {
  try {
    const res = await api.get<ApiResponse<PaymentResponseDto>>(
      PAYMENT_ENDPOINTS.PAYOS_ORDER(orderCode)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PaymentResponseDto>(error);
  }
};

// 🏦 PayOS: Cancel payment link
export const cancelPayOSPayment = async (
  orderCode: number,
  reason?: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.PAYOS_CANCEL(orderCode),
      reason || "Cancelled by user",
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};
