import { motion } from "framer-motion";
import { Package, Bell, Mail, Camera } from "lucide-react";

export const NotificationsTab = () => {
  const notificationSettings = [
    {
      title: "Thông báo đơn hàng",
      description: "Nhận thông báo về trạng thái đơn hàng của bạn",
      icon: Package,
    },
    {
      title: "Khuyến mãi và ưu đãi",
      description: "Nhận thông báo về các chương trình khuyến mãi mới",
      icon: Bell,
    },
    {
      title: "Tin nhắn",
      description: "Nhận thông báo khi có tin nhắn mới từ người bán",
      icon: Mail,
    },
    {
      title: "Cập nhật sản phẩm",
      description: "Nhận thông báo về sản phẩm mới và cập nhật",
      icon: Camera,
    },
  ];

  return (
    <div>
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-1">
          Cài đặt thông báo
        </h2>
        <p className="text-[var(--text-light)] text-sm">
          Tùy chỉnh các thông báo bạn muốn nhận
        </p>
      </div>

      <div className="space-y-4">
        {notificationSettings.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-[var(--primary-color)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <item.icon size={24} className="text-[var(--primary-color)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-dark)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-light)]">
                  {item.description}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={index % 2 === 0}
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-color)] peer-checked:to-[var(--secondary-color)] shadow-inner"></div>
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
