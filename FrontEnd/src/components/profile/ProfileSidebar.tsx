import { motion } from "framer-motion";
import { User, Shield, Bell, Package, Camera } from "lucide-react";

interface ProfileSidebarProps {
  user: {
    email?: string;
    fullName?: string;
    role?: string;
  } | null;
  activeTab: "profile" | "security" | "orders" | "notifications";
  setActiveTab: (
    tab: "profile" | "security" | "orders" | "notifications"
  ) => void;
  avatarPreview: string | null;
  isEditing: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileSidebar = ({
  user,
  activeTab,
  setActiveTab,
  avatarPreview,
  isEditing,
  onAvatarChange,
}: ProfileSidebarProps) => {
  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "orders", label: "Đơn hàng", icon: Package },
    { id: "notifications", label: "Thông báo", icon: Bell },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-3"
    >
      <div className="card bg-white rounded-lg shadow-custom p-6 border border-gray-100">
        {/* User Avatar and Info */}
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] p-1 shadow-glow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-[var(--text-light)]" />
                )}
              </div>
            </div>
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-[var(--primary-color)] text-white p-2.5 rounded-full cursor-pointer hover:bg-[var(--secondary-color)] transition-all duration-300 shadow-lg hover:shadow-glow"
              >
                <Camera size={18} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </label>
            )}
          </div>
          <h3 className="mt-4 text-xl font-bold text-[var(--text-dark)]">
            {user?.fullName || user?.email?.split("@")[0] || "Người dùng"}
          </h3>
          <p className="text-sm text-[var(--text-light)] mt-1 px-3 py-1 bg-[var(--bg-light)] rounded-full">
            {user?.role || "Khách hàng"}
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-lg shadow-blue-500/30"
                  : "text-[var(--text-dark)] hover:bg-[var(--bg-light)] hover:shadow-md"
              }`}
            >
              <tab.icon size={20} />
              <span className="font-semibold">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
