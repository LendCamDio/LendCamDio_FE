import {
  sendMessage,
  generateRecommendations,
  generateCategoryRecommendations,
  getRecommendations,
  rateRecommendation,
} from "@/services/aiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * CHAT AI
 */
export function useChatting() {
  return useMutation({
    mutationFn: (message: string) => sendMessage(message),
    retry: 1,
  });
}

/**
 * RECOMMENDATION FULL PROFILE
 */
export function useGenerateRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      userQuery,
    }: {
      customerId: string;
      userQuery?: string;
    }) => generateRecommendations(customerId, userQuery),

    onSuccess: (_, { customerId }) =>
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations", customerId],
      }),
  });
}

/**
 * RECOMMENDATION CATEGORY
 */
export function useCategoryRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      categoryName,
      userQuery,
    }: {
      customerId: string;
      categoryName: string;
      userQuery?: string;
    }) => generateCategoryRecommendations(customerId, categoryName, userQuery),

    onSuccess: (_, { customerId }) =>
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations", customerId],
      }),
  });
}

/**
 * GET RECOMMENDATION LIST
 */
export function useGetRecommendations(customerId: string) {
  return useQuery({
    queryKey: ["userRecommendations", customerId],
    queryFn: () => getRecommendations(customerId),
    enabled: !!customerId,
    staleTime: 60000, // 1 phút
  });
}

/**
 * RATE RECOMMENDATION
 */
export function useRateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rateRecommendation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userRecommendations"],
      });
    },
  });
}
