import defPic from "@/assets/defaultPic.jpg";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Package,
  XCircle,
  Eye,
  Download,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  RentalStatus,
  RentalStatusType,
  type RentalResponseDto,
} from "@/types/entity.type";
import { useRentalDetail } from "@/hooks/rental/useRental";
import type { statusConfigType } from "@/types/ui/Booking/status.type";

interface BookingRowProps {
  booking: RentalResponseDto;
  onSelectViewDetails: (rental: RentalResponseDto) => void;
  index: number;
  statusConfig: statusConfigType;
  formatDate: (dateStr: string) => string;
  formatPrice: (price: number) => string;
  onCancelBooking: (bookingId: string) => void;
  onContactSupport: (bookingId: string) => void;
}

export default function BookingRow({
  booking,
  onSelectViewDetails,
  index,
  statusConfig,
  formatDate,
  formatPrice,
  onCancelBooking,
  onContactSupport,
}: BookingRowProps) {
  const [imageSrc, setImageSrc] = useState<string>(defPic);
  const [loadingImg, setLoadingImg] = useState(true);

  const { data: rentalDetail } = useRentalDetail(
    booking.rentalId,
    Boolean(booking.rentalId)
  );
  console.log("Rental Detail:", rentalDetail);

  const StatusIcon =
    statusConfig[RentalStatusType[booking.status] as keyof statusConfigType]
      ?.icon;
  const status =
    statusConfig[RentalStatusType[booking.status] as keyof statusConfigType];

  // Preload image and handle error
  useEffect(() => {
    if (booking?.equipmentImageUrl) {
      const img = new Image();
      img.src = booking.equipmentImageUrl;
      img.onload = () => {
        setImageSrc(booking.equipmentImageUrl || defPic);
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
  }, [booking]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-5 p-6">
          {/* Image */}
          <div
            className="
            relative 
            md:w-52 md:h-52
            overflow-hidden
            rounded-xl"
          >
            {loadingImg ? (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <img
                src={imageSrc}
                alt={booking.equipmentName}
                className="
                  w-full h-full object-cover 
                  transition-transform duration-500 
                  group-hover:scale-105"
              />
            )}
            <span className="absolute top-3 left-3 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-1 px-2 rounded-full shadow-md">
              {booking.equipmentId ? "Thiết bị" : "Studio"}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {booking.equipmentName}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Bảo hiểm:{" "}
                    {rentalDetail?.data?.insuranceFee
                      ? formatPrice(rentalDetail.data.insuranceFee)
                      : "Không"}
                  </div>
                </div>

                {/* Status */}
                {status && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border rounded-lg ${status.color}`}
                  >
                    {StatusIcon && <StatusIcon size={16} />}
                    <span>{status.label}</span>
                  </div>
                )}
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày nhận</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(booking.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày trả</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(booking.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Package size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Tổng tiền</p>
                    <p className="font-bold text-blue-600">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectViewDetails(booking)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition"
              >
                <Eye size={18} /> Xem chi tiết
              </motion.button>

              {booking.status === RentalStatus.PENDING.indexOf("Pending") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCancelBooking(booking.rentalId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 font-semibold hover:bg-red-50 transition"
                >
                  <XCircle size={18} /> Hủy đơn
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onContactSupport(booking.rentalId)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition"
              >
                <MessageSquare size={18} /> Liên hệ
              </motion.button>

              {booking.status ===
                RentalStatus.COMPLETED.indexOf("Completed") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition"
                >
                  <Download size={18} /> Tải hóa đơn
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
