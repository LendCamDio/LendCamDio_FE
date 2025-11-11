import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import { Sparkles, TrendingUp, ShoppingCart, Star, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import aiService, { type RecommendationItem } from "@/services/api/aiService";
import { useUser } from "@/hooks/user/useUser";
import { useCustomerByUserId } from "@/hooks/customer/useCustomer";

const Recommendations = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: customer } = useCustomerByUserId(
    user?.userId || "",
    Boolean(user?.userId)
  );

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (customer?.data?.customerId) {
      loadRecommendations();
    }
  }, [customer, selectedCategory]);

  const loadRecommendations = async () => {
    if (!customer?.data?.customerId) return;

    setLoading(true);
    try {
      if (selectedCategory === "all") {
        // Get AI recommendations for all categories
        const result = await aiService.getRecommendations(
          customer.data.customerId
        );
        if (result.data) {
          setRecommendations(result.data);
        }
      } else {
        // Get AI recommendations by specific category
        const result = await aiService.generateRecommendationsByCategory(
          customer.data.customerId,
          selectedCategory,
          undefined,
          false
        );
        if (result.data) {
          setRecommendations(result.data);
        }
      }
    } catch (error: any) {
      console.error("Failed to load recommendations:", error);
      toast.error("Không thể tải gợi ý");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIRecommendations = async () => {
    if (!customer?.data?.customerId) return;

    setGeneratingAI(true);
    try {
      const response = await aiService.generateRecommendations(
        customer.data.customerId,
        "Gợi ý các thiết bị nhiếp ảnh phù hợp với tôi dựa trên lịch sử và sở thích",
        true
      );

      if (response.data) {
        setRecommendations(response.data);
        toast.success("Đã tạo gợi ý AI mới!");
      }
    } catch (error: any) {
      console.error("Failed to generate AI recommendations:", error);
      toast.error("Không thể tạo gợi ý AI");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAddToCart = (equipmentId: string) => {
    console.log("Add to cart:", equipmentId);
    // TODO: Implement cart API
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <PageWrapper>
      <div className="min-page-height bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Đề xuất cho bạn
                  </h1>
                  <p className="text-gray-600">
                    Sản phẩm được AI gợi ý dựa trên sở thích của bạn
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateAIRecommendations}
                disabled={loading || generatingAI}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition disabled:opacity-50"
              >
                <TrendingUp className="w-5 h-5" />
                {generatingAI ? "Đang tạo..." : "Tạo đề xuất AI mới"}
              </button>
            </div>
          </motion.div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Lọc theo danh mục:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "Camera", "Lens", "Lighting", "Accessories"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "all" ? "Tất cả" : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Recommendations Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tạo đề xuất cho bạn...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Chưa có đề xuất</h3>
              <p className="text-gray-600 mb-6">
                Hãy thuê thêm sản phẩm để chúng tôi có thể đề xuất tốt hơn!
              </p>
              <button
                onClick={handleGenerateAIRecommendations}
                className="btn-primary"
                disabled={generatingAI}
              >
                {generatingAI ? "Đang tạo..." : "Tạo đề xuất ngay"}
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.recommendationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.equipmentImage}
                      alt={item.equipmentName}
                      className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      onClick={() => navigate(`/products/${item.equipmentId}`)}
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {Math.round(item.score * 100)}%
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600 line-clamp-2"
                      onClick={() => navigate(`/products/${item.equipmentId}`)}
                    >
                      {item.equipmentName}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.reason}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-600 font-bold text-lg">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-sm text-gray-500">/ngày</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item.equipmentId)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/products/${item.equipmentId}`)
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Xem
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Làm thế nào để có đề xuất tốt hơn?
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Thuê và sử dụng nhiều sản phẩm khác nhau</li>
                  <li>• Đánh giá sản phẩm sau khi sử dụng</li>
                  <li>• Cung cấp phản hồi về đề xuất</li>
                  <li>• Cập nhật sở thích trong hồ sơ của bạn</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Recommendations;
