import { AnimatePresence, motion } from "framer-motion";
import { Package } from "lucide-react";
import BookingRow from "./BookingRow";
import { type RentalResponseDto } from "@/types/entity.type";
import type { statusConfigType } from "@/types/ui/Booking/status.type";

const BookingGrid = ({
  bookings,
  onSelectViewDetail,
  formatDate,
  formatPrice,
  statusConfig,
  onCancelBooking,
  onContactSupport,
}: {
  bookings: RentalResponseDto[];
  onSelectViewDetail: (rental: RentalResponseDto) => void;
  formatDate: (dateStr: string) => string;
  formatPrice: (price: number) => string;
  statusConfig: statusConfigType;
  onCancelBooking: (bookingId: string) => void;
  onContactSupport: (bookingId: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
          >
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
              Không tìm thấy đơn đặt hàng
            </h3>
            <p className="text-[var(--text-light)]">
              Bạn chưa có đơn đặt hàng nào phù hợp với bộ lọc
            </p>
          </motion.div>
        ) : (
          bookings.map((booking, index) => (
            <BookingRow
              key={booking.rentalId}
              booking={booking}
              onSelectViewDetails={onSelectViewDetail}
              index={index}
              statusConfig={statusConfig}
              formatDate={formatDate}
              formatPrice={formatPrice}
              onCancelBooking={onCancelBooking}
              onContactSupport={onContactSupport}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingGrid;
