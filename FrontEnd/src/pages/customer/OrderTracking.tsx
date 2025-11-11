import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  note?: string;
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    if (savedOrders.length > 0) {
      setSelectedOrder(savedOrders[0]);
    }
  }, []);

  const statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      icon: any;
      bgColor: string;
    }
  > = {
    pending: {
      label: "Chờ xác nhận",
      color: "text-yellow-600",
      icon: Clock,
      bgColor: "bg-yellow-50",
    },
    confirmed: {
      label: "Đã xác nhận",
      color: "text-blue-600",
      icon: CheckCircle,
      bgColor: "bg-blue-50",
    },
    shipping: {
      label: "Đang giao hàng",
      color: "text-purple-600",
      icon: Truck,
      bgColor: "bg-purple-50",
    },
    delivered: {
      label: "Đã giao hàng",
      color: "text-green-600",
      icon: CheckCircle,
      bgColor: "bg-green-50",
    },
    cancelled: {
      label: "Đã hủy",
      color: "text-red-600",
      icon: XCircle,
      bgColor: "bg-red-50",
    },
  };

  const getOrderTimeline = (status: string) => {
    const allSteps = [
      { key: "pending", label: "Đơn hàng đã đặt", time: "10:30 AM" },
      { key: "confirmed", label: "Đã xác nhận", time: "11:00 AM" },
      { key: "shipping", label: "Đang vận chuyển", time: "02:30 PM" },
      { key: "delivered", label: "Đã giao hàng", time: "05:00 PM" },
    ];

    const statusOrder = ["pending", "confirmed", "shipping", "delivered"];
    const currentIndex = statusOrder.indexOf(status);

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <PageWrapper>
        <div className="min-page-height flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-white rounded-lg shadow-md"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào để theo dõi
            </p>
            <button
              onClick={() => navigate("/cameras")}
              className="btn-primary"
            >
              Bắt đầu mua sắm
            </button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-page-height bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Theo dõi đơn hàng
            </h1>
            <p className="text-gray-600">
              Xem trạng thái và lịch sử đơn hàng của bạn
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {orders.map((order) => {
                    const config =
                      statusConfig[order.status] || statusConfig.pending;
                    const Icon = config.icon;

                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedOrder?.id === order.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            #{order.id}
                          </span>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {formatDate(order.createdAt)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color} font-medium`}
                          >
                            {config.label}
                          </span>
                          <span className="font-semibold text-sm">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2">
              {selectedOrder && (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Status Card */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`p-4 rounded-full ${
                          statusConfig[selectedOrder.status]?.bgColor ||
                          statusConfig.pending.bgColor
                        }`}
                      >
                        {(() => {
                          const Icon =
                            statusConfig[selectedOrder.status]?.icon ||
                            statusConfig.pending.icon;
                          return (
                            <Icon
                              className={`w-8 h-8 ${
                                statusConfig[selectedOrder.status]?.color ||
                                statusConfig.pending.color
                              }`}
                            />
                          );
                        })()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          Đơn hàng #{selectedOrder.id}
                        </h2>
                        <p className="text-gray-600">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      {getOrderTimeline(selectedOrder.status).map(
                        (step, index) => (
                          <div
                            key={step.key}
                            className="flex gap-4 pb-8 last:pb-0"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                  step.completed
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-white border-gray-300"
                                }`}
                              >
                                {step.completed ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                                )}
                              </div>
                              {index <
                                getOrderTimeline(selectedOrder.status).length -
                                  1 && (
                                <div
                                  className={`w-0.5 h-full ${
                                    step.completed
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <p
                                className={`font-semibold ${
                                  step.active
                                    ? "text-blue-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {step.label}
                              </p>
                              {step.completed && (
                                <p className="text-sm text-gray-500">
                                  {step.time}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Thông tin giao hàng
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người nhận:</span>
                        <span className="font-medium">
                          {selectedOrder.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số điện thoại:</span>
                        <span className="font-medium">
                          {selectedOrder.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <span className="font-medium text-right max-w-xs">
                          {selectedOrder.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Phương thức thanh toán:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.paymentMethod === "vnpay"
                            ? "VNPay"
                            : selectedOrder.paymentMethod === "momo"
                            ? "MoMo"
                            : selectedOrder.paymentMethod === "bank_transfer"
                            ? "Chuyển khoản"
                            : "Tiền mặt"}
                        </span>
                      </div>
                      {selectedOrder.note && (
                        <div className="pt-3 border-t">
                          <p className="text-gray-600 mb-1">Ghi chú:</p>
                          <p className="text-sm italic">{selectedOrder.note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Sản phẩm ({selectedOrder.items.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-6 border-t space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Tổng tiền hàng:</span>
                        <span>
                          {formatCurrency(selectedOrder.total - 50000)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Phí dịch vụ:</span>
                        <span>{formatCurrency(50000)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Tổng thanh toán:</span>
                        <span className="text-blue-600">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedOrder.status === "pending" && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Đơn hàng đang chờ xác nhận
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm
                            nhất để xác nhận đơn hàng.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderTracking;
