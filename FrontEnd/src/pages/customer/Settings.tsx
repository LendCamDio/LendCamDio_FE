import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  Bell,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Palette,
  Shield,
  CheckCircle2,
} from "lucide-react";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  newsletter: z.boolean(),
  language: z.string(),
  theme: z.enum(["light", "dark", "auto"]),
  twoFactorAuth: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "notifications" | "privacy" | "preferences"
  >("notifications");

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotions: false,
      newsletter: false,
      language: "vi",
      theme: "light",
      twoFactorAuth: false,
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    console.log("Settings:", data);
    localStorage.setItem("userSettings", JSON.stringify(data));
    toast.success("Đã lưu cài đặt thành công!");
  };

  const tabs = [
    {
      id: "notifications",
      label: "Thông báo",
      icon: Bell,
    },
    {
      id: "privacy",
      label: "Bảo mật",
      icon: Shield,
    },
    {
      id: "preferences",
      label: "Tùy chọn",
      icon: Palette,
    },
  ];

  return (
    <PageWrapper>
      <div className="min-page-height bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cài đặt</h1>
            <p className="text-gray-600">
              Quản lý thông báo, bảo mật và tùy chọn của bạn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setActiveTab(
                            tab.id as
                              | "notifications"
                              | "privacy"
                              | "preferences"
                          )
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">
                          Cài đặt thông báo
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">
                                Thông báo qua Email
                              </p>
                              <p className="text-sm text-gray-500">
                                Nhận thông báo qua email
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("emailNotifications")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Push Notifications */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">Thông báo đẩy</p>
                              <p className="text-sm text-gray-500">
                                Nhận thông báo trên trình duyệt
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("pushNotifications")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Order Updates */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">Cập nhật đơn hàng</p>
                              <p className="text-sm text-gray-500">
                                Thông báo về trạng thái đơn hàng
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("orderUpdates")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Promotions */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">
                                Khuyến mãi & Ưu đãi
                              </p>
                              <p className="text-sm text-gray-500">
                                Nhận thông báo về chương trình khuyến mãi
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("promotions")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Newsletter */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">Bản tin</p>
                              <p className="text-sm text-gray-500">
                                Nhận bản tin và tin tức mới nhất
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("newsletter")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Tab */}
                  {activeTab === "privacy" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">
                          Bảo mật & Quyền riêng tư
                        </h2>
                      </div>

                      {/* Two-Factor Auth */}
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-semibold">
                                Xác thực hai yếu tố (2FA)
                              </p>
                              <p className="text-sm text-gray-500">
                                Tăng cường bảo mật tài khoản của bạn
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register("twoFactorAuth")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        {watch("twoFactorAuth") && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              Xác thực hai yếu tố đã được bật. Bạn sẽ cần nhập
                              mã xác thực khi đăng nhập.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Change Password */}
                      <div className="border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4">
                          Đổi mật khẩu
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mật khẩu hiện tại
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mật khẩu hiện tại"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mật khẩu mới
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập mật khẩu mới"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Xác nhận mật khẩu mới
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập lại mật khẩu mới"
                            />
                          </div>
                          <button
                            type="button"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={() =>
                              toast.success("Đổi mật khẩu thành công!")
                            }
                          >
                            Cập nhật mật khẩu
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Palette className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">
                          Tùy chọn hiển thị
                        </h2>
                      </div>

                      {/* Language */}
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Globe className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-semibold">Ngôn ngữ</p>
                            <p className="text-sm text-gray-500">
                              Chọn ngôn ngữ hiển thị
                            </p>
                          </div>
                        </div>
                        <select
                          {...register("language")}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>

                      {/* Theme */}
                      <div className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Palette className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-semibold">Giao diện</p>
                            <p className="text-sm text-gray-500">
                              Chọn chủ đề hiển thị
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {["light", "dark", "auto"].map((theme) => (
                            <label
                              key={theme}
                              className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                watch("theme") === theme
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                value={theme}
                                {...register("theme")}
                                className="sr-only"
                              />
                              <div
                                className={`w-12 h-12 rounded-lg mb-2 ${
                                  theme === "light"
                                    ? "bg-white border-2 border-gray-300"
                                    : theme === "dark"
                                    ? "bg-gray-900"
                                    : "bg-gradient-to-br from-white to-gray-900"
                                }`}
                              />
                              <span className="capitalize font-medium">
                                {theme === "light"
                                  ? "Sáng"
                                  : theme === "dark"
                                  ? "Tối"
                                  : "Tự động"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {isDirty && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end gap-4 pt-4 border-t"
                    >
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Lưu thay đổi
                      </button>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
