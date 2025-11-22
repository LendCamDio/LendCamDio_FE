import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "@/services/api/reviewService";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
} from "@/services/api/reviewService";

// Get reviews by equipment ID
export const useReviewsByEquipment = (
  equipmentId: string,
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ["reviews", "equipment", equipmentId, page, pageSize],
    queryFn: () =>
      reviewService.getReviewsByEquipmentId(equipmentId, page, pageSize),
    enabled: !!equipmentId, // Only run if equipmentId is provided
  });
};

// Get average rating for equipment
export const useAverageRating = (equipmentId: string) => {
  return useQuery({
    queryKey: ["reviews", "average", equipmentId],
    queryFn: () => reviewService.getAverageRating(equipmentId),
    enabled: !!equipmentId,
  });
};

// Get review count for equipment
export const useReviewCount = (equipmentId: string) => {
  return useQuery({
    queryKey: ["reviews", "count", equipmentId],
    queryFn: () => reviewService.getReviewCount(equipmentId),
    enabled: !!equipmentId,
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewService.createReview(data),
    onSuccess: (_, variables) => {
      // Invalidate reviews for the specific equipment
      queryClient.invalidateQueries({
        queryKey: ["reviews", "equipment", variables.equipmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "average", variables.equipmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "count", variables.equipmentId],
      });
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewRequest }) =>
      reviewService.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
