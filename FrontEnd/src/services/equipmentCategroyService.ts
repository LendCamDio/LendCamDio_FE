import type { EquipmentCategoryResponse } from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_CATEGORY_ENDPOINTS } from "@/constants/endpoints";
// ============================
// 🧾 Equipment Category Methods
// ============================
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

export async function getActiveEquipCategories(): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.ACTIVE);
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getEquipCategoryDetails(
  id: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.DETAILS(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function createEquipCategory(
  payload: any
): Promise<EquipmentCategoryResponse> {
  const res = await api.post(EQUIPMENT_CATEGORY_ENDPOINTS.CREATE, payload);
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function updateEquipCategory(
  id: string,
  payload: any
): Promise<EquipmentCategoryResponse> {
  const res = await api.put(EQUIPMENT_CATEGORY_ENDPOINTS.UPDATE(id), payload);
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function deleteEquipCategory(
  id: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.delete(EQUIPMENT_CATEGORY_ENDPOINTS.DELETE(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getRootEquipCategories(): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.ROOT);
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getChildrenEquipCategories(
  parentId: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.CHILDREN(parentId));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getEquipCategoryHierarchy(
  id: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.HIERARCHY(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function checkHasChildren(
  id: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.HAS_CHILDREN(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function searchEquipCategories(
  query: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.SEARCH, {
    params: { query },
  });
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getEquipCategoriesByStatus(
  status: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.STATUS(status));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function checkCanDelete(
  id: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(EQUIPMENT_CATEGORY_ENDPOINTS.CAN_DELETE(id));
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function validateParentCategory(
  categoryId: string
): Promise<EquipmentCategoryResponse> {
  const res = await api.get(
    EQUIPMENT_CATEGORY_ENDPOINTS.VALIDATE_PARENT(categoryId)
  );
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
