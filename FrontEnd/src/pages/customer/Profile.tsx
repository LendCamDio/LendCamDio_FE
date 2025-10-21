import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  ProfileSidebar,
  ProfileInfoTab,
  SecurityTab,
  OrdersTab,
  NotificationsTab,
} from "@/components/profile/index";

import {
  passwordSchema,
  profileSchema,
  type PasswordSchema,
  type ProfileSchema,
} from "@/utils/validations/ProfileScheme";
import { useUser } from "@/hooks/user/useUser";
import { useAuth } from "@/hooks/auth/useAuth";

const Profile = () => {
  const { user: userPayload } = useAuth();
  const { data } = useUser();
  const user = {
    ...data?.data,
    role: userPayload?.role,
  };
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "orders" | "notifications"
  >("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName?.split("@")[0] || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      bio: "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
  });

  // Handle profile update
  const onSubmitProfile = (data: ProfileSchema) => {
    console.log("Profile data:", data);
    toast.success("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  // Handle password change
  const onSubmitPassword = (data: PasswordSchema) => {
    console.log("Password change:", data);
    toast.success("Đổi mật khẩu thành công!");
    resetPassword();
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast.success("Tải ảnh đại diện thành công!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile();
    setAvatarPreview(null);
  };

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName?.split("@")[0] || "",
      });
    }
  }, [user]);

  return (
    <PageWrapper>
      <div className="min-page-height bg-[var(--bg-light)] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="section-title text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-3">
              Tài khoản của tôi
            </h1>
            <p className="text-[var(--text-light)] text-lg text-center">
              Quản lý thông tin cá nhân và cài đặt tài khoản
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              avatarPreview={avatarPreview}
              isEditing={isEditing}
              onAvatarChange={handleAvatarChange}
            />

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-9"
            >
              <div className="card bg-white rounded-lg shadow-custom p-6 md:p-8 border border-gray-100">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <ProfileInfoTab
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSubmit={handleSubmitProfile(onSubmitProfile)}
                    onCancel={handleCancelEdit}
                    register={registerProfile}
                    errors={profileErrors}
                  />
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <SecurityTab
                    onSubmit={handleSubmitPassword(onSubmitPassword)}
                    register={registerPassword}
                    errors={passwordErrors}
                  />
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && <OrdersTab />}

                {/* Notifications Tab */}
                {activeTab === "notifications" && <NotificationsTab />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
