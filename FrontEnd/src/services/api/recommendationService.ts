import api from "../api";
import type { PaginatedData } from "@/types/entity.type";

export interface RecommendationResponseDto {
  recommendationId: string;
  customerId: string;
  equipmentId: string;
  equipmentName: string;
  score: number;
  reason?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecommendationRequest {
  customerId: string;
  equipmentId: string;
  score: number;
  reason?: string;
}

export interface UpdateRecommendationRequest {
  score?: number;
  reason?: string;
  status?: number;
}

const recommendationService = {
  // Get all recommendations (Admin only)
  getAllRecommendations: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get active recommendations (Admin only)
  getActiveRecommendations: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations/active?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get recommendation by ID
  getRecommendationById: async (id: string) => {
    const response = await api.get<RecommendationResponseDto>(
      `/api/recommendations/${id}`
    );
    return response.data;
  },

  // Get recommendations by customer ID
  getRecommendationsByCustomerId: async (
    customerId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations/customer/${customerId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get recommendations by equipment ID
  getRecommendationsByEquipmentId: async (
    equipmentId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations/equipment/${equipmentId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get top recommendations for customer
  getTopRecommendations: async (
    customerId: string,
    count: number,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations/customer/${customerId}/top/${count}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get similar equipment recommendations
  getSimilarEquipmentRecommendations: async (
    equipmentId: string,
    count: number,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<RecommendationResponseDto>>(
      `/api/recommendations/equipment/${equipmentId}/similar/${count}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get average score for equipment
  getAverageScore: async (equipmentId: string) => {
    const response = await api.get<{
      equipmentId: string;
      averageScore: number;
    }>(`/api/recommendations/equipment/${equipmentId}/average-score`);
    return response.data;
  },
};

export default recommendationService;
