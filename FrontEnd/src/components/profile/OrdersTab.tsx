import { motion } from "framer-motion";
import { Package } from "lucide-react";

export const OrdersTab = () => {
  return (
    <div>
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)] mb-1">
          Đơn hàng của tôi
        </h2>
        <p className="text-[var(--text-light)] text-sm">
          Theo dõi và quản lý đơn hàng của bạn
        </p>
      </div>

      {/* Order filters */}
      <div className="flex gap-3 mb-8 pb-2">
        {["Tất cả", "Đang xử lý", "Đã giao", "Đã hủy"].map((status, index) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap shadow-sm ${
              index === 0
                ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-blue-500/30"
                : "bg-white text-[var(--text-dark)] border-2 border-gray-200 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]"
            }`}
          >
            {status}
          </motion.button>
        ))}
      </div>

      {/* Orders list - Empty state */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="inline-flex p-6 bg-blue-50 rounded-full mb-6">
            <Package size={48} className="text-[var(--primary-color)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-3">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-[var(--text-light)] mb-8 max-w-md mx-auto">
            Bạn chưa có đơn hàng nào. Hãy khám phá và thuê thiết bị chụp ảnh
            chuyên nghiệp ngay!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Bắt đầu thuê thiết bị
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
