import {
  sendMessage,
  generateRecommendations,
  rateRecommendation,
  generateCategoryRecommendations,
  getRecommendations,
} from "@/services/aiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để lấy phản hồi từ AI
 */
export function useChatting(message: string) {
  return useQuery({
    queryKey: ["aiResponse", message],
    queryFn: () => sendMessage(message),
    enabled: !!message,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook để tạo đề xuất cho khách hàng
 */
export function useGenerateRecommendations(customerId: string) {
  return useQuery({
    queryKey: ["recommendations", customerId],
    queryFn: () => generateRecommendations(customerId),
    enabled: !!customerId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook để tạo đề xuất theo danh mục
 */
export function useCategoryRecommendations(
  customerId: string,
  categoryName: string
) {
  return useQuery({
    queryKey: ["categoryRecommendations", customerId, categoryName],
    queryFn: () => generateCategoryRecommendations(customerId, categoryName),
    enabled: !!customerId && !!categoryName,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook để lấy danh sách đề xuất
 */
export function useGetRecommendations(customerId: string) {
  return useQuery({
    queryKey: ["userRecommendations", customerId],
    queryFn: () => getRecommendations(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook để đánh giá đề xuất
 */
export function useRateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      recommendationId: string;
      rating: number;
      feedback?: string;
    }) => rateRecommendation(payload),
    onSuccess: (data, variables) => {
      // Invalidate để refetch danh sách đề xuất
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations"],
      });
      console.log(
        "Successfully rated recommendation:",
        variables.recommendationId,
        data
      );
    },
    onError: (error) => {
      console.error("Error rating recommendation:", error);
    },
  });
}
