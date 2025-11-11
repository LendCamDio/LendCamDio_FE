import api from "./api";
import { ORDER_ENDPOINTS } from "@/constants/endpoints";

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface OrderItem {
  orderItemId: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  price: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
  note?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  note?: string;
  paymentMethod: string;
}

export interface OrderPaymentRequest {
  orderId: string;
  paymentMethod: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface OrderPaymentResponse {
  orderPaymentId: string;
  paymentUrl: string;
  qrCodeUrl?: string;
}

class OrderService {
  // Create order from cart
  async createOrder(data: CreateOrderRequest) {
    const response = await api.post<Order>(ORDER_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Get order by ID
  async getOrder(orderId: string) {
    const response = await api.get<Order>(ORDER_ENDPOINTS.GET_BY_ID(orderId));
    return response.data;
  }

  // Get order by number
  async getOrderByNumber(orderNumber: string) {
    const response = await api.get<Order>(
      ORDER_ENDPOINTS.GET_BY_NUMBER(orderNumber)
    );
    return response.data;
  }

  // Get current user's orders
  async getMyOrders() {
    const response = await api.get<Order[]>(ORDER_ENDPOINTS.MY_ORDERS);
    return response.data;
  }

  // Cancel order
  async cancelOrder(orderId: string) {
    const response = await api.post(ORDER_ENDPOINTS.CANCEL(orderId));
    return response.data;
  }

  // Create payment for order
  async createPayment(data: OrderPaymentRequest) {
    const response = await api.post<OrderPaymentResponse>(
      "/api/orders/payment",
      data
    );
    return response.data;
  }

  // Complete payment
  async completePayment(orderPaymentId: string, transactionId: string) {
    const response = await api.post(
      `/api/orders/payment/${orderPaymentId}/complete`,
      transactionId
    );
    return response.data;
  }
}

export const orderService = new OrderService();
export default orderService;
