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
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
