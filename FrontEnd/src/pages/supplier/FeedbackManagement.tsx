import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAllEquipmentList } from "@/hooks/equipment/useEquipmentAdmin";
import {
  useReviewsByEquipment,
  useAverageRating,
} from "@/hooks/review/useReview";
import { Star, MessageSquare, Search, Package } from "lucide-react";
import { formatDate } from "@/utils/equipmentHelpers";
import Loading from "@/components/common/Loading/LoadingCircle";

const FeedbackManagement = () => {
  const { user } = useAuth();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch supplier's equipments
  const { data: equipmentData, isLoading: loadingEquipments } =
    useAllEquipmentList(
      1,
      100,
      "all",
      searchTerm,
      user?.role === "Supplier" ? user.id : undefined
    );

  const equipments = equipmentData?.data?.items || [];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Feedback Management
        </h1>
        <p className="text-gray-600">
          View and manage reviews for your equipment
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Sidebar: Equipment List */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingEquipments ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : equipments.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No equipment found</p>
              </div>
            ) : (
              equipments.map((eq) => (
                <button
                  key={eq.equipmentId}
                  onClick={() => setSelectedEquipmentId(eq.equipmentId)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 hover:bg-gray-50 ${
                    selectedEquipmentId === eq.equipmentId
                      ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200"
                      : "border border-transparent"
                  }`}
                >
                  <img
                    src={eq.imageUrl || "/placeholder.jpg"}
                    alt={eq.name}
                    className="w-12 h-12 rounded-md object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium truncate ${
                        selectedEquipmentId === eq.equipmentId
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {eq.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-yellow-500 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-1 font-medium">
                          {eq.rating ? eq.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 truncate">
                        {eq.categoryName}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Content: Reviews */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {selectedEquipmentId ? (
            <EquipmentReviews equipmentId={selectedEquipmentId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select an equipment</p>
              <p className="text-sm">
                Choose an item from the list to view its reviews
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import type { ReviewResponseDto } from "@/services/api/reviewService";

// ...

const EquipmentReviews = ({ equipmentId }: { equipmentId: string }) => {
  const [page, setPage] = useState(1);
  const { data: reviewsData, isLoading } = useReviewsByEquipment(
    equipmentId,
    page,
    10
  );
  const { data: avgRatingData } = useAverageRating(equipmentId);

  const reviews = reviewsData?.data?.items || [];
  const totalPages = reviewsData?.data?.pages || 1;
  const averageRating = avgRatingData?.data?.averageRating || 0;

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-full">
      {/* Header Stats */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Average Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300 mx-4"></div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Reviews</span>
            <span className="text-2xl font-bold text-gray-900">
              {reviewsData?.data?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No reviews yet for this equipment.</p>
          </div>
        ) : (
          reviews.map((review: ReviewResponseDto) => (
            <div
              key={review.reviewId}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.customerName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mt-2 pl-13 ml-13">
                {review.comment || "No comment provided."}
              </p>
            </div>
          ))
        )}
      </div>
// ...

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
