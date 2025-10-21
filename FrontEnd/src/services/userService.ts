import api from "./api";
import { USER_ENDPOINTS } from "@/constants/endpoints";
import { handleApiError } from "./apiErrorHandler";
import type {
  ApiResponse,
  PaginatedData,
  UpdateUserRequestDto,
  UpdateUserResponse,
  UserInfo,
  UserResponse,
} from "@/types/entity.type";

// ============================
// 📜 GET METHODS
// ============================

// Lấy danh sách user cơ bản
// export const getUsers = async (
//   page: number,
//   pageSize: number
// ): Promise<UserListResponse> => {
//   try {
//     const res = await api.get(USER_ENDPOINTS.LIST, {
//       params: { page, pageSize },
//     });
//     return res.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// Lấy danh sách user chi tiết
// export const getDetailedUsers = async (
//   page: number,
//   pageSize: number
// ): Promise<UserListResponse> => {
//   try {
//     const res = await api.get(USER_ENDPOINTS.DETAILED_LIST, {
//       params: { page, pageSize },
//     });
//     return res.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// Lấy chi tiết user theo ID
export const getUserById = async (
  id: string | number
): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.DETAILS(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy hồ sơ user hiện tại
export const getUserProfile = async (): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.PROFILE);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy hồ sơ chi tiết user hiện tại
export const getUserProfileDetailed = async (): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.PROFILE_DETAILED);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy hồ sơ chi tiết user theo ID
export const getDetailedProfileById = async (
  id: string | number
): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.DETAILED_PROFILE_BY_ID(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Lấy danh sách user đang active
export const getActiveUsers = async (): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.ACTIVE);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Tìm kiếm user theo email
export const searchUserByEmail = async (
  email: string
): Promise<UserResponse> => {
  try {
    const res = await api.get(USER_ENDPOINTS.SEARCH, {
      params: { email },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Debug claims (nếu backend có)
// export const getUserDebugClaims = async (): Promise<ApiResponse<object>> => {
//   try {
//     const res = await api.get(USER_ENDPOINTS.DEBUG_CLAIMS);
//     return res.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// ============================
// ✍️ CREATE / UPDATE / DELETE
// ============================

// Cập nhật thông tin user
export const updateUser = async (
  id: string | number,
  dto: UpdateUserRequestDto
): Promise<UpdateUserResponse> => {
  try {
    const res = await api.put(USER_ENDPOINTS.UPDATE(id), dto);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Xóa user
export const deleteUser = async (
  id: string | number
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.delete(USER_ENDPOINTS.DELETE(id));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ============================
// ⚙️ PATCH METHODS
// ============================

// Cập nhật avatar user
export const updateUserAvatar = async (
  id: string | number,
  file: File
): Promise<ApiResponse<object>> => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.patch(USER_ENDPOINTS.UPDATE_AVATAR(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Cập nhật trạng thái user (Active / Inactive / Banned, v.v.)
export const updateUserStatus = async (
  id: string | number,
  status: string
): Promise<ApiResponse<object>> => {
  try {
    const res = await api.put(USER_ENDPOINTS.UPDATE_STATUS(id), { status });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
