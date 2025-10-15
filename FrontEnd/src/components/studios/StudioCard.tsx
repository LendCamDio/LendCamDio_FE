import defPic from "../../assets/defaultPic1.jpg";
import type { Equipment } from "@/types/entity.type";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const StudioCard = ({
  studio,
  classNameImg,
}: {
  studio: Equipment;
  classNameImg?: string;
}) => {
  const [loadingImg, setLoadingImg] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>(defPic);

  const handleImageLoad = () => {
    setLoadingImg(false);
  };

  const handleImageError = () => {
    setLoadingImg(false);
    setImageSrc(defPic);
  };

  useEffect(() => {
    setLoadingImg(true);
    // Chỉ chạy khi studio thay đổi
    if (studio?.imageUrl) {
      // Nếu có URL hình ảnh, đặt nó và bắt đầu tải
      setImageSrc(studio.imageUrl);
    } else {
      // Không có URL hình ảnh, sử dụng mặc định và dừng tải
      setImageSrc(defPic);
      setLoadingImg(false);
    }
  }, [studio]);

  return (
    <div className="card-outstanding">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loadingImg ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <img
          loading="lazy"
          decoding="async"
          src={imageSrc}
          alt={studio?.name || "Studio image"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`animated-fade-in ${classNameImg}`}
        />
      </motion.div>
      <div className="card-outstanding-body">
        <h5 className="card-title">{studio.name}</h5>
        <p className="card-text">{studio.description}</p>
        <p className="price">{studio.dailyPrice.toLocaleString()} VNĐ/ngày</p>
        <a
          href={`/studios/${studio.equipmentId}`}
          className="btn-primary book-btn"
        >
          Xem chi tiết
        </a>
      </div>
    </div>
  );
};
