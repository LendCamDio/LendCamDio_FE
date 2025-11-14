import React, { useState } from 'react';
import { useRentalList } from '@/hooks/rental/useRental';
import { useAuth } from '@/hooks/auth/useAuth';
import { formatCurrency, formatDate } from '@/utils/format';
import { RentalStatus } from '@/types/entity.type';
import { Loader2, Package, Calendar, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusMap = {
  [RentalStatus.PENDING]: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  [RentalStatus.ACTIVE]: { label: 'Đang thuê', color: 'bg-green-100 text-green-800' },
  [RentalStatus.COMPLETED]: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
  [RentalStatus.CANCELLED]: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export const MyRentalsPage: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | undefined>();
  const pageSize = 10;

  const { data, isLoading, error } = useRentalList(page, pageSize, {
    customerId: user?.id,
    status: statusFilter,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Lỗi tải dữ liệu: {error.message}
        </div>
      </div>
    );
  }

  const rentals = data?.data?.items || [];
  const totalPages = data?.data?.pages || 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn thuê của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi tất cả đơn thuê thiết bị</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={!statusFilter ? 'default' : 'outline'}
                onClick={() => setStatusFilter(undefined)}
              >
                Tất cả
              </Button>
              {Object.entries(statusMap).map(([status, config]) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status as RentalStatus)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rentals List */}
        {rentals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn thuê nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có đơn thuê nào. Hãy bắt đầu thuê thiết bị!</p>
            <Button onClick={() => window.location.href = '/products'}>
              Xem thiết bị
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
              <div key={rental.rentalId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      {rental.equipmentImageUrl && (
                        <img 
                          src={rental.equipmentImageUrl}
                          alt={rental.equipmentName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{rental.equipmentName}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {rental.rentalId.substring(0, 8)}...</p>
                        <div className="mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            statusMap[rental.status as unknown as RentalStatus]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusMap[rental.status as unknown as RentalStatus]?.label || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tổng cộng</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(rental.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Ngày thuê</p>
                        <p className="text-sm font-medium">{formatDate(rental.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Ngày trả</p>
                        <p className="text-sm font-medium">{formatDate(rental.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Đặt cọc</p>
                        <p className="text-sm font-medium text-orange-600">{formatCurrency(rental.deposit)}</p>
                      </div>
                    </div>
                  </div>

                  {rental.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span> {rental.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/customer/rentals/${rental.rentalId}`}
                    >
                      Xem chi tiết
                    </Button>
                    {rental.status === 0 && ( // Pending
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = `/customer/rentals/${rental.rentalId}/payment`}
                      >
                        Thanh toán
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span className="px-4 py-2 text-sm">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentalsPage;
