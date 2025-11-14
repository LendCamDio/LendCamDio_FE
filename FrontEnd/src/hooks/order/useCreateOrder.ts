import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import type { CreateOrderRequestDto, CreateOrderPaymentRequestDto } from '@/types/order.type';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderRequestDto) => orderService.createOrder(data),
  });
};

export const useCreateOrderPayment = () => {
  return useMutation<
    { orderPaymentId: string },
    Error,
    CreateOrderPaymentRequestDto
  >({
    mutationFn: (request: CreateOrderPaymentRequestDto) => 
      orderService.createOrderPayment(request),
  });
};
