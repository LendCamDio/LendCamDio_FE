import api from "./api";
import { PAYMENT_ENDPOINTS } from "../constants/endpoints";
import type {
  OrderPaymentLinkResponseDto,
  PayOSOrderPaymentInfoResponse,
} from "@/types/payment.type";
import type { ApiResponse } from "@/types/entity.type";
import { handleApiError } from "./apiErrorHandler";

/**
 * Payment Service for Orders
 * Xử lý thanh toán cho đơn hàng (không phải rental)
 */

// 🆕 Create order payment
export const createOrderPayment = async (
  orderId: string,
  paymentMethod: number
): Promise<ApiResponse<{ orderPaymentId: string }>> => {
  try {
    const res = await api.post<ApiResponse<{ orderPaymentId: string }>>(
      PAYMENT_ENDPOINTS.CREATE_ORDER_PAYMENT,
      {
        orderId,
        paymentMethod,
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError<{ orderPaymentId: string }>(error);
  }
};

// ✅ Complete order payment
export const completeOrderPayment = async (
  orderPaymentId: string,
  transactionId: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(
      PAYMENT_ENDPOINTS.COMPLETE_ORDER_PAYMENT(orderPaymentId),
      { transactionId }
    );
    return res.data;
  } catch (error) {
    return handleApiError<any>(error);
  }
};

// 🏦 Create PayOS payment for order
export const createPayOsPaymentForOrder = async (
  orderPaymentId: string
): Promise<ApiResponse<OrderPaymentLinkResponseDto>> => {
  try {
    const res = await api.post<ApiResponse<OrderPaymentLinkResponseDto>>(
      PAYMENT_ENDPOINTS.CREATE_PAYOS_FOR_ORDER(orderPaymentId)
    );
    return res.data;
  } catch (error) {
    return handleApiError<OrderPaymentLinkResponseDto>(error);
  }
};

// 🏦 PayOS webhook for order
export const handlePayOSWebhookForOrder = async (
  webhook: any
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.PAYOS_WEBHOOK_FOR_ORDER,
      webhook
    );
    return res.data;
  } catch (error) {
    return handleApiError<object>(error);
  }
};

// 🏦 Get PayOS payment info for order
export const getPayOSPaymentInfoForOrder = async (
  orderCode: number
): Promise<ApiResponse<PayOSOrderPaymentInfoResponse>> => {
  try {
    const res = await api.get<ApiResponse<PayOSOrderPaymentInfoResponse>>(
      PAYMENT_ENDPOINTS.PAYOS_INFO_FOR_ORDER(orderCode)
    );
    return res.data;
  } catch (error) {
    return handleApiError<PayOSOrderPaymentInfoResponse>(error);
  }
};

// 🔄 Verify and sync order payment from PayOS
export const verifyOrderPayment = async (
  orderCode: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(
      PAYMENT_ENDPOINTS.VERIFY_ORDER_PAYMENT(orderCode)
    );
    return res.data;
  } catch (error) {
    return handleApiError<any>(error);
  }
};

// 🏦 Cancel PayOS payment for order
export const cancelPayOSPaymentForOrder = async (
  orderCode: number,
  reason?: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.post<ApiResponse<object>>(
      PAYMENT_ENDPOINTS.PAYOS_CANCEL_FOR_ORDER(orderCode),
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
