import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
} from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormField } from "@/components/ui/Form/FormField";
import type { ProfileSchema } from "@/utils/validations/ProfileScheme";

interface ProfileInfoTabProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  register: UseFormRegister<ProfileSchema>;
  errors: FieldErrors<ProfileSchema>;
}

export const ProfileInfoTab = ({
  isEditing,
  setIsEditing,
  onSubmit,
  onCancel,
  register,
  errors,
}: ProfileInfoTabProps) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b-2 border-gray-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-1">
            Thông tin cá nhân
          </h2>
          <p className="text-[var(--text-light)] text-sm">
            Cập nhật thông tin và quản lý tài khoản của bạn
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Edit2 size={18} />
            <span>Chỉnh sửa</span>
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--success-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <Save size={18} />
              <span>Lưu</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--text-light)] text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              <X size={18} />
              <span>Hủy</span>
            </motion.button>
          </div>
        )}
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField label="Họ và tên" error={errors.fullName}>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
                size={20}
              />
              <input
                {...register("fullName")}
                disabled={!isEditing}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
              />
            </div>
          </FormField>

          {/* Email */}
          <FormField label="Email" error={errors.email}>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
                size={20}
              />
              <input
                {...register("email")}
                disabled={!isEditing}
                type="email"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
              />
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField label="Số điện thoại" error={errors.phoneNumber}>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
                size={20}
              />
              <input
                {...register("phoneNumber")}
                disabled={!isEditing}
                type="tel"
                placeholder="0123456789"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
              />
            </div>
          </FormField>

          {/* Date of Birth */}
          <FormField label="Ngày sinh" error={errors.dateOfBirth}>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"
                size={20}
              />
              <input
                {...register("dateOfBirth")}
                disabled={!isEditing}
                type="date"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
              />
            </div>
          </FormField>
        </div>

        {/* Address */}
        <FormField label="Địa chỉ" error={errors.address}>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3 text-[var(--text-light)]"
              size={20}
            />
            <input
              {...register("address")}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ của bạn"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
            />
          </div>
        </FormField>

        {/* Bio */}
        <FormField label="Tiểu sử" error={errors.bio}>
          <textarea
            {...register("bio")}
            disabled={!isEditing}
            rows={4}
            placeholder="Giới thiệu về bản thân..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] disabled:bg-gray-50 disabled:text-[var(--text-light)] disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] resize-none transition-all duration-300"
          />
        </FormField>
      </form>
    </div>
  );
};
