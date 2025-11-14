import { Plus, Package } from "lucide-react";

const EquipmentEmptyState = ({
  searchTerm,
  filterCategory,
  handleOpenCreate,
}: Props) => {
  return (
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
  );
};

type Props = {
  searchTerm: string;
  filterCategory: string;
  handleOpenCreate: () => void;
};

export default EquipmentEmptyState;
