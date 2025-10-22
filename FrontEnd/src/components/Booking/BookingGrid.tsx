import type { RentalResponseDto } from "@/types/entity.type";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatusConfig {
  [key: string]: {
    label: string;
    color: string;
    icon: LucideIcon;
    dotColor: string;
  };
}

interface BookingGridProps {
  bookings: RentalResponseDto[];
  onSelectViewDetail: (booking: RentalResponseDto) => void;
  formatDate: (date: string) => string;
  formatPrice: (price: number) => string;
  statusConfig: StatusConfig;
  onCancelBooking: (rentId: string) => void;
  onContactSupport: (rentId: string) => void;
}

const BookingGrid = ({
  bookings,
  onSelectViewDetail,
  formatDate,
  formatPrice,
  statusConfig,
  onCancelBooking,
  onContactSupport,
}: BookingGridProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có đơn đặt hàng nào</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {bookings.map((booking, index) => {
        const StatusIcon = statusConfig[booking.status]?.icon;

        return (
          <motion.div
            key={booking.rentalId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Equipment Image */}
              <div className="w-full lg:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {booking.equipmentImageUrl ? (
                  <img
                    src={booking.equipmentImageUrl}
                    alt={booking.equipmentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Booking Details */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {booking.equipmentName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mã đơn: {booking.rentalId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {StatusIcon && <StatusIcon size={18} />}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        statusConfig[booking.status]?.color || ""
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          statusConfig[booking.status]?.dotColor || ""
                        }`}
                      />
                      {statusConfig[booking.status]?.label || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                    <p className="font-medium">
                      {formatDate(booking.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày kết thúc</p>
                    <p className="font-medium">{formatDate(booking.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(booking.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tiền cọc</p>
                    <p className="font-medium">
                      {formatPrice(booking.deposit)}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="text-sm text-gray-800">{booking.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onSelectViewDetail(booking)}
                    className="btn-primary px-4 py-2 text-sm rounded-lg"
                  >
                    Xem chi tiết
                  </button>
                  {booking.status === 0 && ( // PENDING
                    <button
                      onClick={() => onCancelBooking(booking.rentalId)}
                      className="btn-outline-danger px-4 py-2 text-sm rounded-lg"
                    >
                      Hủy đơn
                    </button>
                  )}
                  <button
                    onClick={() => onContactSupport(booking.rentalId)}
                    className="btn-outline-primary px-4 py-2 text-sm rounded-lg"
                  >
                    Liên hệ hỗ trợ
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BookingGrid;
