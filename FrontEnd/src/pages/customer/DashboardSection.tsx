import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClock,
  faClockRotateLeft,
  faMoneyBillWave,
  faShoppingCart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

import { Tooltip } from "@/components/ui/Tootlip";
import { useMyOrders } from "@/hooks/order/useOrder";
import type { OrderResponseDto } from "@/types/order.type";
import { OrderPaymentStatus, OrderStatus } from "@/types/order.type";
import { formatCurrency } from "@/utils/currencyFormatter";

const DashboardSection = () => {
  const navigate = useNavigate();
  const { data: ordersData, isLoading, isError } = useMyOrders();
  const orders = ordersData ?? [];

  const statusLabels: Record<OrderStatus, string> = useMemo(
    () => ({
      [OrderStatus.Pending]: "Chờ xử lý",
      [OrderStatus.Processing]: "Đang xử lý",
      [OrderStatus.Shipped]: "Đang giao",
      [OrderStatus.Delivered]: "Đã hoàn thành",
      [OrderStatus.Cancelled]: "Đã hủy",
      [OrderStatus.Refunded]: "Đã hoàn tiền",
    }),
    []
  );

  const activityMessages: Record<OrderStatus, string> = useMemo(
    () => ({
      [OrderStatus.Pending]: "được tạo",
      [OrderStatus.Processing]: "đang được xử lý",
      [OrderStatus.Shipped]: "đã xuất kho",
      [OrderStatus.Delivered]: "đã giao thành công",
      [OrderStatus.Cancelled]: "đã bị hủy",
      [OrderStatus.Refunded]: "đã được hoàn tiền",
    }),
    []
  );

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (order) => order.status === OrderStatus.Delivered
    ).length;
    const pendingOrders = orders.filter((order) =>
      [OrderStatus.Pending, OrderStatus.Processing].includes(order.status)
    ).length;
    const totalSpent = orders.reduce((sum, order) => {
      if (order.paymentStatus === OrderPaymentStatus.Completed) {
        return sum + order.totalAmount;
      }
      return sum;
    }, 0);

    return {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalSpent,
    };
  }, [orders]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders]);

  const latestOrders = useMemo(() => sortedOrders.slice(0, 5), [sortedOrders]);

  const formatDateTime = (value?: string) => {
    if (!value) return "Không xác định";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Không xác định";
    }
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatRelativeTime = (value?: string) => {
    if (!value) return "Không xác định";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Không xác định";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} tuần trước`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} tháng trước`;

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} năm trước`;
  };

  const buildActivityDescription = (order: OrderResponseDto) => {
    const message = activityMessages[order.status] || "được cập nhật";
    return `Đơn ${order.orderNumber} ${message}`;
  };

  const recentActivities = useMemo(
    () =>
      latestOrders.map((order) => ({
        id: order.orderId,
        activity: buildActivityDescription(order),
        time: formatRelativeTime(order.updatedAt || order.createdAt),
      })),
    [latestOrders]
  );

  return (
    <section className="section" id="userDashboard">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Dashboard của bạn</h2>
          <p className="section-subtitle">Tổng quan hoạt động và đơn hàng</p>
        </div>

        <div className="row mb-5">
          {/* Đơn hàng */}
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon dashUser-icon-shop">
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
              <div className="stat-info">
                <h3 id="user-total-orders">
                  {isLoading ? "..." : stats.totalOrders.toLocaleString("vi-VN")}
                </h3>
                <p>Tổng đơn hàng</p>
              </div>
            </div>
          </div>
          {/* Lịch đặt */}
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon dashUser-icon-calendar">
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <div className="stat-info">
                <h3 id="user-completed-orders">
                  {isLoading
                    ? "..."
                    : stats.deliveredOrders.toLocaleString("vi-VN")}
                </h3>
                <p>Đơn đã hoàn thành</p>
              </div>
            </div>
          </div>
          {/* Tổng chi tiêu */}
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon dashUser-icon-money">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </div>
              <div className="stat-info">
                <Tooltip content="Tổng chi tiêu của bạn">
                  <h3 id="user-total-spent">
                    {isLoading ? "..." : formatCurrency(stats.totalSpent)}
                  </h3>
                </Tooltip>
                <p>Tổng chi tiêu</p>
              </div>
            </div>
          </div>
          {/* Đơn chờ xử lý */}
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon dashUser-icon-pending">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="stat-info">
                <h3 id="user-pending-orders">
                  {isLoading
                    ? "..."
                    : stats.pendingOrders.toLocaleString("vi-VN")}
                </h3>
                <p>Đơn đang chờ</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-around mb-5">
          {/* Hoạt động gần đây */}
          {/* Chỉ hiển thị 5 hoạt động gần đây nhất, không cần fetch toàn bộ */}
          <div className="h-full col-md-5 mt-4">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h4 className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClockRotateLeft} /> Hoạt động gần đây
                </h4>
                <button
                  onClick={() => navigate("/customer/booking-history")}
                  className="btn btn-outline-primary"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="dashboard-card-table-container">
                {/* Table header cố định */}
                <table className="dashboard-card-table">
                  <thead className="dashboard-card-table-header">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Hoạt động</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="dashboard-card-table-body">
                    {isLoading ? (
                      <tr>
                        <td colSpan={3}>Đang tải dữ liệu...</td>
                      </tr>
                    ) : isError ? (
                      <tr>
                        <td colSpan={3}>Không thể tải hoạt động gần đây</td>
                      </tr>
                    ) : recentActivities.length === 0 ? (
                      <tr>
                        <td colSpan={3}>Chưa có hoạt động nào</td>
                      </tr>
                    ) : (
                      recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.id.slice(0, 8)}...</td>
                          <td>{activity.activity}</td>
                          <td>{activity.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Đơn hàng gần đây */}
          {/* Chỉ hiển thị 5 đơn hàng gần đây nhất, không cần fetch toàn bộ */}
          <div className="h-full col-md-7 mt-4">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h4 className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} /> Đơn hàng gần đây
                </h4>
                <button
                  onClick={() => navigate("/orders")}
                  className="btn btn-outline-primary"
                >
                  Theo dõi
                </button>
              </div>
              <div className="dashboard-card-table-container">
                {/* Table header cố định */}
                <table className="dashboard-card-table">
                  <thead className="dashboard-card-table-header">
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Ngày</th>
                      <th>Trạng thái</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>
                  <tbody className="dashboard-card-table-body">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4}>Đang tải dữ liệu...</td>
                      </tr>
                    ) : isError ? (
                      <tr>
                        <td colSpan={4}>Không thể tải danh sách đơn hàng</td>
                      </tr>
                    ) : latestOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4}>Chưa có đơn hàng nào</td>
                      </tr>
                    ) : (
                      latestOrders.map((order) => (
                        <tr key={order.orderId}>
                          <td>{order.orderNumber}</td>
                          <td>{formatDateTime(order.createdAt)}</td>
                          <td>{statusLabels[order.status]}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
