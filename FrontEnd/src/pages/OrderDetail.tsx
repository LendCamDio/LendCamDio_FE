/**
 * Order Detail Page - Chi tiết đơn hàng
 */
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useOrderById,
  useCreateOrderPayment,
  useCreatePayOsPaymentForOrder,
  useCancelOrder,
} from "@/hooks/order/useOrder";
import { formatCurrency } from "@/utils/currencyFormatter";
import { OrderStatus, OrderPaymentStatus, OrderPaymentMethod } from "@/types/order.type";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

const OrderStatusDisplay: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Chờ xử lý",
  [OrderStatus.Processing]: "Đang xử lý",
  [OrderStatus.Shipped]: "Đã gửi",
  [OrderStatus.Delivered]: "Đã giao",
  [OrderStatus.Cancelled]: "Đã hủy",
  [OrderStatus.Refunded]: "Đã hoàn tiền",
};

const OrderStatusColor: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-800",
  [OrderStatus.Shipped]: "bg-purple-100 text-purple-800",
  [OrderStatus.Delivered]: "bg-green-100 text-green-800",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-800",
  [OrderStatus.Refunded]: "bg-gray-100 text-gray-800",
};

const PaymentStatusDisplay: Record<OrderPaymentStatus, string> = {
  [OrderPaymentStatus.Pending]: "Chờ thanh toán",
  [OrderPaymentStatus.Completed]: "Đã thanh toán",
  [OrderPaymentStatus.Failed]: "Thất bại",
  [OrderPaymentStatus.Refunded]: "Đã hoàn tiền",
  [OrderPaymentStatus.Cancelled]: "Đã hủy",
};

const PaymentStatusColor: Record<OrderPaymentStatus, string> = {
  [OrderPaymentStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderPaymentStatus.Completed]: "bg-green-100 text-green-800",
  [OrderPaymentStatus.Failed]: "bg-red-100 text-red-800",
  [OrderPaymentStatus.Refunded]: "bg-gray-100 text-gray-800",
  [OrderPaymentStatus.Cancelled]: "bg-gray-100 text-gray-800",
};

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: order, isLoading, error } = useOrderById(orderId || "", !!orderId);
  const createPayment = useCreateOrderPayment();
  const createPayOsLink = useCreatePayOsPaymentForOrder();
  const cancelOrder = useCancelOrder();

  const handlePayNow = async () => {
    if (!order) return;

    setIsProcessingPayment(true);
    try {
      // Step 1: Create payment record
      const paymentResult = await createPayment.mutateAsync({
        orderId: order.orderId,
        paymentMethod: OrderPaymentMethod.PayOS, // 2 = PayOS
      });

      if (!paymentResult.orderPaymentId) {
        throw new Error("Failed to create payment");
      }

      // Step 2: Create PayOS link
      const payosResult = await createPayOsLink.mutateAsync(
        paymentResult.orderPaymentId
      );

      if (payosResult.checkoutUrl) {
        // Redirect to PayOS checkout
        window.location.href = payosResult.checkoutUrl;
      } else {
        throw new Error("Failed to get payment link");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(`Lỗi: ${error?.message || "Không thể tạo thanh toán"}`, "error");
      setIsProcessingPayment(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    setIsCancelling(true);
    try {
      await cancelOrder.mutateAsync(order.orderId);
      showToast("Đã hủy đơn hàng thành công", "success");
      navigate("/orders");
    } catch (error: any) {
      console.error("Cancel order error:", error);
      showToast(`Lỗi: ${error?.message || "Không thể hủy đơn hàng"}`, "error");
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const canPayNow =
    order.status === OrderStatus.Pending &&
    order.paymentStatus === OrderPaymentStatus.Pending;

  const canCancel = order.status === OrderStatus.Pending;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
        <h1 className="text-3xl font-bold mb-2">Đơn hàng {order.orderNumber}</h1>
        <p className="text-gray-600">
          Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Trạng thái</h2>
        <div className="flex gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Đơn hàng</p>
            <span
              className={`px-4 py-2 rounded inline-block ${
                OrderStatusColor[order.status]
              }`}
            >
              {OrderStatusDisplay[order.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Thanh toán</p>
            <span
              className={`px-4 py-2 rounded inline-block ${
                PaymentStatusColor[order.paymentStatus]
              }`}
            >
              {PaymentStatusDisplay[order.paymentStatus]}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Tên người nhận:</span> {order.shippingName || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-medium">Số điện thoại:</span> {order.shippingPhone || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-medium">Địa chỉ:</span> {order.shippingAddress}
          </p>
          {order.notes && (
            <p>
              <span className="font-medium">Ghi chú:</span> {order.notes}
            </p>
          )}
          {order.shippedAt && (
            <p className="text-sm text-gray-600">
              Gửi lúc: {new Date(order.shippedAt).toLocaleString("vi-VN")}
            </p>
          )}
          {order.deliveredAt && (
            <p className="text-sm text-gray-600">
              Giao lúc: {new Date(order.deliveredAt).toLocaleString("vi-VN")}
            </p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.orderItemId}
              className="flex justify-between items-center border-b pb-4 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium">{item.equipmentName}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt giá</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng tiền hàng:</span>
            <span>{formatCurrency(order.subTotal)}</span>
          </div>
          {order.shippingFee > 0 && (
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
          )}
          {order.taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Thuế:</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span>Giảm giá:</span>
              <span className="text-red-600">-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Payments History */}
      {order.payments && order.payments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Lịch sử thanh toán</h2>
          <div className="space-y-3">
            {order.payments.map((payment) => (
              <div
                key={payment.orderPaymentId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{payment.paymentMethod}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.createdAt).toLocaleString("vi-VN")}
                  </p>
                  {payment.transactionId && (
                    <p className="text-xs text-gray-500">
                      Mã GD: {payment.transactionId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded inline-block ${
                      PaymentStatusColor[payment.status]
                    }`}
                  >
                    {PaymentStatusDisplay[payment.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Quay lại danh sách
        </button>
        {canPayNow && (
          <button
            onClick={handlePayNow}
            disabled={isProcessingPayment}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isProcessingPayment ? "Đang xử lý..." : "Thanh toán ngay"}
          </button>
        )}
        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
