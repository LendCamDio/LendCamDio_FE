import {
  getEquipCategories,
  getActiveEquipCategories,
  getEquipCategoryDetails,
  createEquipCategory,
  updateEquipCategory,
  deleteEquipCategory,
  getRootEquipCategories,
  getChildrenEquipCategories,
  getEquipCategoryHierarchy,
  checkHasChildren,
  searchEquipCategories,
  getEquipCategoriesByStatus,
  checkCanDelete,
  validateParentCategory,
} from "@/services/equipmentCategroyService";
import { useQuery, useMutation } from "@tanstack/react-query";

const useEquipCategoryList = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["equipCategories", page, pageSize],
    queryFn: () => getEquipCategories(page, pageSize),
    staleTime: 1000 * 60 * 60, // keep data fresh for 1 hour
    retry: 1, // Retry failed requests up to 1 time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};

const useActiveEquipCategories = () => {
  return useQuery({
    queryKey: ["activeEquipCategories"],
    queryFn: () => getActiveEquipCategories(),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const useEquipCategoryDetails = (id: string) => {
  return useQuery({
    queryKey: ["equipCategory", id],
    queryFn: () => getEquipCategoryDetails(id),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!id, // Only fetch if id is provided
  });
};

const useCreateEquipCategory = () => {
  return useMutation({
    mutationFn: (payload: any) => createEquipCategory(payload),
  });
};

const useUpdateEquipCategory = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateEquipCategory(id, payload),
  });
};

const useDeleteEquipCategory = () => {
  return useMutation({
    mutationFn: (id: string) => deleteEquipCategory(id),
  });
};

const useRootEquipCategories = () => {
  return useQuery({
    queryKey: ["rootEquipCategories"],
    queryFn: () => getRootEquipCategories(),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const useChildrenEquipCategories = (parentId: string) => {
  return useQuery({
    queryKey: ["childrenEquipCategories", parentId],
    queryFn: () => getChildrenEquipCategories(parentId),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!parentId,
  });
};

const useEquipCategoryHierarchy = (id: string) => {
  return useQuery({
    queryKey: ["equipCategoryHierarchy", id],
    queryFn: () => getEquipCategoryHierarchy(id),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

const useCheckHasChildren = (id: string) => {
  return useQuery({
    queryKey: ["hasChildren", id],
    queryFn: () => checkHasChildren(id),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

const useSearchEquipCategories = (query: string) => {
  return useQuery({
    queryKey: ["searchEquipCategories", query],
    queryFn: () => searchEquipCategories(query),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
};

const useEquipCategoriesByStatus = (status: string) => {
  return useQuery({
    queryKey: ["equipCategoriesByStatus", status],
    queryFn: () => getEquipCategoriesByStatus(status),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!status,
  });
};

const useCheckCanDelete = (id: string) => {
  return useQuery({
    queryKey: ["canDeleteEquipCategory", id],
    queryFn: () => checkCanDelete(id),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

const useValidateParentCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["validateParentCategory", categoryId],
    queryFn: () => validateParentCategory(categoryId),
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!categoryId,
  });
};

export {
  useEquipCategoryList,
  useActiveEquipCategories,
  useEquipCategoryDetails,
  useCreateEquipCategory,
  useUpdateEquipCategory,
  useDeleteEquipCategory,
  useRootEquipCategories,
  useChildrenEquipCategories,
  useEquipCategoryHierarchy,
  useCheckHasChildren,
  useSearchEquipCategories,
  useEquipCategoriesByStatus,
  useCheckCanDelete,
  useValidateParentCategory,
};
