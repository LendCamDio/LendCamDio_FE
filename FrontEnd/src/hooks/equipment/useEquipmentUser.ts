import { useQuery } from "@tanstack/react-query";
import {
  getEquipmentById,
  getAvailableEquipments,
  getAvailableEquipmentsByCategory,
  getEquipmentBySearchName,
  getTopRentedEquipment,
} from "@/services/equipmentService";

/**
 * Hook for USER - Get available equipments for rental
 * Only shows equipments that are:
 * - Available = true
 * - Status = Active (0)
 * - StockQuantity > 0
 */
const useEquipmentList = (
  page: number,
  pageSize: number,
  selectedCategory?: string,
  searchName?: string
) => {
  let serviceFn = () => getAvailableEquipments(page, pageSize);

  if (searchName) {
    // Search already filters for available equipments
    serviceFn = () => getEquipmentBySearchName(searchName, page, pageSize);
  } else {
    serviceFn = () =>
      selectedCategory === "all"
        ? getAvailableEquipments(page, pageSize)
        : getAvailableEquipmentsByCategory(selectedCategory!, page, pageSize);
  }

  return useQuery({
    queryKey: ["equipments", page, pageSize, selectedCategory, searchName],
    queryFn: serviceFn,
    staleTime: 1000 * 60 * 10, // keep data fresh for 10 minutes
    retry: 3, // Retry failed requests up to 3 times
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};

/**
 * Hook for USER - Get equipment details
 */
const useEquipmentDetail = (id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: () => getEquipmentById(id),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false, // Disable refetch on window focus
    enabled: enabled && Boolean(id), // Only run this query if id is truthy
  });
};

/*
 * Top rented equipments
 */
const useTopRentedEquipment = (topN: number) => {
  return useQuery({
    queryKey: ["topRentedEquipment", topN],
    queryFn: () => getTopRentedEquipment(topN),
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export { useEquipmentList, useEquipmentDetail, useTopRentedEquipment };
