/**
 * Complete Order Checkout Hook
 * Xử lý luồng hoàn chỉnh: Create Order -> Create Payment -> PayOS Link
 * Sử dụng cho Checkout Page
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { OrderPaymentMethod } from "@/types/order.type";
import type { CreateOrderRequestDto, OrderResponseDto } from "@/types/order.type";
import type { OrderPaymentLinkResponseDto } from "@/types/payment.type";

export interface CheckoutFlowParams {
  shippingAddress: string;
  shippingPhone?: string;
  shippingName?: string;
  notes?: string;
  paymentMethod: OrderPaymentMethod;
  orderItems?: Array<{ equipmentId: string; quantity: number }>;
}

export interface CheckoutFlowResult {
  order: OrderResponseDto;
  payment?: { orderPaymentId: string };
  payos?: OrderPaymentLinkResponseDto;
}

/**
 * Hook: Complete Checkout Flow
 * 
 * Thực hiện:
 * 1. Tạo Order từ Cart hoặc từ orderItems
 * 2. Tạo Payment Record
 * 3. Nếu PayOS: Tạo PayOS Link
 * 4. Clear Cart sau khi thành công
 * 
 * @returns Mutation hook với mutateAsync
 * @example
 * const checkout = useCompleteCheckoutFlow();
 * await checkout.mutateAsync({
 *   shippingAddress: "123 Đường ABC",
 *   shippingPhone: "0123456789",
 *   shippingName: "Tên người nhận",
 *   paymentMethod: OrderPaymentMethod.PayOS,
 * });
 */
export const useCompleteCheckoutFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CheckoutFlowParams): Promise<CheckoutFlowResult> => {
      try {
        // Step 1: Create Order
        const orderData: CreateOrderRequestDto = {
          shippingAddress: params.shippingAddress,
          shippingPhone: params.shippingPhone,
          shippingName: params.shippingName,
          notes: params.notes,
          orderItems: params.orderItems, // If null, backend will use cart
        };

        const order = await orderService.createOrder(orderData);
        if (!order?.orderId) {
          throw new Error("Failed to create order");
        }

        // Step 2: Create Payment
        const paymentRequest = {
          orderId: order.orderId,
          paymentMethod: params.paymentMethod,
        };

        const payment = await orderService.createOrderPayment(paymentRequest);
        if (!payment?.orderPaymentId) {
          throw new Error("Failed to create payment");
        }

        let payos: OrderPaymentLinkResponseDto | undefined;

        // Step 3: Create PayOS Link (if PayOS method)
        if (params.paymentMethod === OrderPaymentMethod.PayOS) {
          payos = await orderService.createPayOsPaymentForOrder(
            payment.orderPaymentId
          );
          if (!payos?.checkoutUrl) {
            throw new Error("Failed to create PayOS checkout link");
          }
        }

        // Step 4: Clear cart after successful order creation
        try {
          await cartService.clearCart();
          // Invalidate cart queries
          queryClient.invalidateQueries({
            queryKey: ["cart"],
          });
        } catch (error) {
          console.warn("Warning: Could not clear cart automatically", error);
        }

        return {
          order,
          payment,
          payos,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate orders
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

/**
 * Helper: Get PayOS Checkout URL
 * 
 * Sử dụng sau khi checkout successful để redirect tới PayOS
 * 
 * @example
 * const result = await checkout.mutateAsync({...});
 * if (result.payos?.checkoutUrl) {
 *   window.location.href = result.payos.checkoutUrl;
 * }
 */
export const getPayOSCheckoutUrl = (
  result: CheckoutFlowResult | undefined
): string | null => {
  return result?.payos?.checkoutUrl || null;
};

/**
 * Helper: Should Redirect to PayOS
 * 
 * Kiểm tra xem có nên redirect tới PayOS không
 * 
 * @example
 * if (shouldRedirectToPayOS(result)) {
 *   window.location.href = result.payos.checkoutUrl;
 * } else {
 *   navigate("/orders");
 * }
 */
export const shouldRedirectToPayOS = (
  result: CheckoutFlowResult | undefined
): boolean => {
  return !!(result?.payos?.checkoutUrl);
};
