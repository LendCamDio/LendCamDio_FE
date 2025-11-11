import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Package,
  Clock,
} from "lucide-react";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRentalList } from "@/hooks/rental/useRental";
import { useCustomerByUserId } from "@/hooks/customer/useCustomer";
import { useUser } from "@/hooks/user/useUser";
import {
  RentalStatus,
  RentalStatusType,
  type RentalResponseDto,
} from "@/types/entity.type";

const MyBooking = () => {
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] =
    useState<RentalResponseDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const pageSize = 10;
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | RentalStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: user } = useUser();
  const { data: customer } = useCustomerByUserId(
    user?.userId || "",
    Boolean(user?.userId)
  );

  const { data: rentals } = useRentalList(page, pageSize, {
    customerId: customer?.data?.customerId,
    status: activeTab !== "all" ? activeTab : undefined,
  });

  const statusConfig = {
    [RentalStatus.PENDING]: {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: AlertCircle,
      dotColor: "bg-yellow-500",
    },
    [RentalStatus.ACTIVE]: {
      label: "Đang thuê",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: Clock,
      dotColor: "bg-blue-500",
    },
    [RentalStatus.COMPLETED]: {
      label: "Hoàn thành",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle,
      dotColor: "bg-green-500",
    },
    [RentalStatus.CANCELLED]: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-700 border-red-300",
      icon: XCircle,
      dotColor: "bg-red-500",
    },
  };

  const calculateTabCounts = useMemo(() => {
    if (!rentals?.data?.items) {
      return {
        all: 0,
        [RentalStatus.PENDING]: 0,
        [RentalStatus.ACTIVE]: 0,
        [RentalStatus.COMPLETED]: 0,
        [RentalStatus.CANCELLED]: 0,
      };
    }

    const items = rentals.data.items;
    return {
      all: items.length,
      [RentalStatus.PENDING]: items.filter(
        (b) => b.status === RentalStatusType.indexOf(RentalStatus.PENDING)
      ).length,
      [RentalStatus.ACTIVE]: items.filter(
        (b) => b.status === RentalStatusType.indexOf(RentalStatus.ACTIVE)
      ).length,
      [RentalStatus.COMPLETED]: items.filter(
        (b) => b.status === RentalStatusType.indexOf(RentalStatus.COMPLETED)
      ).length,
      [RentalStatus.CANCELLED]: items.filter(
        (b) => b.status === RentalStatusType.indexOf(RentalStatus.CANCELLED)
      ).length,
    };
  }, [rentals?.data?.items]);

  const tabs = [
    { id: "all", label: "Tất cả", count: calculateTabCounts.all },
    {
      id: RentalStatus.PENDING,
      label: "Chờ xác nhận",
      count: calculateTabCounts[RentalStatus.PENDING],
    },
    {
      id: RentalStatus.ACTIVE,
      label: "Đang thuê",
      count: calculateTabCounts[RentalStatus.ACTIVE],
    },
    {
      id: RentalStatus.COMPLETED,
      label: "Hoàn thành",
      count: calculateTabCounts[RentalStatus.COMPLETED],
    },
    {
      id: RentalStatus.CANCELLED,
      label: "Đã hủy",
      count: calculateTabCounts[RentalStatus.CANCELLED],
    },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Giá cao đến thấp", value: "priceDesc" },
    { label: "Giá thấp đến cao", value: "priceAsc" },
  ];

  const filteredBookings = useMemo(() => {
    if (!rentals?.data) return [];

    return rentals.data.items.filter((rent: RentalResponseDto) => {
      const matchesTab =
        activeTab === "all" ||
        rent.status === RentalStatusType.indexOf(activeTab as RentalStatus);

      const matchesSearch =
        rent.equipmentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.rentalId?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rentals, activeTab, searchQuery]);

  const sortedBookings = useMemo(() => {
    if (!filteredBookings) return [];

    const items = [...filteredBookings];
    switch (sortBy) {
      case "newest":
        return items.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      case "oldest":
        return items.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      case "priceDesc":
        return items.sort((a, b) => b.totalPrice - a.totalPrice);
      case "priceAsc":
        return items.sort((a, b) => a.totalPrice - b.totalPrice);
      default:
        return items;
    }
  }, [filteredBookings, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCancelBooking = (rentId: string) => {
    showToast("Đơn đặt hàng đã được hủy", "success");
    console.log("Cancel booking:", rentId);
  };

  const handleContactSupport = (rentId: string) => {
    showToast("Chuyển đến trang liên hệ hỗ trợ", "info");
    navigate(`/contact`);
    console.log("Contact support for:", rentId);
  };

  const handleViewDetails = (rent: RentalResponseDto) => {
    setSelectedBooking(rent);
    setIsDetailOpen(true);
  };

  return (
    <PageWrapper>
      {/* Page Header */}
      <section className="hero">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Đơn thuê của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các đơn đặt thuê thiết bị
            </p>
          </motion.div>

          <div className="search-bar mt-4">
            <div className="search-container relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm theo tên thiết bị hoặc mã đơn..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "all" | RentalStatus)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <div className="min-page-height bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {sortedBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không có đơn thuê nào
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Không tìm thấy đơn thuê phù hợp với tìm kiếm của bạn"
                  : "Bạn chưa có đơn thuê nào trong mục này"}
              </p>
              <button
                onClick={() => navigate("/equipment")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Khám phá thiết bị
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {sortedBookings.map((booking, index) => {
                const StatusIcon =
                  statusConfig[RentalStatusType[booking.status] as RentalStatus]
                    .icon;
                const statusInfo =
                  statusConfig[
                    RentalStatusType[booking.status] as RentalStatus
                  ];

                return (
                  <motion.div
                    key={booking.rentalId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Equipment Image */}
                      <div className="w-full md:w-48 h-48 flex-shrink-0">
                        <img
                          src={
                            booking.equipmentImageUrl ||
                            "/placeholder-equipment.jpg"
                          }
                          alt={booking.equipmentName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {booking.equipmentName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Mã đơn: {booking.rentalId}
                            </p>
                          </div>
                          <span
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Từ: {formatDate(booking.startDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Đến: {formatDate(booking.endDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(booking.totalPrice)}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Xem chi tiết
                            </button>
                            {booking.status ===
                              RentalStatusType.indexOf(
                                RentalStatus.PENDING
                              ) && (
                              <button
                                onClick={() =>
                                  handleCancelBooking(booking.rentalId)
                                }
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Hủy đơn
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleContactSupport(booking.rentalId)
                              }
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Liên hệ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Chi tiết đơn thuê</h2>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Tên thiết bị</label>
                  <p className="text-lg font-semibold">
                    {selectedBooking.equipmentName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Mã đơn</label>
                    <p className="font-medium">{selectedBooking.rentalId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trạng thái</label>
                    <p className="font-medium">
                      {
                        statusConfig[
                          RentalStatusType[
                            selectedBooking.status
                          ] as RentalStatus
                        ].label
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Ngày bắt đầu
                    </label>
                    <p className="font-medium">
                      {formatDate(selectedBooking.startDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Ngày kết thúc
                    </label>
                    <p className="font-medium">
                      {formatDate(selectedBooking.endDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Tổng tiền</label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedBooking.totalPrice)}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Ngày tạo</label>
                  <p className="font-medium">
                    {formatDate(selectedBooking.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
};

export default MyBooking;
