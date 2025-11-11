import api from "./api";

export enum MediaType {
  Profile = "Profile",
  Equipment = "Equipment",
  Supplier = "Supplier",
  Review = "Review",
  Other = "Other",
}

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
  };
  message?: string;
}

/**
 * Upload image to Cloudinary via backend
 */
export async function uploadImage(
  file: File,
  type: MediaType = MediaType.Equipment
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await api.post("/api/cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: File[],
  type: MediaType = MediaType.Equipment
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadImage(file, type));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await api.delete(`/api/cloudinary/delete/${publicId}`);
  } catch (error: any) {
    console.error("Delete error:", error);
    throw new Error(error.response?.data?.message || "Failed to delete image");
  }
}
