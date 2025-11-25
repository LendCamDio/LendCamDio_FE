import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createOrderPayment,
  completeOrderPayment,
  createPayOsPaymentForOrder,
  getPayOSPaymentInfoForOrder,
  cancelPayOSPaymentForOrder,
} from "@/services/orderPaymentService";
import type { OrderPaymentLinkResponseDto } from "@/types/payment.type";
import { getPayOSOrderForOrder } from "@/services/paymentService";

// Query Keys
export const orderPaymentQueryKeys = {
  all: ["orderPayments"],
  info: (orderCode: number) => [
    ...orderPaymentQueryKeys.all,
    "info",
    orderCode,
  ],
};

export function usePayOSOrderStatus(orderCode: number) {
  return useQuery({
    queryKey: ["orderPayment", orderCode],
    queryFn: () => getPayOSOrderForOrder(orderCode),
    enabled: !!orderCode,
  });
}

/**
 * Hook: Create Order Payment
 * Tạo payment record cho order
 */
export const useCreateOrderPayment = () => {
  return useMutation({
    mutationFn: async (params: { orderId: string; paymentMethod: number }) => {
      return await createOrderPayment(params.orderId, params.paymentMethod);
    },
  });
};

/**
 * Hook: Complete Order Payment
 */
export const useCompleteOrderPayment = () => {
  return useMutation({
    mutationFn: async (params: {
      orderPaymentId: string;
      transactionId: string;
    }) => {
      return await completeOrderPayment(
        params.orderPaymentId,
        params.transactionId
      );
    },
  });
};

/**
 * Hook: Create PayOS Payment For Order
 * Tạo link thanh toán PayOS
 */
export const useCreatePayOsPaymentForOrder = () => {
  return useMutation({
    mutationFn: async (orderPaymentId: string) => {
      return await createPayOsPaymentForOrder(orderPaymentId);
    },
  });
};

/**
 * Hook: Get PayOS Payment Info For Order
 */
export const useGetPayOSPaymentInfoForOrder = (
  orderCode: number,
  enabled = true
) => {
  return useQuery({
    queryKey: orderPaymentQueryKeys.info(orderCode),
    queryFn: () => getPayOSPaymentInfoForOrder(orderCode),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook: Cancel PayOS Payment For Order
 */
export const useCancelPayOSPaymentForOrder = () => {
  return useMutation({
    mutationFn: async (params: { orderCode: number; reason?: string }) => {
      return await cancelPayOSPaymentForOrder(params.orderCode, params.reason);
    },
  });
};

/**
 * Hook: Order Payment Checkout
 * Luồng thanh toán: Create Payment -> Create PayOS Link
 */
export const useOrderPaymentCheckout = () => {
  const createPayment = useCreateOrderPayment();
  const createPayOs = useCreatePayOsPaymentForOrder();

  return useMutation({
    mutationFn: async (params: { orderId: string; paymentMethod: number }) => {
      try {
        // Step 1: Create payment
        const paymentRes = await createPayment.mutateAsync({
          orderId: params.orderId,
          paymentMethod: params.paymentMethod,
        });

        if (!paymentRes.data?.orderPaymentId) {
          throw new Error("Failed to create payment");
        }

        // Step 2: If PayOS (method 2), create payment link
        if (params.paymentMethod === 2) {
          // 2 = PayOS
          const payosRes = await createPayOs.mutateAsync(
            paymentRes.data.orderPaymentId
          );
          return {
            payment: paymentRes.data,
            payos: payosRes.data as OrderPaymentLinkResponseDto,
          };
        }

        return {
          payment: paymentRes.data,
          payos: null,
        };
      } catch (error) {
        throw error;
      }
    },
  });
};
