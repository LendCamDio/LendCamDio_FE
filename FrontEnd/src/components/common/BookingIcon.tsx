import React from 'react';
import { Calendar } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { useNavigate } from 'react-router-dom';

export const BookingIcon: React.FC = () => {
  const { getTotalBookings } = useBooking();
  const navigate = useNavigate();
  const bookingCount = getTotalBookings();

  return (
    <button
      onClick={() => navigate('/bookings')}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Lịch đặt thuê"
    >
      <Calendar className="w-6 h-6 text-gray-700" />
      {bookingCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {bookingCount > 9 ? '9+' : bookingCount}
        </span>
      )}
    </button>
  );
};
