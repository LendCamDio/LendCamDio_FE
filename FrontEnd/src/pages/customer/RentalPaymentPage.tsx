import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRentalDetail } from '@/hooks/rental/useRental';
import { useCreatePayment } from '@/hooks/payment/usePayment';
import { formatCurrency, formatDate } from '@/utils/format';
import { PaymentMethod } from '@/types/entity.type';
import type { CreatePaymentRequestDto } from '@/types/entity.type';
import { Loader2, CreditCard, Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PayOSCheckout } from '@/components/payment/PayOSCheckout';

export const RentalPaymentPage: React.FC = () => {
  const { rentalId } = useParams<{ rentalId: string }>();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.PayOS);
  const [createdPayment, setCreatedPayment] = useState<any>(null);
  const [showPayOSCheckout, setShowPayOSCheckout] = useState(false);

  const { data: rentalData, isLoading: isLoadingRental } = useRentalDetail(rentalId || '', !!rentalId);
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePayment();

  const rental = rentalData?.data;

  const handleCreatePayment = () => {
    if (!rental) return;

    const paymentDto: CreatePaymentRequestDto = {
      rentalId: rental.rentalId,
      amount: rental.totalPrice + rental.deposit,
      method: selectedMethod,
    };

    createPayment(paymentDto, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Save the entire payment response
          setCreatedPayment(response.data);

          // If PayOS is selected, show checkout
          if (selectedMethod === PaymentMethod.PayOS) {
            setShowPayOSCheckout(true);
          } else {
            alert('Thanh toán bằng tiền mặt đã được tạo. Vui lòng liên hệ cửa hàng để hoàn tất.');
            navigate('/customer/rentals');
          }
        }
      },
      onError: () => {
        alert('Lỗi tạo thanh toán');
      },
    });
  };

  if (isLoadingRental) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Không tìm thấy đơn thuê
        </div>
      </div>
    );
  }

  if (showPayOSCheckout && createdPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <PayOSCheckout 
            payment={createdPayment}
            onSuccess={() => navigate('/customer/rentals')}
            onCancel={() => setShowPayOSCheckout(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán đơn thuê</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rental Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin đơn thuê</h2>
              <div className="flex gap-4 mb-4">
                {rental.equipmentImageUrl && (
                  <img 
                    src={rental.equipmentImageUrl}
                    alt={rental.equipmentName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{rental.equipmentName}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {rental.rentalId.substring(0, 8)}...</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày thuê:</span>
                  <span className="font-medium">{formatDate(rental.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả:</span>
                  <span className="font-medium">{formatDate(rental.endDate)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Tiền thuê:</span>
                  <span className="font-semibold">{formatCurrency(rental.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đặt cọc:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(rental.deposit)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-blue-600">{formatCurrency(rental.totalPrice + rental.deposit)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Chọn phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PaymentMethod.PayOS}
                    checked={selectedMethod === PaymentMethod.PayOS}
                    onChange={() => setSelectedMethod(PaymentMethod.PayOS)}
                    className="w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">PayOS - Thanh toán trực tuyến</div>
                    <div className="text-sm text-gray-500">Thanh toán qua cổng PayOS (QR, thẻ, ví điện tử)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={PaymentMethod.Cash}
                    checked={selectedMethod === PaymentMethod.Cash}
                    onChange={() => setSelectedMethod(PaymentMethod.Cash)}
                    className="w-4 h-4"
                  />
                  <Wallet className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">Tiền mặt</div>
                    <div className="text-sm text-gray-500">Thanh toán trực tiếp tại cửa hàng</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Xác nhận thanh toán</h3>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(rental.totalPrice + rental.deposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">
                    {selectedMethod === PaymentMethod.PayOS ? 'PayOS' : 'Tiền mặt'}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCreatePayment}
                disabled={isCreatingPayment}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCreatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận thanh toán'
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Bằng cách thanh toán, bạn đồng ý với điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalPaymentPage;
