import { useQuery } from "@tanstack/react-query";
import {
  getEquipmentById,
  getEquipmentBySearchName,
  getEquipments,
  getEquipmentsByCategory,
} from "@/services/equipmentService";

const useEquipmentList = (
  page: number,
  pageSize: number,
  selectedCategory?: string,
  searchName?: string
) => {
  let serviceFn = () => getEquipments(page, pageSize);

  if (searchName) {
    serviceFn = () => getEquipmentBySearchName(searchName, page, pageSize);
  } else {
    serviceFn = () =>
      selectedCategory === "all"
        ? getEquipments(page, pageSize)
        : getEquipmentsByCategory(selectedCategory!, page, pageSize);
  }

  return useQuery({
    queryKey: ["equipments", page, pageSize, selectedCategory, searchName],
    queryFn: serviceFn,
    staleTime: 1000 * 60 * 10, // keep data fresh for 10 minutes
    retry: 3, // Retry failed requests up to 3 times
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};

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

export { useEquipmentList, useEquipmentDetail };
