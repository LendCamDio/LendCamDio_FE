import defPic from "@/assets/defaultPic1.jpg";
import { EquipmentCondition, type Equipment } from "@/types/entity.type";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShieldCheck, Box, Store, Info } from "lucide-react";
import { BookingModal } from "./BookingModal";

export const StudioCard = ({
  studio,
  classNameImg,
}: {
  studio: Equipment;
  classNameImg?: string;
}) => {
  const [loadingImg, setLoadingImg] = useState(true);
  const [imageSrc, setImageSrc] = useState(defPic);
  const [selectedStudio, setSelectedStudio] = useState<Equipment | null>(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);

  useEffect(() => {
    if (studio?.imageUrl) {
      const img = new Image();
      img.src = studio.imageUrl;
      img.onload = () => {
        setImageSrc(studio.imageUrl || defPic);
        setLoadingImg(false);
      };
      img.onerror = () => {
        setImageSrc(defPic);
        setLoadingImg(false);
      };
    } else {
      setImageSrc(defPic);
      setLoadingImg(false);
    }
  }, [studio]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        card-outstanding bg-white border 
        border-gray-100 rounded-2xl shadow-md 
        hover:shadow-xl transition-all duration-300 
        overflow-hidden flex flex-col
      "
    >
      {/* Image */}
      <div className="card-outstanding-img-top relative ">
        {loadingImg ? (
          <div className="w-full h-full bg-gray-100 animate-pulse" />
        ) : (
          <img
            loading="lazy"
            src={imageSrc}
            alt={studio?.name || "Thiết bị"}
            className={`object-cover w-full h-full transition-transform duration-500 hover:scale-105 ${classNameImg}`}
          />
        )}

        {studio.availability ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
            Còn hàng
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
            Hết hàng
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="
          card-outstanding-body flex flex-col flex-1 p-4 space-y-2
        "
      >
        <div className="card-title">
          <h5>{studio.name}</h5>
        </div>
        <p className="card-text">
          {studio.description || "Chưa có mô tả chi tiết."}
        </p>

        {/* Extra Info */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
          {studio.categoryName && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              <Info size={14} /> {studio.categoryName}
            </span>
          )}
          {studio.condition !== null && (
            <span className="flex items-center gap-1 bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
              <Box size={14} /> Tình trạng:{" "}
              {EquipmentCondition[studio.condition as EquipmentCondition]}
            </span>
          )}
          {studio.insuranceRequired && (
            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
              <ShieldCheck size={14} /> Yêu cầu bảo hiểm
            </span>
          )}
        </div>

        {/* Supplier + Price */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Store size={16} />
            {studio.supplierName || "Studio không xác định"}
          </div>
          <div className="text-right">
            <p className="price">
              {studio.dailyPrice?.toLocaleString("vi-VN")}₫/ngày
            </p>
            {studio.depositAmount !== null && (
              <p className="text-xs text-gray-500">
                Cọc: {studio.depositAmount.toLocaleString("vi-VN")}₫
              </p>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => {
            setSelectedStudio(studio);
            setOpenBookingModal(true);
          }}
          className="btn-primary book-btn"
        >
          Đặt lịch ngay
        </button>
      </div>

      <BookingModal
        open={openBookingModal}
        onClose={() => setOpenBookingModal(false)}
        studio={selectedStudio}
      />
    </motion.div>
  );
};
