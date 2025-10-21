import { AnimatePresence, motion } from "framer-motion";
import defPic from "../../assets/defaultPic.jpg";
import { useState } from "react";
import { RentalStatusType, type RentalResponseDto } from "@/types/entity.type";
import { useEquipCategoryList } from "@/hooks/equipment/useEquipCategory";
import { useEquipmentDetail } from "@/hooks/equipment/useEquipment";
import type { statusConfigType } from "@/types/ui/Booking/status.type";

interface DetailModalProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedBooking: RentalResponseDto;
  formatDate: (dateStr: string) => string;
  formatPrice: (price: number) => string;
  statusConfig: statusConfigType;
  rentalStatus: number;
}

const DetailModal = ({
  isDetailOpen,
  setIsDetailOpen,
  selectedBooking,
  formatDate,
  formatPrice,
  statusConfig,
  rentalStatus,
}: DetailModalProps) => {
  const [imageSrc, setImageSrc] = useState<string>(defPic);

  const StatusIcon =
    statusConfig[RentalStatusType[rentalStatus] as keyof statusConfigType]
      ?.icon;
  const status =
    statusConfig[RentalStatusType[rentalStatus] as keyof statusConfigType];

  const { data: categoriesData } = useEquipCategoryList(1, 100);
  const { data: equipmentDetail } = useEquipmentDetail(
    selectedBooking?.equipmentId || "",
    Boolean(selectedBooking?.equipmentId)
  );

  const categoriesMap: { [key: string]: string } = {};
  categoriesData?.data?.items.forEach((cat) => {
    categoriesMap[cat.categoryId] = cat.name;
  });

  const handleImageError = () => {
    console.log("Hình ảnh không tải được:", selectedBooking?.equipmentImageUrl);
    setImageSrc(defPic);
  };
  return (
    <AnimatePresence>
      {isDetailOpen && selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDetailOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] relative"
          >
            <div className="p-6 border-b border-gray-200 min-w-2xl">
              <h2 className="text-2xl font-bold text-[var(--text-dark)]">
                Chi tiết đơn hàng
              </h2>
              <p className="text-[var(--text-light)] mt-1">
                {selectedBooking.notes}
              </p>
            </div>

            <div className="p-6 custom-scrollbar overflow-y-auto max-h-[70vh]">
              <img
                src={imageSrc}
                alt={selectedBooking.equipmentName}
                onError={handleImageError}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <h3 className="text-xl font-bold text-[var(--text-dark)] mb-4">
                {selectedBooking.equipmentName}
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[var(--bg-light)] rounded-lg">
                  <span className="text-[var(--text-light)]">Trạng thái:</span>
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold ${status?.color}`}
                  >
                    <span className="flex justify-center items-center gap-2 py-3">
                      {StatusIcon && <StatusIcon size={16} />}
                      {status.label}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[var(--bg-light)] rounded-lg">
                  <span className="text-[var(--text-light)]">Loại:</span>
                  <span className="font-semibold text-[var(--text-dark)]">
                    {equipmentDetail?.data?.items?.[0]?.categoryName || "Khác"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[var(--bg-light)] rounded-lg">
                  <span className="text-[var(--text-light)]">Ngày đặt:</span>
                  <span className="font-semibold text-[var(--text-dark)]">
                    {formatDate(selectedBooking.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[var(--bg-light)] rounded-lg">
                  <span className="text-[var(--text-light)]">Từ ngày:</span>
                  <span className="font-semibold text-[var(--text-dark)]">
                    {formatDate(selectedBooking.startDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[var(--bg-light)] rounded-lg">
                  <span className="text-[var(--text-light)]">Đến ngày:</span>
                  <span className="font-semibold text-[var(--text-dark)]">
                    {formatDate(selectedBooking.endDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-[var(--text-dark)] font-semibold">
                    Tổng tiền:
                  </span>
                  <span className="font-bold text-xl text-[var(--primary-color)]">
                    {formatPrice(selectedBooking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDetailOpen(false)}
                className="
                flex-1 px-6 py-3 
                bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] 
                text-white rounded-lg 
                hover:shadow-lg 
                transition-all duration-300 font-semibold"
              >
                Đóng
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
