import type { EquipmentResponse } from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_ENDPOINTS } from "@/constants/endpoints";

export async function getEquipments(
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const res = await api.get(EQUIPMENT_ENDPOINTS.LIST, {
    params: { page, pageSize },
  });
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
