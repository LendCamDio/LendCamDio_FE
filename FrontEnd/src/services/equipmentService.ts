import type {
  Equipment,
  EquipmentResponse,
  PaginatedData,
  SingleEquipmentResponse,
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
  CreateEquipmentResponse,
  UpdateEquipmentResponse,
  ApiResponse,
} from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_ENDPOINTS, REVIEW_ENDPOINTS } from "@/constants/endpoints";

/**
 * Helper function to filter only available equipment
 * Available = Availability=true AND Status=0 (Active) AND StockQuantity>0
 */
function filterAvailableEquipment(items: Equipment[]): Equipment[] {
  return items.filter(
    (item) =>
      item.availability === true &&
      item.status === 0 && // EquipmentStatus.Active
      item.stockQuantity > 0
  );
}

/**
 * Helper function to fetch ratings for equipment items
 */
async function fetchRatingsForEquipment(items: Equipment[]): Promise<void> {
  await Promise.all(
    items.map(async (item: Equipment) => {
      try {
        const resRate = await api.get(
          REVIEW_ENDPOINTS.AVERAGE_RATING_BY_EQUIPMENT(item.equipmentId)
        );
        item.rating = resRate.data.data.averageRating || 0;
      } catch (error) {
        console.error(`Error fetching rating for ${item.equipmentId}:`, error);
        item.rating = 0;
      }
    })
  );
}

/**
 * Unified function to get available equipments with optional filters
 * Backend /api/equipments/available only supports pagination (page, pageSize)
 * For search and category filter, use separate endpoints
 */
export async function getAvailableEquipments(
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const params = { page, pageSize };
  console.log("📥 GET /api/equipments/available with params:", params);
  const res = await api.get(EQUIPMENT_ENDPOINTS.AVAILABLE, { params });

  if (!res.data?.data?.items) {
    return {
      success: res.data.success,
      data: res.data.data,
      timestamp: res.data.timestamp,
    };
  }
  await fetchRatingsForEquipment(res.data.data.items);
  console.log("✅ Fetched", res.data.data.items.length, "available equipments");
  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Get all available equipment (Active, Available, Stock > 0)
 * Endpoint: GET /api/equipments/available?page=1&pageSize=10
 */
export async function getEquipments(
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const params = { page, pageSize };
  console.log("📥 GET /api/equipments/available with params:", params);

  const res = await api.get(EQUIPMENT_ENDPOINTS.AVAILABLE, { params });

  if (!res.data?.data?.items) {
    return {
      success: res.data.success,
      data: res.data.data,
      timestamp: res.data.timestamp,
    };
  }

  await fetchRatingsForEquipment(res.data.data.items);
  console.log("✅ Fetched", res.data.data.items.length, "available equipments");

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Search equipment by name
 * Endpoint: GET /api/equipments/search?name=xxx&page=1&pageSize=10
 * Note: Filtered to only available equipments in backend
 */
export async function getEquipmentBySearchName(
  name: string,
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const params = { name, page, pageSize };
  console.log("🔎 GET /api/equipments/search with params:", params);

  const res = await api.get(EQUIPMENT_ENDPOINTS.SEARCH, { params });

  if (!res.data?.data?.items) {
    return {
      success: res.data.success,
      data: res.data.data,
      timestamp: res.data.timestamp,
    };
  }

  await fetchRatingsForEquipment(res.data.data.items);
  console.log("✅ Found", res.data.data.items.length, "equipments by search");

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Get equipment by ID
 * Endpoint: GET /api/equipments/{id}
 */
export async function getEquipmentById(
  id: string
): Promise<SingleEquipmentResponse> {
  console.log("📥 GET /api/equipments/" + id);

  const res = await api.get(EQUIPMENT_ENDPOINTS.DETAILS(id));

  try {
    const resRate = await api.get(
      REVIEW_ENDPOINTS.AVERAGE_RATING_BY_EQUIPMENT(res.data.data.equipmentId)
    );
    res.data.data.rating = resRate.data.data.averageRating || 0;
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.data.data.rating = 0;
  }

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Get equipment by category
 * Endpoint: GET /api/equipments/category/{categoryId}?page=1&pageSize=10
 * Note: Not filtered to only available equipments in backend
 * @param category The category name to filter equipments
 */
export async function getEquipmentsByCategory(
  category: string,
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const params = { page, pageSize };
  console.log(
    `🏷️ GET /api/equipments/category/${category} with params:`,
    params
  );

  const res = await api.get(EQUIPMENT_ENDPOINTS.CATEGORY(category), {
    params,
  });

  // If no items, return early
  if (!res.data?.data?.items) {
    return {
      success: res.data.success,
      data: res.data.data,
      timestamp: res.data.timestamp,
    };
  }

  await fetchRatingsForEquipment(res.data.data.items);
  console.log(
    "✅ Fetched",
    res.data.data.items.length,
    "equipments in category"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

export async function getAvailableEquipmentsByCategory(
  category: string,
  page: number,
  pageSize: number
): Promise<EquipmentResponse> {
  const res = await getEquipmentsByCategory(category, page, pageSize);
  const availableItems = filterAvailableEquipment(res.data?.items || []);
  const newData = {
    ...res.data,
    items: availableItems,
  };
  return {
    success: res.success,
    data: newData as PaginatedData<Equipment>,
    timestamp: res.timestamp,
  };
}

/**
 * Create a new equipment
 * Endpoint: POST /api/equipments
 * Authorization: Admin, Supplier
 */
export async function createEquipment(
  data: CreateEquipmentRequestDto
): Promise<CreateEquipmentResponse> {
  console.log("📤 POST /api/equipments with data:", data);

  const res = await api.post(EQUIPMENT_ENDPOINTS.CREATE, data);

  console.log(
    "✅ Equipment created:",
    res.data.success ? "Successfully" : "Failed"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Update an existing equipment
 * Endpoint: PUT /api/equipments/{id}
 * Authorization: Admin, Supplier
 */
export async function updateEquipment(
  id: string,
  data: UpdateEquipmentRequestDto
): Promise<UpdateEquipmentResponse> {
  console.log(`📤 PUT /api/equipments/${id} with data:`, data);

  const res = await api.put(EQUIPMENT_ENDPOINTS.UPDATE(id), data);

  console.log(
    "✅ Equipment updated:",
    res.data.success ? "Successfully" : "Failed"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Delete an equipment (soft delete - marks as Inactive)
 * Endpoint: DELETE /api/equipments/{id}
 * Authorization: Admin, Supplier
 */
export async function deleteEquipment(
  id: string
): Promise<ApiResponse<{ equipmentId: string; message: string }>> {
  console.log(`🗑️ DELETE /api/equipments/${id}`);

  const res = await api.delete(EQUIPMENT_ENDPOINTS.DELETE(id));

  console.log(
    "✅ Equipment deleted:",
    res.data.success ? "Successfully" : "Failed"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Update equipment availability
 * Endpoint: PATCH /api/equipments/{id}/availability
 * Authorization: Admin, Supplier
 */
export async function updateEquipmentAvailability(
  id: string,
  availability: boolean
): Promise<
  ApiResponse<{ equipmentId: string; availability: boolean; message: string }>
> {
  console.log(
    `🔄 PATCH /api/equipments/${id}/availability - Set to: ${availability}`
  );

  const res = await api.patch(
    EQUIPMENT_ENDPOINTS.AVAILABILITY(id),
    availability
  );

  console.log(
    "✅ Availability updated:",
    res.data.success ? "Successfully" : "Failed"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}

/**
 * Update equipment stock quantity
 * Endpoint: PATCH /api/equipments/{id}/stock
 * Authorization: Admin, Supplier
 */
export async function updateEquipmentStock(
  id: string,
  quantity: number
): Promise<
  ApiResponse<{ equipmentId: string; stockQuantity: number; message: string }>
> {
  console.log(
    `📦 PATCH /api/equipments/${id}/stock - Set quantity to: ${quantity}`
  );

  const res = await api.patch(EQUIPMENT_ENDPOINTS.STOCK(id), quantity);

  console.log(
    "✅ Stock updated:",
    res.data.success ? "Successfully" : "Failed"
  );

  return {
    success: res.data.success,
    data: res.data.data,
    timestamp: res.data.timestamp,
  };
}
