import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { ConfirmDialog } from "@/components/ui/Dialog";
import api from "@/services/api";
import { RENTAL_ENDPOINTS } from "@/constants/endpoints";
import RentalDetailModal from "@/components/admin/RentalDetailModal";

interface Rental {
  rentalId: string;
  equipmentName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const RentalManagement = () => {
  const showToast = useUniqueToast();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "complete" | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    fetchRentals();
  }, [currentPage, filterStatus]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const endpoint =
        filterStatus === "all"
          ? RENTAL_ENDPOINTS.GET_ALL
          : RENTAL_ENDPOINTS.GET_BY_STATUS(filterStatus);

      const response = await api.get(endpoint, {
        params: { page: currentPage, pageSize },
      });

      if (response.data?.success) {
        setRentals(response.data.data.items || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (id: string) => {
    setSelectedRentalId(id);
    setActionType("approve");
    setActionDialogOpen(true);
  };

  const handleCompleteClick = (id: string) => {
    setSelectedRentalId(id);
    setActionType("complete");
    setActionDialogOpen(true);
  };

  const handleCancelClick = (id: string) => {
    setSelectedRentalId(id);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRentalId || !actionType) return;

    try {
      if (actionType === "approve") {
        await api.patch(RENTAL_ENDPOINTS.APPROVE(selectedRentalId));
        showToast("Rental approved successfully!", "success");
      } else if (actionType === "complete") {
        await api.patch(RENTAL_ENDPOINTS.COMPLETE(selectedRentalId));
        showToast("Rental completed successfully!", "success");
      }
      fetchRentals();
    } catch (error: any) {
      console.error(`Error ${actionType}ing rental:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${actionType} rental. Please try again.`;
      showToast(errorMessage, "error");
    } finally {
      setSelectedRentalId(null);
      setActionType(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedRentalId || !cancelReason.trim()) {
      showToast("Please provide a cancellation reason", "error");
      return;
    }

    try {
      await api.patch(
        RENTAL_ENDPOINTS.CANCEL(selectedRentalId),
        JSON.stringify(cancelReason),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      showToast("Rental cancelled successfully!", "success");
      fetchRentals();
      setCancelDialogOpen(false);
    } catch (error: any) {
      console.error("Error cancelling rental:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to cancel rental. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setSelectedRentalId(null);
      setCancelReason("");
    }
  };

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | number) => {
    // Convert to string if it's a number (enum value)
    const statusStr = typeof status === "number" ? status.toString() : status;

    switch (statusStr.toLowerCase()) {
      case "pending":
      case "0":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "1":
        return "bg-blue-100 text-blue-800";
      case "active":
      case "2":
        return "bg-green-100 text-green-800";
      case "completed":
      case "3":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
      case "4":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusName = (status: string | number) => {
    const statusStr = typeof status === "number" ? status.toString() : status;

    switch (statusStr.toLowerCase()) {
      case "pending":
      case "0":
        return "Pending";
      case "approved":
      case "1":
        return "Approved";
      case "active":
      case "2":
        return "Active";
      case "completed":
      case "3":
        return "Completed";
      case "cancelled":
      case "4":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rental Management</h1>
        <p className="text-gray-600 mt-2">Manage all equipment rentals</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rentals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.rentalId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rental.customerName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {rental.equipmentName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rental.startDate).toLocaleDateString()} -{" "}
                    {new Date(rental.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(rental.totalAmount || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        rental.status
                      )}`}
                    >
                      {getStatusName(rental.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedRentalId(rental.rentalId);
                          setDetailModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {rental.status === "Pending" && (
                        <button
                          onClick={() => handleApproveClick(rental.rentalId)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve rental"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {(rental.status === "Pending" ||
                        rental.status === "Approved") && (
                        <button
                          onClick={() => handleCancelClick(rental.rentalId)}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel rental"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      {rental.status === "Active" && (
                        <button
                          onClick={() => handleCompleteClick(rental.rentalId)}
                          className="text-green-600 hover:text-green-900"
                          title="Complete rental"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {filteredRentals.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Approve/Complete Confirm Dialog */}
      <ConfirmDialog
        isOpen={actionDialogOpen}
        onClose={() => {
          setActionDialogOpen(false);
          setSelectedRentalId(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
        title={actionType === "approve" ? "Approve Rental" : "Complete Rental"}
        message={
          actionType === "approve"
            ? "Are you sure you want to approve this rental?"
            : "Are you sure you want to mark this rental as completed?"
        }
        confirmText={actionType === "approve" ? "Approve" : "Complete"}
        cancelText="Cancel"
        type={actionType === "approve" ? "info" : "success"}
      />

      {/* Cancel Dialog with Reason Input */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Rental
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancelling this rental:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
              autoFocus
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setCancelDialogOpen(false);
                  setSelectedRentalId(null);
                  setCancelReason("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <RentalDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRentalId(null);
        }}
        rentalId={selectedRentalId}
        onStatusUpdate={fetchRentals}
      />
    </div>
  );
};

export default RentalManagement;
