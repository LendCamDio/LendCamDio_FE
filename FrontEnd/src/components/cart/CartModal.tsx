import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Package,
  CreditCard,
  ShoppingBag,
  User,
} from "lucide-react";

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const CartModal = ({
  setShowPayment,
  customer,
  cart,
  formatCurrency,
  finalTotal,
}: {
  setShowPayment: (show: boolean) => void;
  customer: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
  cart: CartItem[];
  formatCurrency: (n: number) => string;
  finalTotal: number;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={() => setShowPayment(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setShowPayment(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Xác nhận thanh toán</h3>
                <p className="text-blue-100">
                  Vui lòng kiểm tra lại thông tin đơn hàng
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">
                  Thông tin khách hàng
                </h4>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Họ tên:</span>{" "}
                  <span className="text-gray-900">{customer.name}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Điện thoại:</span>{" "}
                  <span className="text-gray-900">{customer.phone}</span>
                </p>
                {customer.email && (
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    <span className="text-gray-900">{customer.email}</span>
                  </p>
                )}
                {customer.note && (
                  <p className="text-gray-700">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    <span className="text-gray-900">{customer.note}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">
                  Chi tiết đơn hàng
                </h4>
              </div>
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng sản phẩm:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="font-bold text-gray-900">
                    Tổng thanh toán:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-yellow-900 mb-1">
                    Lưu ý thanh toán
                  </p>
                  <p className="text-sm text-yellow-800">
                    Sau khi xác nhận, đơn hàng của bạn sẽ được xử lý trong vòng
                    24h. Vui lòng kiểm tra email để nhận thông tin chi tiết.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                onClick={() => setShowPayment(false)}
              >
                Hủy bỏ
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
                onClick={() => {
                  alert("Thanh toán thành công! 🎉");
                  localStorage.removeItem("cart");
                  setShowPayment(false);
                  window.location.href = "/customer/order-tracking";
                }}
              >
                <FontAwesomeIcon icon={faTruck} />
                Xác nhận thanh toán
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartModal;
