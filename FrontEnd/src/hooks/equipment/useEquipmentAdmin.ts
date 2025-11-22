import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentAvailability,
  updateEquipmentStock,
  getEquipmentsByCategory,
  getAllEquipmentBySearchName,
  getEquipmentsBySupplier,
} from "@/services/equipmentService";
import type {
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
} from "@/types/entity.type";

/**
 * Hook for ADMIN - Get ALL equipments (including unavailable ones)
 * Shows all equipments regardless of availability, status, or stock
 * Used for admin management purposes
 */
const useAllEquipmentList = (
  page: number,
  pageSize: number,
  selectedCategory?: string,
  searchName?: string,
  supplierId?: string
) => {
  let serviceFn = () => getEquipments(page, pageSize);

  if (supplierId) {
    serviceFn = () => getEquipmentsBySupplier(supplierId, page, pageSize);
  } else if (searchName) {
    serviceFn = () => getAllEquipmentBySearchName(searchName, page, pageSize);
  } else {
    serviceFn = () =>
      selectedCategory === "all"
        ? getEquipments(page, pageSize)
        : getEquipmentsByCategory(selectedCategory!, page, pageSize);
  }

  return useQuery({
    queryKey: [
      "all-equipments",
      page,
      pageSize,
      selectedCategory,
      searchName,
      supplierId,
    ],
    queryFn: serviceFn,
    staleTime: 1000 * 60 * 10, // keep data fresh for 10 minutes
    retry: 3, // Retry failed requests up to 3 times
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};

/**
 * Hook for ADMIN - Create new equipment
 * Automatically invalidates equipment queries after success
 */
const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEquipmentRequestDto) => createEquipment(data),
    onSuccess: () => {
      // Invalidate and refetch all equipment queries
      queryClient.invalidateQueries({ queryKey: ["all-equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });
};

/**
 * Hook for ADMIN - Update equipment
 * Automatically invalidates equipment queries after success
 */
const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEquipmentRequestDto;
    }) => updateEquipment(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["all-equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] }); // Single equipment details
    },
  });
};

/*
 * Hook for ADMIN - Upload equipment image
 * Automatically invalidates equipment queries after success
 */
// const useUploadEquipmentImage = () => {};

/**
 * Hook for ADMIN - Delete equipment (soft delete)
 * Automatically invalidates equipment queries after success
 */
const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEquipment(id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["all-equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });
};

/**
 * Hook for ADMIN - Update equipment availability
 * Automatically invalidates equipment queries after success
 */
const useUpdateEquipmentAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: boolean }) =>
      updateEquipmentAvailability(id, availability),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["all-equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};

/**
 * Hook for ADMIN - Update equipment stock quantity
 * Automatically invalidates equipment queries after success
 */
const useUpdateEquipmentStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateEquipmentStock(id, quantity),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["all-equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};

export {
  useAllEquipmentList,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
  useUpdateEquipmentAvailability,
  useUpdateEquipmentStock,
};
