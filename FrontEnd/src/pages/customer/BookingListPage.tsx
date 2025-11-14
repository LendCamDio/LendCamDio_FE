import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, ArrowLeft } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { useCreateRental } from '@/hooks/rental/useRental';
import { formatCurrency, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';

export const BookingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, removeBooking, clearBookings, getTotalPrice, getTotalDeposit } = useBooking();
  const { mutate: createRental, isPending } = useCreateRental();
  const { user } = useAuth();

  const handleCreateRentals = async () => {
    if (!user?.id) {
      alert('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    if (bookings.length === 0) {
      alert('Chưa có lịch đặt nào');
      return;
    }

    let successCount = 0;
    const totalItems = bookings.length;

    for (const booking of bookings) {
      createRental(
        {
          customerId: user.id,
          equipmentId: booking.equipment.equipmentId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          notes: booking.notes || undefined,
        },
        {
          onSuccess: () => {
            successCount++;
            if (successCount === totalItems) {
              alert('Tạo đơn thuê thành công!');
              clearBookings();
              navigate('/customer/rentals');
            }
          },
          onError: (error) => {
            alert(`Lỗi tạo đơn thuê: ${error.message}`);
          },
        }
      );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Chưa có lịch đặt</h2>
          <p className="text-gray-500 mb-6">Hãy đặt lịch thuê thiết bị để bắt đầu</p>
          <Button onClick={() => navigate('/equipments')} className="bg-green-600 hover:bg-green-700">
            Xem thiết bị cho thuê
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Lịch đặt thuê của bạn</h1>
          <p className="text-gray-600 mt-2">{bookings.length} lịch đặt</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Items */}
          <div className="lg:col-span-2 space-y-4">
            {bookings.map((booking) => (
              <div key={booking.equipment.equipmentId} className="bg-white rounded-lg shadow p-6">
                <div className="flex gap-4">
                  <img 
                    src={booking.equipment.imageUrl} 
                    alt={booking.equipment.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{booking.equipment.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{booking.equipment.categoryName}</p>
                    <p className="text-sm text-green-600 mb-3">
                      📅 {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      <span className="ml-2 font-medium">({booking.rentalDays} ngày)</span>
                    </p>
                    
                    {booking.notes && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Ghi chú:</span> {booking.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm space-y-1">
                        <p className="text-gray-600">Giá thuê: {formatCurrency(booking.totalPrice)}</p>
                        <p className="text-gray-600">Đặt cọc: {formatCurrency(booking.deposit)}</p>
                        {booking.insuranceFee > 0 && (
                          <p className="text-gray-600">Bảo hiểm: {formatCurrency(booking.insuranceFee)}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeBooking(booking.equipment.equipmentId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-right">
                  <span className="text-gray-600">Tổng thanh toán: </span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(booking.totalPrice + booking.deposit + booking.insuranceFee)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền thuê:</span>
                  <span className="font-semibold">{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng đặt cọc:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(getTotalDeposit())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lịch đặt:</span>
                  <span className="font-semibold">{bookings.length}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatCurrency(getTotalPrice() + getTotalDeposit())}</span>
                </div>
              </div>

              <Button
                onClick={handleCreateRentals}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isPending ? 'Đang xử lý...' : 'Xác nhận đặt thuê'}
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Bạn sẽ được chuyển đến trang quản lý đơn thuê sau khi tạo thành công
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingListPage;
