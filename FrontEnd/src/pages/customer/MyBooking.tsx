import { lazy, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

const BookingTabs = lazy(() => import("@/components/booking/BookingTabs"));
const BookingGrid = lazy(() => import("@/components/booking/BookingGrid"));
const DetailModal = lazy(() => import("@/components/booking/DetailModal"));
// Mock data - replace with actual API data
// #region Mock Data
// const mockBookings: RentalResponseDto[] = [
//   {
//     rentalId: "rental_001",
//     customerId: "cust_001",
//     customerName: "John Doe",
//     equipmentId: "equip_001",
//     equipmentName: "Excavator",
//     equipmentImageUrl: "https://example.com/images/excavator.jpg",
//     startDate: "2025-10-20",
//     endDate: "2025-10-25",
//     totalPrice: 1500.0,
//     deposit: 500.0,
//     insuranceFee: 100.0,
//     notes: "Urgent delivery required",
//     status: RentalStatus.ACTIVE.indexOf(RentalStatus.ACTIVE),
//     hasContract: true,
//     contractStatus: ContractStatus.SIGNED,
//     createdAt: "2025-10-15T10:00:00Z",
//     createdBy: "admin_001",
//     updatedAt: "2025-10-16T12:00:00Z",
//     updatedBy: "admin_001",
//   },
//   {
//     rentalId: "rental_002",
//     customerId: "cust_002",
//     customerName: "Jane Smith",
//     equipmentId: "equip_002",
//     equipmentName: "Bulldozer",
//     equipmentImageUrl: null,
//     startDate: "2025-11-01",
//     endDate: "2025-11-05",
//     totalPrice: 2000.0,
//     deposit: 700.0,
//     insuranceFee: 150.0,
//     notes: null,
//     status: RentalStatus.PENDING.indexOf(RentalStatus.PENDING),
//     hasContract: false,
//     contractStatus: null,
//     createdAt: "2025-10-18T09:00:00Z",
//     createdBy: "admin_002",
//     updatedAt: null,
//     updatedBy: null,
//   },
//   {
//     rentalId: "rental_003",
//     customerId: "cust_003",
//     customerName: "Acme Corp",
//     equipmentId: "equip_003",
//     equipmentName: "Forklift",
//     equipmentImageUrl: "https://example.com/images/forklift.jpg",
//     startDate: "2025-10-22",
//     endDate: "2025-10-30",
//     totalPrice: 1200.0,
//     deposit: 400.0,
//     insuranceFee: 80.0,
//     notes: "Extended rental period",
//     status: RentalStatus.PENDING.indexOf(RentalStatus.PENDING),
//     hasContract: true,
//     contractStatus: ContractStatus.DRAFT,
//     createdAt: "2025-10-10T14:30:00Z",
//     createdBy: "admin_001",
//     updatedAt: "2025-10-20T08:00:00Z",
//     updatedBy: "admin_003",
//   },
//   {
//     rentalId: "rental_004",
//     customerId: "cust_004",
//     customerName: "Bob Johnson",
//     equipmentId: "equip_004",
//     equipmentName: "Crane",
//     equipmentImageUrl: "https://example.com/images/crane.jpg",
//     startDate: "2025-10-01",
//     endDate: "2025-10-10",
//     totalPrice: 3000.0,
//     deposit: 1000.0,
//     insuranceFee: 200.0,
//     notes: "Project completed early",
//     status: RentalStatus.COMPLETED.indexOf(RentalStatus.COMPLETED),
//     hasContract: true,
//     contractStatus: ContractStatus.SIGNED,
//     createdAt: "2025-09-25T11:00:00Z",
//     createdBy: "admin_002",
//     updatedAt: "2025-10-10T15:00:00Z",
//     updatedBy: "admin_002",
//   },
//   {
//     rentalId: "rental_005",
//     customerId: "cust_005",
//     customerName: "Emma Wilson",
//     equipmentId: "equip_005",
//     equipmentName: "Generator",
//     equipmentImageUrl: null,
//     startDate: "2025-10-15",
//     endDate: "2025-10-20",
//     totalPrice: 800.0,
//     deposit: 200.0,
//     insuranceFee: 50.0,
//     notes: "Cancelled due to project delay",
//     status: RentalStatus.CANCELLED.indexOf(RentalStatus.CANCELLED),
//     hasContract: true,
//     contractStatus: ContractStatus.TERMINATED,
//     createdAt: "2025-10-12T16:00:00Z",
//     createdBy: "admin_003",
//     updatedAt: "2025-10-14T10:00:00Z",
//     updatedBy: "admin_003",
//   },
// ];
// #endregion

const MyBooking = () => {
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] =
    useState<RentalResponseDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const pageSize = 10;
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<"all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetActiveTab = (value: string) => {
    setActiveTab(value as "all");
  };
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: user } = useUser();
  const { data: customer } = useCustomerByUserId(
    user?.userId || "",
    Boolean(user?.userId)
  );
  const { data: rentals } = useRentalList(page, pageSize, {
    customerId: customer?.data?.customerId,
    status: activeTab !== "all" ? (activeTab as RentalStatus) : undefined,
  });
  console.log("Rentals data:", rentals);

  const statusConfig = {
    [RentalStatus.PENDING]: {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: AlertCircle,
      dotColor: "bg-yellow-500",
    },
    [RentalStatus.ACTIVE]: {
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: CheckCircle,
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
      label: "Đã xác nhận",
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
    // return mockBookings.filter((rent: RentalResponseDto) => {
    return rentals.data.items.filter((rent: RentalResponseDto) => {
      const matchesTab =
        activeTab === "all" ||
        rent.status === RentalStatusType.indexOf(activeTab as RentalStatus);
      const matchesSearch =
        rent.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rent.rentalId.toLowerCase().includes(searchQuery.toLowerCase());
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
    console.log("View details for:", rent.rentalId);
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
            <h1>Lịch sử đặt hàng</h1>
            <p>Quản lý và theo dõi các đơn đặt thuê thiết bị và studio</p>
          </motion.div>
        </div>
        <div className="search-bar mt-4">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              id="searchInput"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <BookingTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onSort={(sortBy: string) => setSortBy(sortBy)}
        sortOptions={sortOptions}
      />

      <div className="min-page-height bg-[var(--bg-light)] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Bookings List */}
          <BookingGrid
            bookings={sortedBookings}
            onSelectViewDetail={handleViewDetails}
            formatDate={formatDate}
            formatPrice={formatPrice}
            statusConfig={statusConfig}
            onCancelBooking={handleCancelBooking}
            onContactSupport={handleContactSupport}
          />
        </div>
      </div>

      <DetailModal
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedBooking={selectedBooking!}
        formatDate={formatDate}
        formatPrice={formatPrice}
        statusConfig={statusConfig}
        rentalStatus={0}
      />
    </PageWrapper>
  );
};

export default MyBooking;
