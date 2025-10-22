import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col items-center justify-center py-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          text-center py-16 w-full
          border-2 border-dashed border-gray-300 rounded-2xl 
          bg-gradient-to-br from-gray-50 to-white
        "
      >
        <div className="inline-flex p-6 bg-blue-50 rounded-full mb-6">
          <ShoppingCart size={48} className="text-[var(--primary-color)]" />
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
          onClick={() => navigate("/cameras")}
          className="btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
        >
          Bắt đầu thuê thiết bị
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
