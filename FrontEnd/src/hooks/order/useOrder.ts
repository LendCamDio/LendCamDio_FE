import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import type {
  CreateOrderRequestDto,
  CreateOrderPaymentRequestDto,
  OrderPaymentMethod,
} from "@/types/order.type";

// Query Keys
export const orderQueryKeys = {
  all: ["orders"],
  lists: () => [...orderQueryKeys.all, "list"],
  myOrders: () => [...orderQueryKeys.all, "my"],
  detail: (id: string) => [...orderQueryKeys.all, "detail", id],
};

/**
 * Hook: Create Order
 * Tạo đơn hàng mới từ cart hoặc items cụ thể
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderRequestDto) => {
      return await orderService.createOrder(data);
    },
    onSuccess: (order) => {
      // Invalidate my orders list
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.myOrders(),
      });
      // Cache the new order
      queryClient.setQueryData(orderQueryKeys.detail(order.orderId), order);
    },
  });
};

/**
 * Hook: Get My Orders
 * Lấy danh sách đơn hàng của user hiện tại
 */
export const useMyOrders = () => {
  return useQuery({
    queryKey: orderQueryKeys.myOrders(),
    queryFn: () => orderService.getMyOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Get Order By ID
 */
export const useOrderById = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Get Order By Number
 */
export const useOrderByNumber = (orderNumber: string, enabled = true) => {
  return useQuery({
    queryKey: [...orderQueryKeys.all, "number", orderNumber],
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Cancel Order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      return await orderService.cancelOrder(orderId);
    },
    onSuccess: () => {
      // Invalidate orders
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.myOrders(),
      });
    },
  });
};

/**
 * Hook: Create Order Payment
 * Tạo payment record cho order
 */
export const useCreateOrderPayment = () => {
  return useMutation({
    mutationFn: async (request: CreateOrderPaymentRequestDto) => {
      return await orderService.createOrderPayment(request);
    },
  });
};

/**
 * Hook: Create PayOS Payment Link
 * Tạo link thanh toán PayOS cho order
 */
export const useCreatePayOsPaymentForOrder = () => {
  return useMutation({
    mutationFn: async (orderPaymentId: string) => {
      return await orderService.createPayOsPaymentForOrder(orderPaymentId);
    },
  });
};

/**
 * Hook: Complete Order Payment
 * Hoàn thành thanh toán order
 */
export const useCompleteOrderPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderPaymentId: string;
      transactionId: string;
    }) => {
      return await orderService.completeOrderPayment(
        params.orderPaymentId,
        params.transactionId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.myOrders(),
      });
    },
  });
};

/**
 * Hook: Order Checkout Flow
 * Luồng đầy đủ: Create Order -> Create Payment -> Create PayOS Link
 */
export const useOrderCheckout = () => {
  const createOrder = useCreateOrder();
  const createPayment = useCreateOrderPayment();
  const createPayOs = useCreatePayOsPaymentForOrder();

  return useMutation({
    mutationFn: async (params: {
      orderData: CreateOrderRequestDto;
      paymentMethod: OrderPaymentMethod;
    }) => {
      try {
        // Step 1: Create order
        const order = await createOrder.mutateAsync(params.orderData);
        if (!order.orderId) {
          throw new Error("Failed to create order");
        }

        // Step 2: Create payment
        const paymentRequest: CreateOrderPaymentRequestDto = {
          orderId: order.orderId,
          paymentMethod: params.paymentMethod,
        };
        const paymentResult = await createPayment.mutateAsync(paymentRequest);
        if (!paymentResult.orderPaymentId) {
          throw new Error("Failed to create payment");
        }

        // Step 3: Create PayOS link (if payment method is PayOS)
        if (params.paymentMethod === 2) {
          // 2 = PayOS
          const payosResult = await createPayOs.mutateAsync(
            paymentResult.orderPaymentId
          );
          return {
            order,
            payment: paymentResult,
            payos: payosResult,
          };
        }

        return {
          order,
          payment: paymentResult,
          payos: null,
        };
      } catch (error) {
        throw error;
      }
    },
  });
};
