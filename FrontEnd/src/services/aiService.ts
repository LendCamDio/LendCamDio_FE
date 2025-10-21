import api from "./api";
import { AI_ENDPOINTS } from "../constants/endpoints";
import type { AIMessage, AIResponse } from "@/types/index.type";
import { handleApiError } from "./apiErrorHandler";

/**
 * Gửi tin nhắn đến AI và nhận phản hồi
 * @param message Tin nhắn người dùng
 * @returns Phản hồi từ AI dưới dạng ApiResponse>AIResponse
 */
export async function sendMessage(message: string): Promise<AIResponse> {
  try {
    const response = await api.post(AI_ENDPOINTS.CHAT, message);
    return response.data;
  } catch (error) {
    return handleApiError<AIMessage>(error);
  }
}

/**
 * Yêu cầu AI tạo đề xuất cho khách hàng
 * @param customerId ID khách hàng
 * @returns Đề xuất từ AI dưới dạng ApiResponse>AIResponse
 */
export async function generateRecommendations(
  customerId: string
): Promise<AIResponse> {
  try {
    const response = await api.post(
      `${AI_ENDPOINTS.GENERATE_RECOMMENDATIONS}/${customerId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError<AIMessage>(error);
  }
}

/**
 * Đánh giá một đề xuất từ AI bởi người dùng
 * @param payload Dữ liệu đánh giá bao gồm recommendationId, rating và feedback tùy chọn
 * @returns Kết quả đánh giá dưới dạng ApiResponse>AIResponse
 */
export async function rateRecommendation(payload: {
  recommendationId: string;
  rating: number;
  feedback?: string;
}): Promise<AIResponse> {
  try {
    const response = await api.post(AI_ENDPOINTS.RATE_RECOMMENDATION, payload);
    return response.data;
  } catch (error) {
    return handleApiError<AIMessage>(error);
  }
}

/**
 * Yêu cầu AI đề xuất sản phẩm cho khách hàng
 * @param customerId ID khách hàng
 * @param categoryName Tên danh mục sản phẩm
 * @returns Đề xuất sản phẩm dưới dạng ApiResponse>AIResponse
 */
export async function generateCategoryRecommendations(
  customerId: string,
  categoryName: string
): Promise<AIResponse> {
  try {
    const response = await api.post(
      `${AI_ENDPOINTS.GENERATE_RECOMMENDATIONS}/${customerId}/category/${categoryName}`
    );
    return response.data;
  } catch (error) {
    return handleApiError<AIMessage>(error);
  }
}

/**
 * Lấy danh sách đề xuất sản phẩm cho khách hàng
 * @param customerId ID khách hàng
 * @returns Danh sách đề xuất sản phẩm dưới dạng ApiResponse>AIResponse
 */
export const getRecommendations = async (
  customerId: string
): Promise<AIResponse> => {
  try {
    const response = await api.get(`${AI_ENDPOINTS.RECOMMEND}/${customerId}`);
    return response.data;
  } catch (error) {
    return handleApiError<AIMessage>(error);
  }
};
