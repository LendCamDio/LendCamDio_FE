import type { Equipment } from "@/types/entity.type";
import { useNavigate } from "react-router-dom";
import { Rating } from "../common/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import defPic from "@/assets/defaultPic1.jpg";
import Loading from "../common/Loading/Loading";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { motion } from "framer-motion";

const ProductCard = ({ equipment }: { equipment: Equipment }) => {
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  const [loadingImg, setLoadingImg] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>(defPic);

  useEffect(() => {
    setLoadingImg(true);

    // Chỉ chạy khi equipment thay đổi
    if (equipment?.imageUrl) {
      // Nếu có URL hình ảnh, đặt nó và bắt đầu tải
      setImageSrc(equipment.imageUrl);
    } else {
      // Không có URL hình ảnh, sử dụng mặc định và dừng tải
      setImageSrc(defPic);
      setLoadingImg(false);
    }
  }, [equipment]);

  const convertNameCate = (categoryName: string) => {
    const categoryMap: Record<string, string> = {
      studio: "studio",
      Cameras: "camera",
      "Ống kính": "lense",
      "Phụ kiện": "accessory",
    };
    return categoryMap[categoryName] || categoryName.toLowerCase();
  };

  // Chạy khi hình ảnh không tải được
  const handleImageError = () => {
    setImageSrc(defPic);
    setLoadingImg(false);
  };
  const handleImageLoad = () => {
    setLoadingImg(false);
  };

  const handleViewDetails = () => {
    navigate(`/products/product-detail/${equipment.equipmentId}`);
  };
  const handleAddToFavorites = () => {
    // Add to favorites logic here
    showToast("Chức năng đang phát triển", "info");
  };

  // 🏷️ Giá hiển thị hợp lý
  const displayPrice =
    equipment.dailyPrice && equipment.dailyPrice > 0
      ? `${equipment.dailyPrice.toLocaleString()}đ/ngày`
      : equipment.price && equipment.price > 0
      ? `${equipment.price.toLocaleString()}đ`
      : "Liên hệ";

  const actionLabel =
    equipment.dailyPrice && equipment.dailyPrice > 0
      ? "Đặt lịch ngay"
      : equipment.price && equipment.price > 0
      ? "Mua ngay"
      : "Liên hệ";

  return (
    <div
      className="product-card w-full"
      data-category={equipment.categoryName}
      data-name={equipment.name}
      data-price={equipment.dailyPrice}
    >
      <div className="product-image">
        <AnimatePresence mode="wait">
          {loadingImg && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-[var(--bg-light)]"
            >
              <Loading size="md" className="" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loadingImg ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className=" product-image"
        >
          <img
            loading="lazy"
            decoding="async"
            src={imageSrc}
            alt={equipment?.name || "Product image"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="animated-fade-in"
          />
        </motion.div>

        {equipment.categoryName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={`product-badge ${convertNameCate(
              equipment.categoryName
            )}`}
          >
            {equipment.categoryName}
          </motion.div>
        )}
        <motion.div
          className="product-actions"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="action-btn"
            title="Xem chi tiết"
            onClick={handleViewDetails}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faEye} />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {equipment.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
          {equipment.description || "Chưa có mô tả chi tiết."}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Rating value={equipment.rating || 0} />
          {equipment.availability ? (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
              Còn hàng
            </span>
          ) : (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full whitespace-nowrap">
              Hết hàng
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-blue-600 font-bold text-base sm:text-lg">
            {displayPrice}
          </p>
        </div>
        <motion.button
          onClick={() => {
            if (equipment.dailyPrice && equipment.dailyPrice > 0)
              navigate("/studios");
            else
              showToast("Tính năng đang phát triển", "info", {
                allowSpam: true,
              });
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="
            btn
            btn-primary
            w-full mt-2 py-2 text-sm sm:text-base
            bg-gradient-to-r from-blue-600 to-indigo-600 
            text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
        >
          {actionLabel}
        </motion.button>
      </div>
    </div>
  );
};

export default ProductCard;
