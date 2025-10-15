import { getEquipCategories } from "@/services/equipmentCategroyService";
import { useQuery } from "@tanstack/react-query";

const useEquipCategoryList = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["equipCategories", page, pageSize],
    queryFn: () => getEquipCategories(page, pageSize),
    staleTime: 1000 * 60 * 60, // keep data fresh for 1 hour
    retry: 1, // Retry failed requests up to 1 time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};

export { useEquipCategoryList };
