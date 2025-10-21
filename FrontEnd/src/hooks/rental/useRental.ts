import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllRentals,
  getActiveRentals,
  getRentalById,
  getRentalsByCustomer,
  getRentalsByEquipment,
  getRentalsByStatus,
  getRentalsByDateRange,
  checkEquipmentAvailability,
  createRental,
} from "@/services/rentalService";
import type {
  CreateRentalRequestDto,
  RentalCreateResponse,
  RentalStatus,
} from "@/types/entity.type";

// ==============================
// 🔹 useRentalList Hook
// ==============================
export const useRentalList = (
  page: number,
  pageSize: number,
  filters?: {
    status?: RentalStatus;
    customerId?: string;
    equipmentId?: string;
    startDate?: string;
    endDate?: string;
    activeOnly?: boolean;
  }
) => {
  let serviceFn = () => getAllRentals(page, pageSize);

  // Priority: active → customer → equipment → status → date-range → all
  if (filters?.activeOnly) {
    serviceFn = () => getActiveRentals(page, pageSize);
  } else if (filters?.customerId) {
    serviceFn = () => getRentalsByCustomer(filters.customerId!, page, pageSize);
  } else if (filters?.equipmentId) {
    serviceFn = () =>
      getRentalsByEquipment(filters.equipmentId!, page, pageSize);
  } else if (filters?.status) {
    serviceFn = () => getRentalsByStatus(filters.status!, page, pageSize);
  } else if (filters?.startDate && filters?.endDate) {
    serviceFn = () =>
      getRentalsByDateRange(
        filters.startDate!,
        filters.endDate!,
        page,
        pageSize
      );
  }

  return useQuery({
    queryKey: ["rentals", page, pageSize, filters],
    queryFn: serviceFn,
    staleTime: 1000 * 60 * 40, // cache trong 40 phút
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

// ==============================
// 🔹 useRentalDetail Hook
// ==============================
export const useRentalDetail = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => getRentalById(id),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: enabled && Boolean(id),
  });
};

// ==============================
// 🔹 useCheckEquipmentAvailability Hook
// ==============================
export const useCheckEquipmentAvailability = (
  equipmentId: string,
  startDate: string,
  endDate: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["equipment-availability", equipmentId, startDate, endDate],
    queryFn: () => checkEquipmentAvailability(equipmentId, startDate, endDate),
    staleTime: 1000 * 60 * 2, // chỉ cần cache 2 phút
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: enabled && Boolean(equipmentId && startDate && endDate),
  });
};

/**
 * 🆕 Hook: useCreateRental
 * Dùng để tạo rental mới.
 * Tự động invalidate cache của danh sách rentals sau khi tạo thành công.
 */
export const useCreateRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRentalRequestDto) => createRental(data),
    onSuccess: (data: RentalCreateResponse) => {
      if (data.error) {
        console.error("❌ Error creating rental:", data.error);
        return;
      }
      // Invalidate cache để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (error) => {
      console.error("❌ Failed to create rental:", error);
    },
  });
};
