import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePaymentDetail } from "@/hooks/payment/usePayment";
import { PaymentStatusBadge, PayOSCheckout } from "@/components/payment";
import { PaymentMethod, PaymentStatus } from "@/types/entity.type";

export const PaymentPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  // Validate GUID format
  const isValidGuid = paymentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentId);

  const {
    data: paymentResponse,
    isLoading,
    error,
    refetch,
  } = usePaymentDetail(paymentId || "", !!(paymentId && isValidGuid));

  const payment = paymentResponse?.data;

  useEffect(() => {
    // Auto-refresh payment status every 5 seconds if pending
    if (payment && payment.status === PaymentStatus.Pending) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [payment, refetch]);

  const handlePaymentSuccess = () => {
    // Redirect to success page or rental details
    navigate(`/rentals`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
            Không tìm thấy thông tin thanh toán
          </h2>
          <p className="mb-4 text-red-700 dark:text-red-300">
            {error ? "Đã xảy ra lỗi khi tải thông tin thanh toán" : "ID thanh toán không hợp lệ"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thanh toán đơn thuê
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Mã thanh toán: <span className="font-mono font-semibold">{payment.paymentId}</span>
          </p>
        </div>

        {/* Payment Status Overview */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Thông tin thanh toán
            </h2>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payment.customerName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Thiết bị</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payment.equipmentName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Số tiền</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phương thức</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payment.method === PaymentMethod.PayOS && "🏦 PayOS"}
                {payment.method === PaymentMethod.VNPay && "💳 VNPay"}
                {payment.method === PaymentMethod.Cash && "💵 Tiền mặt"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(payment.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            {payment.paidAt && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày thanh toán</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {new Date(payment.paidAt).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        {payment.status === PaymentStatus.Pending && payment.method === PaymentMethod.PayOS && (
          <PayOSCheckout
            payment={payment}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        )}

        {/* Instructions for other payment methods */}
        {payment.status === PaymentStatus.Pending && payment.method === PaymentMethod.Cash && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              💵 Thanh toán bằng tiền mặt
            </h3>
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Vui lòng thanh toán trực tiếp tại cửa hàng. Nhân viên sẽ xác nhận thanh toán của bạn.
              </p>
            </div>
          </div>
        )}

        {/* Failed Payment */}
        {payment.status === PaymentStatus.Failed && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-900/20">
            <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
              ✗ Thanh toán thất bại
            </h3>
            <p className="mb-4 text-sm text-red-700 dark:text-red-300">
              Giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.
            </p>
            <button
              onClick={() => navigate(`/rentals/${payment.rentalId}`)}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Xem chi tiết đơn thuê
            </button>
          </div>
        )}

        {/* Refunded Payment */}
        {payment.status === PaymentStatus.Refunded && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              ↺ Đã hoàn tiền
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Số tiền đã được hoàn lại cho bạn.
            </p>
            {payment.refundReason && (
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Lý do: {payment.refundReason}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
