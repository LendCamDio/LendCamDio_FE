import { AnimatePresence, motion } from "framer-motion";
import defPic from "../../assets/defaultPic.jpg";
import { useState } from "react";
import { RentalStatusType, type RentalResponseDto } from "@/types/entity.type";
import { useEquipCategoryList } from "@/hooks/equipment/useEquipCategory";
// import { useEquipmentDetail } from "@/hooks/equipment/useEquipment";
import type { statusConfigType } from "@/types/ui/Booking/status.type";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatusConfig {
  [key: string]: {
    label: string;
    color: string;
    icon: LucideIcon;
    dotColor: string;
  };
}

interface DetailModalProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  selectedBooking: RentalResponseDto | null;
  formatDate: (date: string) => string;
  formatPrice: (price: number) => string;
  statusConfig: StatusConfig;
  rentalStatus: number;
}

const DetailModal = ({
  isDetailOpen,
  setIsDetailOpen,
  selectedBooking,
  formatDate,
  formatPrice,
  statusConfig,
}: DetailModalProps) => {
  const [imageSrc] = useState<string>(defPic);
  if (!selectedBooking) return null;
  const rentalStatus = selectedBooking.status;
  console.log("img", imageSrc);

  const StatusIcon =
    statusConfig[RentalStatusType[rentalStatus] as keyof statusConfigType]
      ?.icon;

  const { data: categoriesData } = useEquipCategoryList(1, 100);
  // const { data: equipmentDetail } = useEquipmentDetail(
  //   selectedBooking?.equipmentId || "",
  //   Boolean(selectedBooking?.equipmentId)
  // );

  const categoriesMap: { [key: string]: string } = {};
  categoriesData?.data?.items.forEach((cat) => {
    categoriesMap[cat.categoryId] = cat.name;
  });

  if (!isDetailOpen || !selectedBooking) return null;

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
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết đơn hàng
              </h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {StatusIcon && <StatusIcon size={24} />}
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium border ${
                    statusConfig[selectedBooking.status]?.color || ""
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      statusConfig[selectedBooking.status]?.dotColor || ""
                    }`}
                  />
                  {statusConfig[selectedBooking.status]?.label || "Unknown"}
                </span>
              </div>

              {/* Equipment Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin thiết bị
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-medium">{selectedBooking.rentalId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên thiết bị</p>
                    <p className="font-medium">
                      {selectedBooking.equipmentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                    <p className="font-medium">
                      {formatDate(selectedBooking.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày kết thúc</p>
                    <p className="font-medium">
                      {formatDate(selectedBooking.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin thanh toán
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền</span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(selectedBooking.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiền cọc</span>
                    <span className="font-medium">
                      {formatPrice(selectedBooking.deposit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí bảo hiểm</span>
                    <span className="font-medium">
                      {formatPrice(selectedBooking.insuranceFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ghi chú
                  </h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tên khách hàng</p>
                    <p className="font-medium">
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã khách hàng</p>
                    <p className="font-medium">{selectedBooking.customerId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
