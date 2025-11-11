import api from "../api";
import type { PaginatedData } from "@/types/entity.type";

export interface ReviewResponseDto {
  reviewId: string;
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentName: string;
  rating: number;
  comment?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  customerId: string;
  equipmentId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  status?: number;
}

const reviewService = {
  // Get all reviews (with pagination)
  getAllReviews: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get<PaginatedData<ReviewResponseDto>>(
      `/api/reviews?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get review by ID
  getReviewById: async (id: string) => {
    const response = await api.get<ReviewResponseDto>(`/api/reviews/${id}`);
    return response.data;
  },

  // Create new review
  createReview: async (data: CreateReviewRequest) => {
    const response = await api.post("/api/reviews", data);
    return response.data;
  },

  // Update review
  updateReview: async (id: string, data: UpdateReviewRequest) => {
    const response = await api.put(`/api/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  },

  // Get reviews by equipment ID
  getReviewsByEquipmentId: async (
    equipmentId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<ReviewResponseDto>>(
      `/api/reviews/equipment/${equipmentId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get reviews by customer ID
  getReviewsByCustomerId: async (
    customerId: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<ReviewResponseDto>>(
      `/api/reviews/customer/${customerId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get average rating for equipment
  getAverageRating: async (equipmentId: string) => {
    const response = await api.get<{
      equipmentId: string;
      averageRating: number;
    }>(`/api/reviews/equipment/${equipmentId}/average-rating`);
    return response.data;
  },

  // Get review count for equipment
  getReviewCount: async (equipmentId: string) => {
    const response = await api.get<{
      equipmentId: string;
      reviewCount: number;
    }>(`/api/reviews/equipment/${equipmentId}/review-count`);
    return response.data;
  },

  // Check if customer has reviewed equipment
  hasCustomerReviewedEquipment: async (
    customerId: string,
    equipmentId: string
  ) => {
    const response = await api.get<{
      customerId: string;
      equipmentId: string;
      hasReviewed: boolean;
    }>(`/api/reviews/customer/${customerId}/has-reviewed/${equipmentId}`);
    return response.data;
  },

  // Get reviews by rating
  getReviewsByRating: async (
    rating: number,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<PaginatedData<ReviewResponseDto>>(
      `/api/reviews/rating/${rating}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },
};

export default reviewService;
