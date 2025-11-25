import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { PaymentStatus } from "@/types/entity.type";
import { useGetPayOSPaymentInfoForOrder } from "@/hooks/payment/useOrderPayment";

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState<number | null>(null);

  useEffect(() => {
    // Extract order code from URL params
    const code = searchParams.get("orderCode");
    const status = searchParams.get("status");

    if (code) {
      setOrderCode(parseInt(code));
    }

    // Log payment status from PayOS
    console.log("Payment callback:", { code, status });
  }, [searchParams]);

  const { data: paymentData, isLoading } = useGetPayOSPaymentInfoForOrder(
    orderCode || 0,
    !!orderCode
  );

  const payment = paymentData?.data?.data;

  const status = payment?.status?.toString()?.toLowerCase();

  const isSuccess = status === PaymentStatus.Paid;
  const isPending = status === PaymentStatus.Pending;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Icon and Status */}
          <div className="text-center mb-6">
            {isSuccess ? (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600">
                  Đơn hàng của bạn đã được thanh toán thành công
                </p>
              </>
            ) : isPending ? (
              <>
                <Loader2 className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Đang chờ xác nhận
                </h1>
                <p className="text-gray-600">
                  Thanh toán của bạn đang được xử lý
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thất bại
                </h1>
                <p className="text-gray-600">
                  Có lỗi xảy ra trong quá trình thanh toán
                </p>
              </>
            )}
          </div>

          {/* Payment Details */}
          {payment && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Chi tiết thanh toán
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono font-medium">
                    {/* {payment.payOsOrderCode} */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">PayOS</span>
                </div>
                {payment.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {formatDateTime(payment.createdAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`font-semibold ${
                      isSuccess
                        ? "text-green-600"
                        : isPending
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {isSuccess
                      ? "Đã thanh toán"
                      : isPending
                      ? "Đang chờ"
                      : "Thất bại"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/customer/rentals")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Xem đơn thuê của tôi
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 Bạn có thể xem chi tiết đơn thuê và theo dõi trạng thái tại
              trang "Đơn thuê của tôi"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
