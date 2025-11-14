import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByCustomerId,
  getPaymentsByRentalId,
  getPaymentsByStatus,
  getPaymentsByMethod,
  getPaymentsByDateRange,
  createPayOSPayment,
  cancelPayOSPayment,
  getPayOSPaymentInfo,
  getPaymentByOrderCode,
  confirmPayment,
  createPayment,
  updatePayment,
  deletePayment,
  refundPayment,
} from "@/services/paymentService";
import type { 
  PaymentMethod, 
  PaymentStatus,
  CreatePayOSPaymentRequestDto,
  CreatePaymentRequestDto,
  UpdatePaymentRequestDto,
} from "@/types/index.type";

/**
 * 🧾 Fetch all payments (Admin, Supplier)
 */
export const usePaymentList = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["payments", page, pageSize],
    queryFn: () => getAllPayments(page, pageSize),
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 🔍 Fetch payment by ID
 */
export const usePaymentDetail = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentById(id),
    enabled: enabled && Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 👤 Fetch payments by customer
 */
export const usePaymentsByCustomer = (
  customerId: string,
  page: number,
  pageSize: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["payments-customer", customerId, page, pageSize],
    queryFn: () => getPaymentsByCustomerId(customerId, page, pageSize),
    enabled: enabled && Boolean(customerId),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 🏠 Fetch payments by rental ID
 */
export const usePaymentsByRental = (
  rentalId: string,
  page: number,
  pageSize: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["payments-rental", rentalId, page, pageSize],
    queryFn: () => getPaymentsByRentalId(rentalId, page, pageSize),
    enabled: enabled && Boolean(rentalId),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 💳 Fetch payments by method
 */
export const usePaymentsByMethod = (
  method: PaymentMethod,
  page: number,
  pageSize: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["payments-method", method, page, pageSize],
    queryFn: () => getPaymentsByMethod(String(method), page, pageSize),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 🏷️ Fetch payments by status
 */
export const usePaymentsByStatus = (
  status: PaymentStatus,
  page: number,
  pageSize: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["payments-status", status, page, pageSize],
    queryFn: () => getPaymentsByStatus(String(status), page, pageSize),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 📅 Fetch payments by date range
 */
export const usePaymentsByDateRange = (
  startDate: string,
  endDate: string,
  page: number,
  pageSize: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["payments-date-range", startDate, endDate, page, pageSize],
    queryFn: () => getPaymentsByDateRange(startDate, endDate, page, pageSize),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * 🏦 Fetch PayOS payment info from gateway
 */
export const usePayOSPaymentInfo = (orderCode: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["payos-info", orderCode],
    queryFn: () => getPayOSPaymentInfo(orderCode),
    enabled: enabled && Boolean(orderCode),
    staleTime: 1000 * 60 * 2,
    retry: 3,
    refetchOnWindowFocus: true, // Refetch để cập nhật trạng thái payment
  });
};

/**
 * 🏦 Fetch payment by PayOS order code
 */
export const usePaymentByOrderCode = (orderCode: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["payment-order-code", orderCode],
    queryFn: () => getPaymentByOrderCode(orderCode),
    enabled: enabled && Boolean(orderCode),
    staleTime: 1000 * 60 * 2,
    retry: 3,
    refetchOnWindowFocus: true,
  });
};

/**
 * ➕ Create new payment
 */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreatePaymentRequestDto) => createPayment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

/**
 * 🏦 Create PayOS payment link
 */
export const useCreatePayOSPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreatePayOSPaymentRequestDto) => createPayOSPayment(dto),
    onSuccess: (data) => {
      // Invalidate payment queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", data.data?.paymentId] });
    },
  });
};

/**
 * ✏️ Update payment
 */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePaymentRequestDto }) => 
      updatePayment(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
    },
  });
};

/**
 * ❌ Delete payment
 */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

/**
 * 💸 Refund payment
 */
export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      refundPayment(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
    },
  });
};

/**
 * ✅ Confirm manual payment
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => confirmPayment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", id] });
    },
  });
};

/**
 * 🏦 Cancel PayOS payment link
 */
export const useCancelPayOSPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderCode, reason }: { orderCode: number; reason?: string }) => 
      cancelPayOSPayment(orderCode, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment-order-code", variables.orderCode] });
      queryClient.invalidateQueries({ queryKey: ["payos-info", variables.orderCode] });
    },
  });
};
