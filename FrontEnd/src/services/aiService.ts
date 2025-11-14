import api from "./api";
import { AI_ENDPOINTS } from "../constants/endpoints";
import { handleApiError } from "./apiErrorHandler";
import type { AIResponse } from "@/types/entity.type";

/**
 * 1) Chat AI Realtime
 */
export async function sendMessage(message: string): Promise<AIResponse> {
  try {
    const response = await api.post(AI_ENDPOINTS.CHAT, message);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 2) Generate Recommendation chung (full profile)
 */
export async function generateRecommendations(
  customerId: string,
  userQuery?: string
): Promise<AIResponse> {
  try {
    const response = await api.post(
      AI_ENDPOINTS.GENERATE_RECOMMENDATIONS(customerId),
      null,
      { params: { userQuery } }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 3) Generate Recommendation theo Category
 */
export async function generateCategoryRecommendations(
  customerId: string,
  categoryName: string,
  userQuery?: string
): Promise<AIResponse> {
  try {
    const response = await api.post(
      AI_ENDPOINTS.GENERATE_RECOMMENDATIONS_BY_CATEGORY(
        customerId,
        categoryName
      ),
      null,
      { params: { userQuery } }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 4) Rating Recommendation
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
    return handleApiError(error);
  }
}

/**
 * 5) Get recommendations list
 */
export async function getRecommendations(
  customerId: string
): Promise<AIResponse> {
  try {
    const response = await api.get(AI_ENDPOINTS.RECOMMEND(customerId));
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}
