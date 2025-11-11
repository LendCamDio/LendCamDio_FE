import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  Star,
  ThumbsUp,
  Filter,
  SortDesc,
  MessageSquare,
  Edit2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import reviewService, {
  type ReviewResponseDto,
} from "@/services/api/reviewService";
import { useUser } from "@/hooks/user/useUser";
import { useCustomerByUserId } from "@/hooks/customer/useCustomer";
import { ConfirmDialog } from "@/components/ui/Dialog";

const Reviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: user } = useUser();
  const { data: customer } = useCustomerByUserId(
    user?.userId || "",
    Boolean(user?.userId)
  );
  const equipmentId = searchParams.get("equipmentId");

  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (customer?.data?.customerId) {
      loadReviews();
    }
  }, [customer, equipmentId, filterRating, sortBy]);

  const loadReviews = async () => {
    if (!customer?.data?.customerId) return;

    setLoading(true);
    try {
      let response;

      if (equipmentId) {
        // Load reviews for specific equipment
        response = await reviewService.getReviewsByEquipmentId(
          equipmentId,
          1,
          50
        );
      } else if (filterRating) {
        // Load reviews by rating
        response = await reviewService.getReviewsByRating(filterRating, 1, 50);
      } else {
        // Load customer's own reviews
        response = await reviewService.getReviewsByCustomerId(
          customer.data.customerId,
          1,
          50
        );
      }

      if (response.items) {
        let sortedReviews = [...response.items];

        // Apply sorting
        switch (sortBy) {
          case "newest":
            sortedReviews.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "oldest":
            sortedReviews.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
            break;
          case "highest":
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
          case "lowest":
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        }

        setReviews(sortedReviews);
      }
    } catch (error: any) {
      console.error("Failed to load reviews:", error);
      toast.error("Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await reviewService.deleteReview(reviewToDelete);
      toast.success("Đã xóa đánh giá");
      loadReviews();
    } catch (error) {
      toast.error("Không thể xóa đánh giá");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <PageWrapper>
      <div className="min-page-height bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Đánh giá sản phẩm
            </h1>
            <p className="text-gray-600">Xem và quản lý đánh giá của bạn</p>
          </motion.div>

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Filter by Rating */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterRating || ""}
                  onChange={(e) =>
                    setFilterRating(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả đánh giá</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortDesc className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest">Đánh giá cao nhất</option>
                  <option value="lowest">Đánh giá thấp nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Chưa có đánh giá</h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có đánh giá nào. Hãy đánh giá sản phẩm sau khi sử dụng!
              </p>
              <button
                onClick={() => navigate("/customer/booking-history")}
                className="btn-primary"
              >
                Xem đơn hàng của tôi
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {review.equipmentName}
                      </h3>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/customer/reviews/edit/${review.reviewId}`)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(review.reviewId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(review.createdAt)}</span>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Hữu ích</span>
                      </button>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.status === 1
                            ? "bg-green-100 text-green-700"
                            : review.status === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {review.status === 1
                          ? "Đã duyệt"
                          : review.status === 0
                          ? "Chờ duyệt"
                          : "Bị từ chối"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa đánh giá"
        message="Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        type="danger"
      />
    </PageWrapper>
  );
};

export default Reviews;
