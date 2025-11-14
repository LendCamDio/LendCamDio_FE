import {
  useGetRecommendations,
  useRateRecommendation,
} from "@/hooks/ai/useAIMutaion";
import { Star } from "lucide-react";
import type { RecommendationResponse } from "@/types/entity.type";

const SuggestionList = ({ customerId }: { customerId: string }) => {
  // 1. Dùng hook mới để lấy data đã lưu
  const { data, isLoading } = useGetRecommendations(customerId);
  const { mutate: rate } = useRateRecommendation();

  // 2. Data trả về từ controller là ApiResponse<RecommendationResponse[]>
  //    Nên data.data chính là mảng recommendations
  const recommendations = data?.data?.data?.recommendations || [];

  if (isLoading)
    return (
      <div className="p-4 text-gray-500 animate-pulse">Đang tải gợi ý...</div>
    );

  if (!recommendations.length)
    return <div className="p-4 text-gray-500">Chưa có gợi ý nào</div>;

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg mb-2">Gợi ý đã lưu cho bạn</h3>

      {recommendations.map((rec: RecommendationResponse) => (
        <div
          key={rec.RecId} // <-- Sửa: Dùng 'RecId' (từ DTO)
          className="bg-white border rounded-lg p-3 shadow-sm space-y-1"
        >
          {/* 4. Sửa: Map đúng tên trường từ DTO */}
          <p className="font-semibold text-blue-600">{rec.EquipmentName}</p>
          <p className="text-gray-600 text-sm line-clamp-2">
            {rec.EquipmentDescription}
          </p>

          {/* 5. Sửa logic Rating */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() =>
                  rate({
                    recommendationId: rec.RecId, // <-- Sửa: Dùng 'RecId'
                    rating: s,
                  })
                }
                className="text-yellow-500 hover:scale-110 transition"
              >
                <Star
                  size={16}
                  // 6. Sửa: Backend trả về 'Score' (0-1)
                  //    Chúng ta phải chuyển nó về 1-5 để hiển thị
                  fill={s <= rec.Score * 5 ? "#fbbf24" : "none"}
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
