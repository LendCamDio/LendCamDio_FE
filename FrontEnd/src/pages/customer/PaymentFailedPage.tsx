import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentFailedPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderCode = searchParams.get('orderCode');
  const cancel = searchParams.get('cancel');
  const status = searchParams.get('status');

  useEffect(() => {
    // Log payment failure for analytics
    console.log('Payment failed:', { orderCode, cancel, status });
  }, [orderCode, cancel, status]);

  const isCancelled = cancel === 'true' || status === 'CANCELLED';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Failed Icon */}
          <div className="mx-auto flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isCancelled ? 'Thanh toán đã hủy' : 'Thanh toán thất bại'}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            {isCancelled 
              ? 'Bạn đã hủy giao dịch thanh toán.'
              : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'
            }
          </p>

          {/* Order Info */}
          {orderCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-1">Mã đơn hàng</div>
              <div className="font-mono font-semibold text-gray-900">{orderCode}</div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại thanh toán
            </Button>

            <Button
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem đơn hàng của tôi
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Cần hỗ trợ?</strong> Nếu tiền đã bị trừ nhưng đơn hàng chưa được xác nhận, 
              vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
