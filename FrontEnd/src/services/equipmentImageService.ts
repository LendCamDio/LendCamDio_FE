import type { UploadEquipmentImageRequest } from "@/types/entity.type";
import api from "./api";
import { EQUIPMENT_IMAGE_ENDPOINTS } from "@/constants/endpoints";
import { handleApiError } from "./apiErrorHandler";

/**
 * Upload equipment image
 * Endpoint: POST /api/equipments/{id}/image
 * Authorization: Admin, Supplier
 */
export async function uploadEquipmentImage(data: UploadEquipmentImageRequest) {
  try {
    const { equipmentId, ...formData } = data;
    const formDataToSend = new FormData();
    formDataToSend.append("equipmentId", equipmentId);
    formDataToSend.append("file", formData.imageFile);
    formDataToSend.append("type", "0"); // Gallery type
    formDataToSend.append("isPrimary", "true");

    console.log("📤 Uploading image for equipment:", equipmentId);

    const response = await api.post(
      EQUIPMENT_IMAGE_ENDPOINTS.UPLOAD,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(
      "✅ Image upload response:",
      response.data.success ? "Successfully" : "Failed"
    );
    return {
      success: response.data.success,
      data: response.data.data,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    handleApiError(error);
  }
}
