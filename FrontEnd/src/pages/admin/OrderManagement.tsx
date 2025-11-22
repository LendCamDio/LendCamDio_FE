import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Info,
  RefreshCw,
  Search,
} from "lucide-react";
import { orderService } from "@/services/order.service";
import {
  OrderPaymentStatus,
  OrderStatus,
} from "@/types/order.type";
import type { OrderResponseDto } from "@/types/order.type";
import { formatCurrency, formatDate } from "@/utils/format";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

const ORDER_STATUS_OPTIONS = Object.values(OrderStatus).filter(
  (value): value is OrderStatus => typeof value === "number"
);

const PAYMENT_STATUS_OPTIONS = Object.values(OrderPaymentStatus).filter(
  (value): value is OrderPaymentStatus => typeof value === "number"
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

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    OrderPaymentStatus | "all"
  >("all");
  
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingError(null);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      setLoadingError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleOrderUpdate = (updatedOrder: OrderResponseDto) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.orderId === updatedOrder.orderId ? updatedOrder : order
      )
    );
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentStatusFilter === "all" ||
        order.paymentStatus === paymentStatusFilter;
      const matchesSearch =
        term.length === 0 ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term);

      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, paymentStatusFilter, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-600">
        <p>{loadingError}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const hasNoData = filteredOrders.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">
            Monitor orders, payment activity, and status updates in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <label className="text-xs font-medium uppercase text-gray-500">
              Search Orders
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by order number, customer name, or email"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row lg:max-w-xl">
            <div className="flex-1">
              <label className="text-xs font-medium uppercase text-gray-500">
                Order Status
              </label>
              <select
                value={statusFilter === "all" ? "all" : statusFilter.toString()}
                onChange={(event) => {
                  const value = event.target.value;
                  setStatusFilter(value === "all" ? "all" : (Number(value) as OrderStatus));
                }}
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All statuses</option>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium uppercase text-gray-500">
                Payment Status
              </label>
              <select
                value={
                  paymentStatusFilter === "all"
                    ? "all"
                    : paymentStatusFilter.toString()
                }
                onChange={(event) => {
                  const value = event.target.value;
                  setPaymentStatusFilter(
                    value === "all" ? "all" : (Number(value) as OrderPaymentStatus)
                  );
                }}
                className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All payment states</option>
                {PAYMENT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {PAYMENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {hasNoData ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders match the current filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const itemCount = order.orderItems?.length ?? 0;
                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${ORDER_STATUS_BADGES[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${PAYMENT_STATUS_BADGES[order.paymentStatus]}`}
                      >
                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(order.orderId)}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-100 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Info className="h-4 w-4" />
                        Details
                      </button>
                    </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-sm text-gray-600">
            <div>
              Showing page {currentPage} of {totalPages} ({filteredOrders.length} orders)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <OrderDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        orderId={selectedOrderId}
        onStatusUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default OrderManagement;
