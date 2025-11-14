// #region Imports
import {
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Package,
  Shield,
} from "lucide-react";
import type { Equipment } from "@/types/entity.type";
import {
  formatDate,
  getConditionLabel,
  getConditionColor,
} from "@/utils/equipmentHelpers";
import { formatCurrency } from "@/utils/currencyFormatter";

// #endregion

type Props = {
  equipment: Equipment;
  onEdit: (eq: Equipment) => void;
  onDelete: (id: string, name: string) => void;
};

const EquipmentCard = ({ equipment, onEdit, onDelete }: Props) => {
  return (
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
        {equipment && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-semibold">
              {equipment.rating ? equipment.rating.toFixed(1) : 0}
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
            {/* Status */}
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    equipment.status === 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {equipment.status === 0 ? "Active" : "Inactive"}
                </span>
              </div>
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
                {equipment.insuranceRequired ? "Required" : "Not Required"}
              </span>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b">
            <Eye className="w-4 h-4" />
            <span className="truncate">
              {equipment.supplierName === "None" ||
              equipment.supplierId === "00000000-0000-0000-0000-000000000000"
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
            onClick={() => onEdit(equipment)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(equipment.equipmentId, equipment.name)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
