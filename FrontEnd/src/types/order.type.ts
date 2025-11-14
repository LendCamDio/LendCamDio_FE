/**
 * Order Types for LendCamDio Frontend
 * Định nghĩa các enum và interface cho Order system
 */

// Order Status Enum (từ backend)
export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
  Refunded = 5,
}

// Order Payment Status Enum (từ backend)
export enum OrderPaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
  Cancelled = 4,
}

// Order Payment Method Enum (từ backend)
export enum OrderPaymentMethod {
  VNPay = 0,
  Cash = 1,
  PayOS = 2,
  BankTransfer = 3,
}

/**
 * DTO Interfaces
 */

// Request DTOs
export interface CreateOrderRequestDto {
  shippingAddress: string;
  shippingPhone?: string;
  shippingName?: string;
  notes?: string;
  orderItems?: OrderItemDto[];
}

export interface OrderItemDto {
  equipmentId: string;
  quantity: number;
}

export interface CreateOrderPaymentRequestDto {
  orderId: string;
  paymentMethod: OrderPaymentMethod;
}

// Response DTOs
export interface OrderResponseDto {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  subTotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: string;
  shippingPhone?: string;
  shippingName?: string;
  notes?: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItemResponseDto[];
  payments: OrderPaymentResponseDto[];
}

export interface OrderItemResponseDto {
  orderItemId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderPaymentResponseDto {
  orderPaymentId: string;
  amount: number;
  paymentMethod: OrderPaymentMethod;
  status: OrderPaymentStatus;
  transactionId?: string;
  completedAt?: string;
  createdAt: string;
}

// Cart -> Order Flow
export interface CartItemForOrder {
  equipmentId: string;
  quantity: number;
}

// Order Summary for display
export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  createdAt: string;
  itemCount: number;
}
