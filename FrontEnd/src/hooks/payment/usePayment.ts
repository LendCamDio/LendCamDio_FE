import { useQuery } from "@tanstack/react-query";
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByCustomerId,
  getPaymentsByRentalId,
  getPaymentsByStatus,
  getPaymentsByMethod,
  getPaymentsByDateRange,
} from "@/services/paymentService";
import type { PaymentMethod, PaymentStatus } from "@/types/index.type";

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
    queryFn: () => getPaymentsByMethod(method, page, pageSize),
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
    queryFn: () => getPaymentsByStatus(status, page, pageSize),
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
