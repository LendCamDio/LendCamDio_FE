import { Tooltip } from "@/components/ui/Tootlip";
import { useAuth } from "@/hooks/auth/useAuth";
import { usePaymentsByCustomer } from "@/hooks/payment/usePayment";
import {
  faCalendarCheck,
  faClock,
  faClockRotateLeft,
  faMoneyBillWave,
  faShoppingCart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSection = () => {
  const navigate = useNavigate();
  const [page] = useState(1);
  const [pageSize] = useState(100);
  const { user } = useAuth();

  // Fetch statistics data
  const { data: dataResPayment } = usePaymentsByCustomer(
    user?.id || "",
    page,
    pageSize,
    Boolean(user?.id)
  );
  const { data: dataResRental } = usePaymentsByCustomer(
    user?.id || "",
    page,
    pageSize,
    Boolean(user?.id)
  );

  const payments = dataResPayment?.data?.items || [];
  const rentals = dataResRental?.data?.items || [];

  const [totalSpent] = useState(() => {
    return payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);
  });
  const [totalRental] = useState(() => {
    return rentals.length;
  });

  // Sample data
  const nearlyActivitiesCols = [
    { header: "ID", accessor: "id" },
    { header: "Hoạt động", accessor: "activity" },
    { header: "Thời gian", accessor: "time" },
  ];
  const nearlyActivitiesData = [
    { id: 1, activity: "Đặt hàng #1234", time: "2 giờ trước" },
    { id: 2, activity: "Hủy đơn #1233", time: "1 ngày trước" },
    { id: 3, activity: "Cập nhật thông tin cá nhân", time: "3 ngày trước" },
  ];
  const recentOrdersData = [
    {
      id: 1,
      orderId: "#1234",
      date: "2023-10-01",
      status: "Đang xử lý",
      total: "500,000đ",
    },
    {
      id: 2,
      orderId: "#1233",
      date: "2023-09-28",
      status: "Hoàn thành",
      total: "1,200,000đ",
    },
    {
      id: 3,
      orderId: "#1232",
      date: "2023-09-25",
      status: "Hủy",
      total: "300,000đ",
    },
    {
      id: 4,
      orderId: "#1231",
      date: "2023-09-20",
      status: "Hoàn thành",
      total: "750,000đ",
    },
    {
      id: 5,
      orderId: "#1230",
      date: "2023-09-18",
      status: "Đang xử lý",
      total: "620,000đ",
    },
  ];
  const recentOrderColumns = [
    { header: "Mã đơn hàng", accessor: "orderId" },
    { header: "Ngày", accessor: "date" },
    { header: "Trạng thái", accessor: "status" },
    { header: "Tổng", accessor: "total" },
  ];

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
                <h3 id="user-total-orders">{totalRental}</h3>
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
                <h3 id="user-total-bookings">0</h3>
                <p>Lịch đặt</p>
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
                  <h3 id="user-total-spent">{totalSpent} VND</h3>
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
                <h3 id="user-pending-orders">0</h3>
                <p>Đơn chờ xử lý</p>
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
                      {nearlyActivitiesCols.map((col) => (
                        <th key={col.accessor}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="dashboard-card-table-body">
                    {nearlyActivitiesData.length === 0 ? (
                      <tr>
                        <td colSpan={3}>Chưa có hoạt động nào</td>
                      </tr>
                    ) : (
                      nearlyActivitiesData.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.id}</td>
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
                  onClick={() => navigate("/customer/cart")}
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
                      {recentOrderColumns.map((col) => (
                        <th key={col.accessor}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="dashboard-card-table-body">
                    {recentOrdersData.length === 0 ? (
                      <tr>
                        <td colSpan={4}>Chưa có đơn hàng nào</td>
                      </tr>
                    ) : (
                      recentOrdersData.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>{order.status}</td>
                          <td>{order.total}</td>
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
