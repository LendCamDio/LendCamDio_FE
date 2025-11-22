import { lazy, useEffect, useState } from "react";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { ConfirmDialog } from "@/components/ui/Dialog";
import type { Equipment } from "@/types/entity.type";
import {
  useAllEquipmentList,
  useDeleteEquipment,
} from "@/hooks/equipment/useEquipmentAdmin";
import { useAuth } from "@/hooks/auth/useAuth";

const EquipmentFilters = lazy(() => import("../equipments/EquipmentFilters"));
const EquipmentEmptyState = lazy(
  () => import("../equipments/EquipmentEmptyState")
);
const EquipmentCard = lazy(() => import("../equipments/EquipmentCard"));
const EquipmentPagination = lazy(
  () => import("../equipments/EquipmentPagination")
);
const EquipmentFormModal = lazy(
  () => import("@/components/admin/EquipmentFormModal")
);

const Loading = lazy(() => import("@/components/common/Loading/LoadingCircle"));

const EquipmentManagement = () => {
  const { user } = useAuth();
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

  // Confirm dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch categories for filter dropdown

  // Use hook to fetch equipments (for ADMIN - all equipments)
  const {
    data: equipmentData,
    isLoading: loading,
    error,
  } = useAllEquipmentList(
    currentPage,
    pageSize,
    filterCategory,
    searchTerm,
    user?.role === "Supplier" ? user.id : undefined
  );

  const equipments = equipmentData?.data?.items || [];
  const totalPages = equipmentData?.data?.pages || 1;
  const totalCount = equipmentData?.data?.total || 0;

  // Use mutation hooks for CRUD operations
  const deleteMutation = useDeleteEquipment();

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
      const errorMessage =
        error.response?.data?.message || "Failed to delete equipment";
      showToast(errorMessage, "error");
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

  // Handler for successful create/update from modal
  const handleSuccess = () => {
    setIsModalOpen(false);
    // Hook will automatically refetch via invalidateQueries
    showToast(
      `Equipment ${
        modalMode === "create" ? "created" : "updated"
      } successfully!`,
      "success"
    );
  };

  if (loading) {
    return <Loading />;
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
      <EquipmentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        handleOpenCreate={handleOpenCreate}
      />

      {/* Equipment Grid */}
      {equipments.length === 0 ? (
        <EquipmentEmptyState
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          handleOpenCreate={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <EquipmentCard
              key={equipment.equipmentId}
              equipment={equipment}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <EquipmentPagination
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        equipments={equipments}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onClickPage={(page: number) => setCurrentPage(page)}
      />

      {/* Equipment Form Modal */}
      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
