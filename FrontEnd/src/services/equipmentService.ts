import type { Equipment, EquipmentResponse } from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_ENDPOINTS, REVIEW_ENDPOINTS } from "@/constants/endpoints";

export async function getEquipments(
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const res = await api.get(EQUIPMENT_ENDPOINTS.LIST, {
    params: { page, pageSize },
  });
  await Promise.all(
    res.data.data.items.map(async (item: Equipment) => {
      const resRate = await api.get(
        REVIEW_ENDPOINTS.AVERAGE_RATING_BY_EQUIPMENT(item.equipmentId)
      );
      item.rating = resRate.data.data.averageRating || 0;
    })
  ).catch((error) => {
    console.error("Error fetching ratings:", error);
    res.data.success = false;
  });

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getEquipmentBySearchName(
  name: string,
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const res = await api.get(EQUIPMENT_ENDPOINTS.SEARCH, {
    params: { name, page, pageSize },
  });
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
export async function getEquipmentById(id: string): Promise<EquipmentResponse> {
  const res = await api.get(EQUIPMENT_ENDPOINTS.DETAILS(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getEquipmentsByCategory(
  category: string,
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const res = await api.get(EQUIPMENT_ENDPOINTS.CATEGORY(category), {
    params: { page, pageSize },
  });
  console.log("Load equips:", res.data);
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
