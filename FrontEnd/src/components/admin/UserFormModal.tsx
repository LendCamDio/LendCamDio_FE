import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { UserRole } from "@/types/entity.type";
import type { UserInfo } from "@/types/entity.type";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormSubmitPayload) => Promise<void>;
  user?: UserInfo | null;
  mode: "edit";
}

export interface UserFormData {
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
  confirmPassword?: string;
}

export type UserFormSubmitPayload = Omit<UserFormData, "confirmPassword">;

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: UserFormModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || "",
    phone: user?.phone || "",
    role: typeof user?.role === 'string' ? parseInt(user.role) as UserRole : (user?.role ?? UserRole.CUSTOMER),
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.classList.add("modal-open");
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );

      return () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("--scrollbar-width");
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: user?.email || "",
        phone: user?.phone || "",
        role: typeof user?.role === 'string' ? parseInt(user.role) as UserRole : (user?.role ?? UserRole.CUSTOMER),
        password: "",
        confirmPassword: "",
      });
      setError(null);
    }
  }, [isOpen, user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password and confirmation do not match");
      return;
    }

    setLoading(true);
    try {
      const payload: UserFormSubmitPayload = {
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await onSubmit(payload);
      onClose();
    } catch (submitError) {
      console.error("Error submitting form:", submitError);
      setError("Unable to update user right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: parseInt(e.target.value) as UserRole })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={UserRole.CUSTOMER}>{UserRole.CUSTOMER}</option>
                <option value={UserRole.SUPPLIER}>{UserRole.SUPPLIER}</option>
                <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
              </select>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formData.password ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use portal to render modal at document.body level
  return createPortal(modalContent, document.body);
};

export default UserFormModal;
