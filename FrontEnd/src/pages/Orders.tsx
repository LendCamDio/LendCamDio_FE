/**
 * Orders Page - Lịch sử đơn hàng
 * Hiển thị danh sách tất cả đơn hàng của user
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMyOrders,
  useCreateOrderPayment,
  useCreatePayOsPaymentForOrder,
  useCancelOrder,
} from "@/hooks/order/useOrder";
import { formatCurrency } from "@/utils/currencyFormatter";
import { OrderStatus, OrderPaymentStatus, OrderPaymentMethod } from "@/types/order.type";
import type { OrderResponseDto } from "@/types/order.type";
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

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  const { data: orders, isLoading, error } = useMyOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<OrderPaymentStatus | "all">("all");
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const createPayment = useCreateOrderPayment();
  const createPayOsLink = useCreatePayOsPaymentForOrder();
  const cancelOrder = useCancelOrder();

  const handlePayNow = async (order: OrderResponseDto) => {
    setProcessingPaymentId(order.orderId);
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
      setProcessingPaymentId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await cancelOrder.mutateAsync(orderId);
      showToast("Đã hủy đơn hàng thành công", "success");
    } catch (error: any) {
      console.error("Cancel order error:", error);
      showToast(`Lỗi: ${error?.message || "Không thể hủy đơn hàng"}`, "error");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Lỗi khi tải đơn hàng</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-8">
            Hãy mua sắm để tạo đơn hàng đầu tiên
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== Number(statusFilter)) return false;
    if (paymentFilter !== "all" && order.paymentStatus !== Number(paymentFilter)) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái đơn hàng</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">Tất cả</option>
            <option value={OrderStatus.Pending}>Chờ xử lý</option>
            <option value={OrderStatus.Processing}>Đang xử lý</option>
            <option value={OrderStatus.Shipped}>Đã gửi</option>
            <option value={OrderStatus.Delivered}>Đã giao</option>
            <option value={OrderStatus.Cancelled}>Đã hủy</option>
            <option value={OrderStatus.Refunded}>Đã hoàn tiền</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái thanh toán</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as OrderPaymentStatus | "all")}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="all">Tất cả</option>
            <option value={OrderPaymentStatus.Pending}>Chờ thanh toán</option>
            <option value={OrderPaymentStatus.Completed}>Đã thanh toán</option>
            <option value={OrderPaymentStatus.Failed}>Thất bại</option>
            <option value={OrderPaymentStatus.Cancelled}>Đã hủy</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Không có đơn hàng nào phù hợp với bộ lọc</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order: OrderResponseDto) => (
          <div key={order.orderId} className="border rounded-lg overflow-hidden">
            {/* Order Header */}
            <button
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === order.orderId ? null : order.orderId
                )
              }
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">
                      Đơn hàng {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
                  <div className="flex gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        OrderStatusColor[order.status]
                      }`}
                    >
                      {OrderStatusDisplay[order.status]}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        PaymentStatusColor[order.paymentStatus]
                      }`}
                    >
                      {PaymentStatusDisplay[order.paymentStatus]}
                    </span>
                  </div>
                </div>

                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedOrderId === order.orderId ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </button>

            {/* Order Details */}
            {expandedOrderId === order.orderId && (
              <div className="p-4 border-t bg-gray-50">
                {/* Shipping Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                  <p>{order.shippingName}</p>
                  <p>{order.shippingPhone}</p>
                  <p>{order.shippingAddress}</p>
                  {order.shippedAt && (
                    <p className="text-sm text-gray-600 mt-2">
                      Gửi lúc: {new Date(order.shippedAt).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                  {order.deliveredAt && (
                    <p className="text-sm text-gray-600">
                      Giao lúc: {new Date(order.deliveredAt).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Sản phẩm</h3>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.equipmentName} × {item.quantity}
                        </span>
                        <span>{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-1 text-sm mb-6">
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
                      <span>-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-1">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Payments */}
                {order.payments && order.payments.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Lịch sử thanh toán</h3>
                    <div className="space-y-2">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.orderPaymentId}
                          className="flex justify-between text-sm p-2 bg-white rounded"
                        >
                          <div>
                            <p>{payment.paymentMethod}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(payment.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>{formatCurrency(payment.amount)}</p>
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
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => navigate(`/order/${order.orderId}`)}
                    className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Chi tiết
                  </button>
                  {order.status === OrderStatus.Pending && (
                    <>
                      {order.paymentStatus === OrderPaymentStatus.Pending && (
                        <button
                          onClick={() => handlePayNow(order)}
                          disabled={processingPaymentId === order.orderId}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {processingPaymentId === order.orderId
                            ? "Đang xử lý..."
                            : "Thanh toán ngay"}
                        </button>
                      )}
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={cancellingOrderId === order.orderId}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {cancellingOrderId === order.orderId
                          ? "Đang hủy..."
                          : "Hủy đơn"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
