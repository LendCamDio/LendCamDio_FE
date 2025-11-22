import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileText,
  Truck,
  CreditCard,
  Package,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { orderService } from "@/services/order.service";
import {
  OrderPaymentStatus,
  OrderStatus,
  OrderPaymentMethod,
} from "@/types/order.type";
import type { OrderResponseDto } from "@/types/order.type";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

type OrderDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onStatusUpdate?: (updatedOrder: OrderResponseDto) => void;
};

const ORDER_STATUS_OPTIONS = Object.values(OrderStatus).filter(
  (value): value is OrderStatus => typeof value === "number"
);

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Pending",
  [OrderStatus.Processing]: "Processing",
  [OrderStatus.Shipped]: "Shipped",
  [OrderStatus.Delivered]: "Delivered",
  [OrderStatus.Cancelled]: "Cancelled",
  [OrderStatus.Refunded]: "Refunded",
};

const ORDER_STATUS_BADGES: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.Processing]: "bg-blue-100 text-blue-800",
  [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-800",
  [OrderStatus.Delivered]: "bg-green-100 text-green-800",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-800",
  [OrderStatus.Refunded]: "bg-gray-200 text-gray-700",
};

const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  [OrderPaymentStatus.Pending]: "Pending",
  [OrderPaymentStatus.Completed]: "Completed",
  [OrderPaymentStatus.Failed]: "Failed",
  [OrderPaymentStatus.Refunded]: "Refunded",
  [OrderPaymentStatus.Cancelled]: "Cancelled",
};

const PAYMENT_STATUS_BADGES: Record<OrderPaymentStatus, string> = {
  [OrderPaymentStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderPaymentStatus.Completed]: "bg-emerald-100 text-emerald-700",
  [OrderPaymentStatus.Failed]: "bg-red-100 text-red-800",
  [OrderPaymentStatus.Refunded]: "bg-blue-100 text-blue-800",
  [OrderPaymentStatus.Cancelled]: "bg-gray-200 text-gray-700",
};

const PAYMENT_METHOD_LABELS: Record<OrderPaymentMethod, string> = {
  [OrderPaymentMethod.VNPay]: "VNPay",
  [OrderPaymentMethod.Cash]: "Cash",
  [OrderPaymentMethod.PayOS]: "PayOS",
  [OrderPaymentMethod.BankTransfer]: "Bank Transfer",
};

const OrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
  onStatusUpdate,
}: OrderDetailModalProps) => {
  const showToast = useUniqueToast();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OrderStatus | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !isOpen) return;

      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
        setStatusDraft(data.status);
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setOrder(null);
        setStatusDraft(null);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, isOpen]);

  const handleStatusUpdate = async () => {
    if (!order || statusDraft === null) return;

    if (statusDraft === order.status) {
      showToast("Order status is unchanged.", "info");
      return;
    }

    try {
      setStatusSaving(true);
      const updatedOrder = await orderService.updateOrderStatus(
        order.orderId,
        statusDraft
      );

      setOrder(updatedOrder);
      setStatusDraft(updatedOrder.status);
      showToast("Order status updated successfully.", "success");

      if (onStatusUpdate) {
        onStatusUpdate(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Unable to update order status. Please try again.", "error");
    } finally {
      setStatusSaving(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review order information, fulfillment steps, and payment history.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Top Grid: Info & Shipping */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Order Info */}
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Order Information
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Order Number</span>
                      <span className="font-mono font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          ORDER_STATUS_BADGES[order.status]
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-900">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-500 block mb-1">Notes</span>
                        <p className="text-gray-700 italic">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Shipping Details
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Recipient</p>
                        <p className="font-medium text-gray-900">
                          {order.shippingName || order.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Phone</p>
                        <p className="font-medium text-gray-900">
                          {order.shippingPhone || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Address</p>
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Update Order Status
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={statusDraft ?? order.status}
                    onChange={(event) =>
                      setStatusDraft(Number(event.target.value) as OrderStatus)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-64 bg-white"
                  >
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-all shadow-sm"
                  >
                    {statusSaving && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                    )}
                    Update Status
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Order Items
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead className="bg-white text-left text-xs font-medium uppercase text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3 text-center">Quantity</th>
                        <th className="px-5 py-3 text-right">Unit Price</th>
                        <th className="px-5 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {order.orderItems?.map((item) => (
                        <tr key={item.orderItemId} className="hover:bg-gray-50/50">
                          <td className="px-5 py-4 font-medium text-gray-900">
                            {item.equipmentName}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-5 py-4 text-right text-gray-600">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50/50">
                      <tr>
                        <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-900">
                          Total Amount
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-blue-600 text-lg">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment History */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  Payment History
                </h3>
                {order.payments?.length ? (
                  <div className="space-y-3">
                    {order.payments.map((payment) => (
                      <div
                        key={payment.orderPaymentId}
                        className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/30 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 sm:justify-end">
                          <span className="font-mono font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              PAYMENT_STATUS_BADGES[payment.status]
                            }`}
                          >
                            {PAYMENT_STATUS_LABELS[payment.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">
                      No payments recorded for this order yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Select an order to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default OrderDetailModal;
