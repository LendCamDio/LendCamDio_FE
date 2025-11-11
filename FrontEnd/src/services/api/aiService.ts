import api from "../api";

export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  response: string;
}

export interface RecommendationItem {
  recommendationId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  category: string;
  score: number;
  reason: string;
  price: number;
  dailyPrice?: number;
  rating: number;
  availability: boolean;
}

export interface GenerateRecommendationsResponse {
  success: boolean;
  data: RecommendationItem[];
  customerId: string;
  savedToDatabase: boolean;
  message: string;
  timestamp: string;
}

export interface RateRecommendationRequest {
  recommendationId: string;
  rating: number;
  feedback?: string;
}

export interface RateLimitInfo {
  dailyLimit: number;
  hourlyLimit: number;
  minuteLimit: number;
}

export interface RateLimitStatus {
  isAllowed: boolean;
  remainingRequests: number;
  resetTime: string;
  limitType: string;
}

const aiService = {
  // Chat with AI
  chat: async (prompt: string) => {
    const response = await api.post<ChatResponse>("/api/ai/chat", prompt, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  // Generate recommendations for customer
  generateRecommendations: async (
    customerId: string,
    userQuery?: string,
    saveToDatabase: boolean = false
  ) => {
    const params = new URLSearchParams();
    if (userQuery) params.append("userQuery", userQuery);
    params.append("saveToDatabase", saveToDatabase.toString());

    const response = await api.post<GenerateRecommendationsResponse>(
      `/api/ai/generate-recommendations/${customerId}?${params.toString()}`
    );
    return response.data;
  },

  // Generate recommendations by category
  generateRecommendationsByCategory: async (
    customerId: string,
    categoryName: string,
    userQuery?: string,
    saveToDatabase: boolean = false
  ) => {
    const params = new URLSearchParams();
    if (userQuery) params.append("userQuery", userQuery);
    params.append("saveToDatabase", saveToDatabase.toString());

    const response = await api.post<GenerateRecommendationsResponse>(
      `/api/ai/generate-recommendations/${customerId}/category/${categoryName}?${params.toString()}`
    );
    return response.data;
  },

  // Rate recommendation
  rateRecommendation: async (data: RateRecommendationRequest) => {
    const response = await api.post("/api/ai/rate-recommendation", data);
    return response.data;
  },

  // Get recommendations for customer
  getRecommendations: async (customerId: string, userQuery?: string) => {
    const params = userQuery
      ? `?userQuery=${encodeURIComponent(userQuery)}`
      : "";
    const response = await api.get<GenerateRecommendationsResponse>(
      `/api/ai/recommend/${customerId}${params}`
    );
    return response.data;
  },

  // Get rate limits
  getRateLimits: async () => {
    const response = await api.get<RateLimitInfo>("/api/ai/rate-limits");
    return response.data;
  },

  // Check chat rate limit status
  checkChatRateLimit: async (userId: string, membershipLevel: number = 0) => {
    const response = await api.get<RateLimitStatus>(
      `/api/ai/rate-limit-status/chat/${userId}?membershipLevel=${membershipLevel}`
    );
    return response.data;
  },

  // Check recommend rate limit status
  checkRecommendRateLimit: async (
    userId: string,
    membershipLevel: number = 0
  ) => {
    const response = await api.get<RateLimitStatus>(
      `/api/ai/rate-limit-status/recommend/${userId}?membershipLevel=${membershipLevel}`
    );
    return response.data;
  },
};

export default aiService;
