import { useGetPayOSPaymentInfoForOrder } from "@/hooks/payment/useOrderPayment";
import { PaymentStatus } from "@/types/entity.type";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Lấy orderCode từ URL
  const orderCode = Number(params.get("orderCode"));

  // Fetch thông tin thanh toán từ PayOS qua BE
  const {
    data: paymentData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetPayOSPaymentInfoForOrder(orderCode);

  // Lấy payment object từ API response
  const payment = paymentData?.data?.data;
  const status = payment?.status?.toString().toLowerCase();

  const isSuccess = status === PaymentStatus.Paid.toLowerCase();
  const isPending = status === PaymentStatus.Pending.toLowerCase();
  const isCancelled = status === "cancel" || status === "canceled";

  // Auto-redirect khi success → chuyển sang trang đơn hàng
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  // Auto refetch nếu trạng thái pending
  useEffect(() => {
    if (isPending) {
      const timer = setInterval(() => {
        refetch();
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [isPending, refetch]);

  // Loading UI
  if (isLoading || isFetching) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-semibold mb-2">
          Đang xác nhận thanh toán...
        </h1>
        <p className="text-gray-500">
          Vui lòng chờ trong giây lát. Không đóng trang này.
        </p>
      </div>
    );
  }

  // Lỗi fetch
  if (isError) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl text-red-600 font-semibold mb-2">
          Không thể xác minh thanh toán
        </h1>
        <p className="text-gray-500">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
      </div>
    );
  }

  // Trạng thái CANCELLED
  if (isCancelled) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl text-red-600 font-bold mb-3">
          Thanh toán đã hủy
        </h1>
        <p>Mã thanh toán: {orderCode}</p>
        <p className="mt-4 text-gray-600">
          Giao dịch đã bị hủy hoặc khách hàng không hoàn tất thanh toán.
        </p>
      </div>
    );
  }

  // Trạng thái PENDING
  if (isPending) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl text-yellow-500 font-bold mb-3">
          Đang chờ PayOS xác nhận...
        </h1>
        <p>Mã thanh toán: {orderCode}</p>
        <p className="mt-4 text-gray-600">
          Chúng tôi đang xử lý thanh toán của bạn. Trang sẽ tự động cập nhật.
        </p>
      </div>
    );
  }

  // Thành công
  if (isSuccess) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl text-green-600 font-bold mb-3">
          Thanh toán thành công!
        </h1>

        <p className="text-lg mb-2">Mã thanh toán: {orderCode}</p>
        <p className="text-gray-700">
          Đơn hàng của bạn đang được tạo. Bạn sẽ được chuyển sang trang Đơn
          hàng.
        </p>
      </div>
    );
  }

  // Fallback – nếu status không nằm trong các trạng thái trên
  return (
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold mb-3">Thanh toán chưa rõ trạng thái</h1>
      <p className="text-gray-600">Mã thanh toán: {orderCode}</p>
      <p className="text-gray-500 mt-2">
        Hãy thử tải lại trang hoặc kiểm tra mục Đơn hàng của bạn.
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
