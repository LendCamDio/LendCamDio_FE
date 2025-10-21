import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/Form/FormField";
import type { PasswordSchema } from "@/utils/validations/ProfileScheme";

interface SecurityTabProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<PasswordSchema>;
  errors: FieldErrors<PasswordSchema>;
}

export const SecurityTab = ({
  onSubmit,
  register,
  errors,
}: SecurityTabProps) => {
  return (
    <div>
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-1">
          Bảo mật
        </h2>
        <p className="text-[var(--text-light)] text-sm">
          Quản lý mật khẩu và cài đặt bảo mật
        </p>
      </div>

      {/* Change Password Form */}
      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <FormField label="Mật khẩu hiện tại" error={errors.currentPassword}>
          <input
            {...register("currentPassword")}
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
          />
        </FormField>

        <FormField label="Mật khẩu mới" error={errors.newPassword}>
          <input
            {...register("newPassword")}
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
          />
        </FormField>

        <FormField label="Xác nhận mật khẩu mới" error={errors.confirmPassword}>
          <input
            {...register("confirmPassword")}
            type="password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
          />
        </FormField>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          <Shield size={18} />
          <span>Đổi mật khẩu</span>
        </motion.button>
      </form>

      {/* Two-Factor Authentication */}
      <div className="mt-10 pt-8 border-t-2 border-gray-100">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Shield className="text-[var(--primary-color)]" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">
                Xác thực hai yếu tố
              </h3>
              <p className="text-[var(--text-light)] mb-4">
                Tăng cường bảo mật cho tài khoản của bạn bằng cách bật xác thực
                hai yếu tố
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[var(--success-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Bật xác thực hai yếu tố
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
