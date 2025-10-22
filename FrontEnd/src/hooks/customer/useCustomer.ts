import { useQuery } from "@tanstack/react-query";
import type { MembershipLevel, UserStatus } from "@/types/entity.type";
import {
  getAllCustomers,
  getActiveCustomers,
  getCustomerById,
  getCustomerByUserId,
  getCustomersByMembershipLevel,
  getCustomersByStatus,
} from "@/services/customerService";

// ============================
// 📋 Customer List Hook
// ============================

const useCustomerList = (
  page: number,
  pageSize: number,
  options?: {
    activeOnly?: boolean;
    membershipLevel?: MembershipLevel | "all";
    status?: UserStatus | "all";
  }
) => {
  let serviceFn = () => getAllCustomers(page, pageSize);

  // Handle different filters
  if (options?.activeOnly) {
    serviceFn = () => getActiveCustomers(page, pageSize);
  } else if (options?.membershipLevel && options.membershipLevel !== "all") {
    serviceFn = () =>
      getCustomersByMembershipLevel(
        options.membershipLevel! as MembershipLevel,
        page,
        pageSize
      );
  } else if (options?.status && options.status !== "all") {
    serviceFn = () =>
      getCustomersByStatus(options.status! as UserStatus, page, pageSize);
  }

  return useQuery({
    queryKey: [
      "customers",
      page,
      pageSize,
      options?.activeOnly,
      options?.membershipLevel,
      options?.status,
    ],
    queryFn: serviceFn,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
    retry: 3, // retry failed requests
    refetchOnWindowFocus: false,
  });
};

// ============================
// 👤 Customer Detail Hook
// ============================

const useCustomerDetail = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => getCustomerById(id),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};

// ============================
// 👤 Customer By User ID Hook
// ============================

const useCustomerByUserId = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["customerByUserId", userId],
    queryFn: () => getCustomerByUserId(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};

export { useCustomerList, useCustomerDetail, useCustomerByUserId };
