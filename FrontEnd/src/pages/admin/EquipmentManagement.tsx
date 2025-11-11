import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Package,
  DollarSign,
  Shield,
  Calendar,
} from "lucide-react";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { ConfirmDialog } from "@/components/ui/Dialog";
import type { Equipment } from "@/types/entity.type";
// import { EquipmentStatus } from "@/types/entity.type";
import EquipmentFormModal, {
  type EquipmentFormData,
} from "@/components/admin/EquipmentFormModal";
import { useActiveEquipCategories } from "@/hooks/equipment/useEquipCategory";
import {
  useAllEquipmentList,
  useDeleteEquipment,
  useUpdateEquipment,
} from "@/hooks/equipment/useEquipmentAdmin";
import { formatCurrency } from "@/utils/currencyFormatter";

const EquipmentManagement = () => {
  const showToast = useUniqueToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  // const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  // Confirm dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useActiveEquipCategories();
  const categories = categoriesData?.data?.items || [];

  // Use hook to fetch equipments (for ADMIN - all equipments)
  const {
    data: equipmentData,
    isLoading: loading,
    error,
  } = useAllEquipmentList(currentPage, pageSize);

  const equipments = equipmentData?.data?.items || [];
  const totalPages = equipmentData?.data?.pages || 1;
  const totalCount = equipmentData?.data?.total || 0;

  // Use mutation hooks for CRUD operations
  const deleteMutation = useDeleteEquipment();
  const updateMutation = useUpdateEquipment();

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, filterCategory]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      console.error("❌ Error fetching equipments:", error);
      showToast("Failed to load equipments", "error");
    }
  }, [error]);

  const handleDeleteClick = (id: string, name: string) => {
    setEquipmentToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!equipmentToDelete) return;

    const { id, name } = equipmentToDelete;

    try {
      console.log("🗑️ Deleting equipment:", id);

      const response = await deleteMutation.mutateAsync(id);

      console.log("✅ Delete response:", response);

      if (response.success) {
        showToast(
          `Equipment "${name}" has been deleted (marked as Inactive)`,
          "success",
          { duration: 3000 }
        );
        // Hook will automatically refetch via invalidateQueries
      } else {
        showToast("Failed to delete equipment", "error");
      }
    } catch (error: any) {
      console.error("❌ Error deleting equipment:", error);
      console.error("Error response:", error.response?.data);

      // Check for specific error types
      if (error.response?.status === 401) {
        showToast(
          "Unauthorized. Please login again to perform this action.",
          "error",
          { duration: 4000 }
        );
      } else if (error.response?.status === 403) {
        showToast(
          "Permission Denied. You don't have permission to delete equipment.",
          "error",
          { duration: 4000 }
        );
      } else if (error.response?.status === 404) {
        showToast(
          "Equipment not found. It may have been already deleted.",
          "error"
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to delete equipment. Please try again.";
        showToast(errorMessage, "error", { duration: 3000 });
      }
    } finally {
      setEquipmentToDelete(null);
    }
  };
  const handleOpenCreate = () => {
    setSelectedEquipment(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: EquipmentFormData) => {
    try {
      // For edit mode only - create mode is handled inside modal
      if (modalMode === "edit" && selectedEquipment) {
        // Prepare data to match backend DTO
        const payload = {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          supplierId: data.supplierId || null,
          stockQuantity: data.stockQuantity,
          dailyPrice: data.dailyPrice || null,
          price: data.price || null,
          depositAmount: data.depositAmount,
          insuranceRequired: data.insuranceRequired,
          condition:
            typeof data.condition === "string"
              ? parseInt(data.condition)
              : data.condition,
          availability: data.availability ?? true,
        };

        const response = await updateMutation.mutateAsync({
          id: selectedEquipment.equipmentId,
          data: payload,
        });

        if (response.success) {
          showToast("Equipment updated successfully!", "success");
          setIsModalOpen(false);
          // Hook will automatically refetch via invalidateQueries
        }
      }
    } catch (error: any) {
      console.error("Error saving equipment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save equipment";
      showToast(errorMessage, "error");
      throw error;
    }
  };

  // Handler for successful create/update from modal
  const handleSuccess = () => {
    // Hook will automatically refetch via invalidateQueries
    // No need to call refetch() manually
  };

  // Helper functions
  const getConditionLabel = (condition: number) => {
    const labels = ["New", "Good", "Used", "Damaged"];
    return labels[condition] || "Unknown";
  };

  const getConditionColor = (condition: number) => {
    const colors = [
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    return colors[condition] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredEquipments = equipments.filter((equipment) => {
    // UnComment nếu cần lọc bỏ thiết bị đã xóa (trạng thái Inactive)
    // // Filter out deleted (Inactive status) equipment
    // if (equipment.status === EquipmentStatus.Inactive) {
    //   return false;
    // }

    const matchesSearch = equipment.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || equipment.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Equipment Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all your photography equipment
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      {filteredEquipments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            No Equipment Found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCategory !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by adding your first equipment."}
          </p>
          {!searchTerm && filterCategory === "all" && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Equipment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment) => (
            <div
              key={equipment.equipmentId}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={equipment.imageUrl || "/placeholder.jpg"}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                      equipment.availability
                        ? "bg-green-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {equipment.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
                {equipment.rating && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold">
                      {equipment.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Title and Category */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {equipment.name}
                  </h3>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {equipment.categoryName}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                  {equipment.description || "No description available"}
                </p>

                {/* Info Grid - Will grow to fill space */}
                <div className="flex-grow">
                  <div className="space-y-2 mb-4">
                    {/* Pricing - Show both if available */}
                    {equipment.dailyPrice && equipment.dailyPrice > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          Daily Rent:
                        </span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(equipment.dailyPrice)}
                        </span>
                      </div>
                    )}

                    {equipment.price && equipment.price > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          Purchase:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(equipment.price)}
                        </span>
                      </div>
                    )}

                    {/* Deposit */}
                    {equipment.depositAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                          <Shield className="w-4 h-4" />
                          Deposit:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(equipment.depositAmount)}
                        </span>
                      </div>
                    )}

                    {/* Stock */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        Stock:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {equipment.stockQuantity} units
                      </span>
                    </div>

                    {/* Condition */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Condition:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(
                          equipment.condition
                        )}`}
                      >
                        {getConditionLabel(equipment.condition)}
                      </span>
                    </div>

                    {/* Insurance */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Insurance:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          equipment.insuranceRequired
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {equipment.insuranceRequired
                          ? "Required"
                          : "Not Required"}
                      </span>
                    </div>
                  </div>

                  {/* Supplier Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                    <Eye className="w-4 h-4" />
                    <span className="truncate">
                      {equipment.supplierName === "None" ||
                      equipment.supplierId ===
                        "00000000-0000-0000-0000-000000000000"
                        ? "LendCamDio (Default)"
                        : equipment.supplierName}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {formatDate(equipment.createdAt)}</span>
                    </div>
                    {equipment.updatedAt && (
                      <span className="text-gray-400">
                        Updated: {formatDate(equipment.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions - Always at bottom */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenEdit(equipment)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(equipment.equipmentId, equipment.name)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredEquipments.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-semibold">{totalCount}</span> results
              {(searchTerm || filterCategory !== "all") && (
                <span className="text-gray-500">
                  {" "}
                  (filtered from {equipments.length} in this page)
                </span>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Form Modal */}
      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        equipment={selectedEquipment}
        mode={modalMode}
        onSuccess={handleSuccess}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setEquipmentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${equipmentToDelete?.name}"?\n\nThis will mark the equipment as Inactive (soft delete).\nThe equipment will be hidden from the active list but data is preserved.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default EquipmentManagement;
