import type { Equipment } from "@/types/entity.type";
import { useNavigate } from "react-router-dom";
import { Rating } from "../common/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUniqueToast } from "@/hooks/useUniqueToast";
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
    console.log("Hình ảnh không tải được:", equipment?.imageUrl);
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

  return (
    <div
      className="product-card"
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
          <motion.button
            className="action-btn"
            title="Yêu thích"
            onClick={handleAddToFavorites}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faHeart} />
          </motion.button>
        </motion.div>
      </div>

      <div className="product-info">
        <h3 className="product-title">{equipment.name}</h3>
        <p className="product-description">{equipment.description}</p>
        <div className="product-rating">
          <Rating
            value={equipment.rating ? equipment.rating.averageRating : 0}
          />
        </div>
        <div className="product-price">
          {equipment.dailyPrice.toLocaleString()}đ/ngày
        </div>
        <motion.button
          className="btn-primary product-btn"
          onClick={() => navigate("/studios")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Đặt lịch ngay
        </motion.button>
      </div>
    </div>
  );
};

export default ProductCard;
