import type { EquipmentCategoryResponse } from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_CATEGORY_ENDPOINTS } from "@/constants/endpoints";

export async function getEquipCategories(
  page: number,
  pageSize: number
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.LIST, {
    params: { page, pageSize },
  });
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
