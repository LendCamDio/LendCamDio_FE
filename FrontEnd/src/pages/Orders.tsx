import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Truck, Package, AlertCircle } from "lucide-react";
import {
  useMyOrders,
  useCreateOrderPayment,
  useCreatePayOsPaymentForOrder,
  useCancelOrder,
} from "@/hooks/order/useOrder";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  OrderStatus,
  OrderPaymentStatus,
  OrderPaymentMethod,
} from "@/types/order.type";
import type { OrderResponseDto } from "@/types/order.type";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { cn } from "@/lib/utils";

// --- Constants & Helpers ---

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ thanh toán" },
  { id: "processing", label: "Vận chuyển" },
  { id: "shipped", label: "Đang giao" },
  { id: "completed", label: "Hoàn thành" },
  { id: "cancelled", label: "Đã hủy" },
  { id: "refunded", label: "Trả hàng/Hoàn tiền" },
];

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return "CHỜ THANH TOÁN";
    case OrderStatus.Processing:
      return "ĐANG XỬ LÝ";
    case OrderStatus.Shipped:
      return "ĐANG GIAO";
    case OrderStatus.Delivered:
      return "HOÀN THÀNH";
    case OrderStatus.Cancelled:
      return "ĐÃ HỦY";
    case OrderStatus.Refunded:
      return "ĐÃ HOÀN TIỀN";
    default:
      return "";
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return "text-orange-500";
    case OrderStatus.Processing:
      return "text-blue-500";
    case OrderStatus.Shipped:
      return "text-teal-500";
    case OrderStatus.Delivered:
      return "text-green-500";
    case OrderStatus.Cancelled:
      return "text-red-500";
    case OrderStatus.Refunded:
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  const { data: orders, isLoading, error } = useMyOrders();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null
  );
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );

  const createPayment = useCreateOrderPayment();
  const createPayOsLink = useCreatePayOsPaymentForOrder();
  const cancelOrder = useCancelOrder();

  // --- Actions ---

  const handlePayNow = async (order: OrderResponseDto) => {
    setProcessingPaymentId(order.orderId);
    try {
      const paymentResult = await createPayment.mutateAsync({
        orderId: order.orderId,
        paymentMethod: OrderPaymentMethod.PayOS,
      });

      if (!paymentResult.orderPaymentId)
        throw new Error("Failed to create payment");

      const payosResult = await createPayOsLink.mutateAsync(
        paymentResult.orderPaymentId
      );

      if (payosResult.checkoutUrl) {
        window.location.href = payosResult.checkoutUrl;
      } else {
        throw new Error("Failed to get payment link");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(
        `Lỗi: ${error?.message || "Không thể tạo thanh toán"}`,
        "error"
      );
      setProcessingPaymentId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

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

  const handleBuyAgain = (order: OrderResponseDto) => {
    // Logic to add items to cart or redirect to product page
    // For now, just redirect to the first product
    if (order.orderItems.length > 0) {
      // Ideally, add all to cart. Here we just go to products page as a placeholder
      navigate("/products");
    }
  };

  // ...existing code... (contact/chat removed)

  // --- Filtering Logic ---

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let result = orders;

    // 1. Filter by Tab
    if (activeTab !== "all") {
      result = result.filter((order) => {
        switch (activeTab) {
          case "pending":
            return order.status === OrderStatus.Pending;
          case "processing":
            return order.status === OrderStatus.Processing; // Grouping Processing into "Vận chuyển" tab logic? Or separate?
          // Shopee "Vận chuyển" usually means To Ship/Shipping.
          // Let's map: Pending -> Pending. Processing -> Processing. Shipped -> Shipped.
          // But tabs are: Pending, Processing (Vận chuyển?), Shipped (Đang giao?), Completed.
          // Let's stick to exact mapping for now based on the TABS definition above.
          // case "processing": // "Vận chuyển" tab name, but let's map to Processing status
          //    return order.status === OrderStatus.Processing;
          case "shipped": // "Đang giao"
            return order.status === OrderStatus.Shipped;
          case "completed":
            return order.status === OrderStatus.Delivered;
          case "cancelled":
            return order.status === OrderStatus.Cancelled;
          case "refunded":
            return order.status === OrderStatus.Refunded;
          default:
            return true;
        }
      });
    }

    // 2. Filter by Search
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowerTerm) ||
          order.orderItems.some((item) =>
            item.equipmentName.toLowerCase().includes(lowerTerm)
          )
      );
    }

    return result;
  }, [orders, activeTab, searchTerm]);

  // --- Render ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-medium mb-2">Đã có lỗi xảy ra</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Tabs Header */}
        <div className="bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-100 py-4">
          <div className="relative max-w-5xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm"
                className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded shadow-sm focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 mt-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded shadow-sm">
                {/* Card Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      LendCamDio Official
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === OrderStatus.Shipped && (
                      <div className="flex items-center gap-1 text-teal-600 text-sm">
                        <Truck className="w-4 h-4" />
                        <span>Đơn hàng đang được giao</span>
                      </div>
                    )}
                    <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                    <span
                      className={cn(
                        "text-sm font-medium uppercase",
                        getStatusColor(order.status)
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Card Items */}
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/order/${order.orderId}`)}
                >
                  {order.orderItems.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="px-6 py-4 border-b last:border-b-0 flex gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden bg-gray-100">
                        {item.equipmentImage ? (
                          <img
                            src={item.equipmentImage}
                            alt={item.equipmentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-800 line-clamp-2">
                          {item.equipmentName}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Phân loại hàng: Mặc định
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          x{item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        {/* Assuming no discount on unit price for now, or show original price crossed out if available */}
                        <span className="text-blue-600 font-medium">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50/50">
                  <div className="flex justify-end items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Thành tiền:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-end gap-3">
                    {/* Action Buttons based on Status */}

                    {order.status === OrderStatus.Delivered && (
                      <>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                          Đánh giá
                        </button>
                        <button
                          onClick={() => handleBuyAgain(order)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Mua lại
                        </button>
                      </>
                    )}

                    {order.status === OrderStatus.Pending && (
                      <>
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancellingOrderId === order.orderId}
                          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {cancellingOrderId === order.orderId
                            ? "Đang hủy..."
                            : "Hủy đơn hàng"}
                        </button>
                        {order.paymentStatus === OrderPaymentStatus.Pending && (
                          <button
                            onClick={() => handlePayNow(order)}
                            disabled={processingPaymentId === order.orderId}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {processingPaymentId === order.orderId
                              ? "Đang xử lý..."
                              : "Thanh toán ngay"}
                          </button>
                        )}
                      </>
                    )}

                    {(order.status === OrderStatus.Processing ||
                      order.status === OrderStatus.Shipped) && (
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium cursor-not-allowed opacity-80">
                        Chờ nhận hàng
                      </button>
                    )}

                    {order.status === OrderStatus.Delivered && (
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-green-200 text-green-700 rounded bg-green-50 text-sm font-medium cursor-default">
                          Đã nhận được
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
