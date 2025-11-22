import api from "./api";
import { ORDER_ENDPOINTS, PAYMENT_ENDPOINTS } from "@/constants/endpoints";
import type {
  CreateOrderRequestDto,
  OrderResponseDto,
  CreateOrderPaymentRequestDto,
  OrderStatus,
} from "@/types/order.type";
import type { ApiResponse } from "@/types/entity.type";
import type { OrderPaymentLinkResponseDto } from "@/types/payment.type";

class OrderService {
  async createOrder(data: CreateOrderRequestDto): Promise<OrderResponseDto> {
    try {
      const response = await api.post<ApiResponse<OrderResponseDto>>(
        ORDER_ENDPOINTS.CREATE,
        data
      );
      return response.data.data || ({} as OrderResponseDto);
    } catch (error: unknown) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<OrderResponseDto> {
    try {
      const response = await api.get<ApiResponse<OrderResponseDto>>(
        ORDER_ENDPOINTS.GET_BY_ID(orderId)
      );
      return response.data.data || ({} as OrderResponseDto);
    } catch (error: unknown) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderResponseDto> {
    try {
      const response = await api.get<ApiResponse<OrderResponseDto>>(
        ORDER_ENDPOINTS.GET_BY_NUMBER(orderNumber)
      );
      return response.data.data || ({} as OrderResponseDto);
    } catch (error: unknown) {
      console.error("Error fetching order by number:", error);
      throw error;
    }
  }

  async getMyOrders(): Promise<OrderResponseDto[]> {
    try {
      const response = await api.get<ApiResponse<OrderResponseDto[]>>(
        ORDER_ENDPOINTS.MY_ORDERS
      );
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Error fetching my orders:", error);
      throw error;
    }
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    try {
      const response = await api.get<ApiResponse<OrderResponseDto[]>>(
        ORDER_ENDPOINTS.GET_ALL
      );
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  }

  async createOrderPayment(
    request: CreateOrderPaymentRequestDto
  ): Promise<{ orderPaymentId: string }> {
    try {
      const response = await api.post<ApiResponse<{ orderPaymentId: string }>>(
        PAYMENT_ENDPOINTS.CREATE_ORDER_PAYMENT,
        request
      );
      return response.data.data || { orderPaymentId: "" };
    } catch (error: unknown) {
      console.error("Error creating order payment:", error);
      throw error;
    }
  }

  async createPayOsPaymentForOrder(
    orderPaymentId: string
  ): Promise<OrderPaymentLinkResponseDto> {
    try {
      const response = await api.post<
        ApiResponse<OrderPaymentLinkResponseDto>
      >(PAYMENT_ENDPOINTS.CREATE_PAYOS_FOR_ORDER(orderPaymentId));
      return response.data.data || ({} as OrderPaymentLinkResponseDto);
    } catch (error: unknown) {
      console.error("Error creating PayOS payment for order:", error);
      throw error;
    }
  }

  async completeOrderPayment(
    orderPaymentId: string,
    transactionId: string
  ): Promise<unknown> {
    try {
      const response = await api.post<ApiResponse<unknown>>(
        PAYMENT_ENDPOINTS.COMPLETE_ORDER_PAYMENT(orderPaymentId),
        { transactionId }
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error completing order payment:", error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        ORDER_ENDPOINTS.CANCEL(orderId)
      );
      return response.data.success || false;
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderResponseDto> {
    try {
      const response = await api.put<ApiResponse<OrderResponseDto>>(
        ORDER_ENDPOINTS.UPDATE_STATUS(orderId),
        { status }
      );
      return response.data.data || ({} as OrderResponseDto);
    } catch (error: unknown) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
