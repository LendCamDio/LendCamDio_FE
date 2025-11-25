/**
 * Payment Types for Order System
 * Định nghĩa các interface cho Payment xử lý Order
 */

import type { OrderPaymentMethod } from "./order.type";

// Payment Response DTOs
export interface OrderPaymentLinkResponseDto {
  orderPaymentId: string;
  checkoutUrl: string;
  message: string;
}

export interface PayOSPaymentInfoResponseDto {
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  expiredAt?: string;
  paidAt?: string;
  data: Record<string, any>;
}

export interface PayOSOrderPaymentInfoResponse {
  orderCode: number;
  paymentInfo: PayOSPaymentInfoResponseDto;
}

// Payment Methods
export interface PaymentMethodOption {
  label: string;
  value: OrderPaymentMethod;
  icon?: string;
  description?: string;
}

// Payment Status Display
export enum PaymentStatusDisplay {
  Pending = "Chờ thanh toán",
  Completed = "Đã thanh toán",
  Failed = "Thanh toán thất bại",
  Refunded = "Đã hoàn tiền",
  Cancelled = "Đã hủy",
}
