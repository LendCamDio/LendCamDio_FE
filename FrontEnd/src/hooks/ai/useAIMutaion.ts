import {
  sendMessage,
  rateRecommendation,
  generateCategoryRecommendations,
  getRecommendations,
} from "@/services/aiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để gửi tin nhắn đến AI (POST)
 */
export function useChatting() {
  return useMutation({
    mutationFn: (message: string) => sendMessage(message),
    retry: 1,
    onError: (error) => {
      console.error("Lỗi khi gửi tin nhắn:", error);
    },
  });
}
/**
 * Hook để tạo đề xuất cho khách hàng
 */
export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      categoryName,
    }: {
      customerId: string;
      categoryName: string;
    }) => generateCategoryRecommendations(customerId, categoryName),
    onSuccess: (data, { customerId }) => {
      console.log("Successfully generated recommendations:", data);
      // Invalidate để refetch danh sách đề xuất
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations", customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryRecommendations", customerId],
      });
    },
    retry: 1,
  });
}

/**
 * Hook để tạo đề xuất theo danh mục
 */
export function useCategoryRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      categoryName,
    }: {
      customerId: string;
      categoryName: string;
    }) => generateCategoryRecommendations(customerId, categoryName),
    onSuccess: (data, { customerId }) => {
      console.log("Successfully generated category recommendations:", data);
      // Invalidate để refetch danh sách đề xuất
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations", customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryRecommendations", customerId],
      });
    },
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
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
