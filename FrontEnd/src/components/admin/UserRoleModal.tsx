import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, UserCog } from "lucide-react";
import api from "@/services/api";
import { USER_ENDPOINTS } from "@/constants/endpoints";
import { UserRole } from "@/types/entity.type";
import type { UserInfo } from "@/types/entity.type";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

type UserRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  onSuccess: () => void;
};

const UserRoleModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserRoleModalProps) => {
  const showToast = useUniqueToast();
  const [newRole, setNewRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [loading, setLoading] = useState(false);

  const roleOptions = Object.values(UserRole).filter(v => typeof v === 'number') as UserRole[];

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return "Admin";
      case UserRole.SUPPLIER: return "Supplier";
      case UserRole.CUSTOMER: return "Customer";
      default: return "Customer";
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      setNewRole(normalizeRole(user.role));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);

  const normalizeRole = (val?: unknown): UserRole => {
    if (val === undefined || val === null) return UserRole.CUSTOMER;
    if (typeof val === "number") {
      return val as UserRole;
    }
    // Handle string values from backend (if any)
    const s = String(val).toLowerCase();
    if (s === "admin") return UserRole.ADMIN;
    if (s === "supplier") return UserRole.SUPPLIER;
    return UserRole.CUSTOMER;
  };

  const handleRoleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await api.put(USER_ENDPOINTS.UPDATE_ROLE(user.userId), {
        role: newRole,
      });

      showToast("User role updated successfully.", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user role:", error);
      showToast("Failed to update user role.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-purple-600" />
            Change User Role
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Select a new role for <strong className="text-gray-900">{user.fullName}</strong>.
            <br />
            <span className="text-xs text-gray-500">
              This will update their permissions immediately.
            </span>
          </p>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <select
            value={newRole}
            onChange={(e) => setNewRole(Number(e.target.value) as UserRole)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            disabled={loading}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {getRoleLabel(role)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleRoleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-purple-500/30"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserRoleModal;
