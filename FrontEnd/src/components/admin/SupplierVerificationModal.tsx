import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import api from "@/services/api";
import { SUPPLIER_ENDPOINTS } from "@/constants/endpoints";
import { VerificationStatus } from "@/types/entity.type";
import type { SupplierDto } from "@/types/entity.type";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

interface SupplierVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onSuccess?: () => void;
}

const SupplierVerificationModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: SupplierVerificationModalProps) => {
  const [supplier, setSupplier] = useState<SupplierDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const showToast = useUniqueToast();

  useEffect(() => {
    if (isOpen && userId) {
      fetchSupplierData();
    } else {
      setSupplier(null);
    }
  }, [isOpen, userId]);

  const fetchSupplierData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await api.get(SUPPLIER_ENDPOINTS.BY_USER_ID(userId));
      const supplierData = response.data?.data;
      
      if (supplierData) {
        setSupplier(supplierData);
      } else {
        showToast("Supplier data not found", "error");
        onClose();
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      showToast("Failed to load supplier data", "error");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVerification = async (status: VerificationStatus) => {
    if (!supplier) return;

    try {
      setUpdating(true);
      await api.patch(SUPPLIER_ENDPOINTS.UPDATE_VERIFICATION(supplier.supplierId), {
        status,
      });

      showToast(
        `Supplier ${getVerificationStatusLabel(status).toLowerCase()} successfully`,
        "success"
      );
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error updating supplier verification:", error);
      showToast("Failed to update verification status", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getVerificationStatusLabel = (status: VerificationStatus): string => {
    switch (status) {
      case VerificationStatus.Pending:
        return "Pending";
      case VerificationStatus.Verified:
        return "Verified";
      case VerificationStatus.Rejected:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getVerificationStatusColor = (status: VerificationStatus): string => {
    switch (status) {
      case VerificationStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      case VerificationStatus.Verified:
        return "bg-green-100 text-green-800";
      case VerificationStatus.Rejected:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Supplier Verification
          </h2>
          <button
            onClick={onClose}
            disabled={updating}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : supplier ? (
            <div className="space-y-6">
              {/* Supplier Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company Name
                  </label>
                  <p className="mt-1 text-gray-900">{supplier.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Name
                  </label>
                  <p className="mt-1 text-gray-900">{supplier.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{supplier.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="mt-1 text-gray-900">
                    {supplier.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="mt-1 text-gray-900">
                    {supplier.address || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Equipment Count
                  </label>
                  <p className="mt-1 text-gray-900">{supplier.equipmentCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Rating
                  </label>
                  <p className="mt-1 text-gray-900">
                    {supplier.rating.toFixed(1)} / 5.0
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Current Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getVerificationStatusColor(
                        supplier.verificationStatus
                      )}`}
                    >
                      {getVerificationStatusLabel(supplier.verificationStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Verification Status
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      handleUpdateVerification(VerificationStatus.Verified)
                    }
                    disabled={
                      updating ||
                      supplier.verificationStatus === VerificationStatus.Verified
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Verify Supplier
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateVerification(VerificationStatus.Rejected)
                    }
                    disabled={
                      updating ||
                      supplier.verificationStatus === VerificationStatus.Rejected
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Supplier
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateVerification(VerificationStatus.Pending)
                    }
                    disabled={
                      updating ||
                      supplier.verificationStatus === VerificationStatus.Pending
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Clock className="w-5 h-5" />
                    Set as Pending
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No supplier data available
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={updating}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierVerificationModal;
