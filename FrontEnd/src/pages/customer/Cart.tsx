import { motion } from "framer-motion";
import {
  faCreditCard,
  faShieldAlt,
  faTrash,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    const updated = [...cart];
    updated[index].quantity = quantity;
    updateCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 50000;
  const discount = 0;
  const finalTotal = subtotal + serviceFee - discount;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(n);

  const handlePayment = () => {
    if (!customer.name || !customer.phone) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="text-5xl font-bold mb-4 relative z-10">
              Giỏ hàng của bạn
            </h1>
            <p className="text-xl mb-8 opacity-95 relative z-10">
              Xem lại và thanh toán các sản phẩm đã chọn
            </p>
          </div>
        </div>
      </section>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
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
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-6">
              Sản phẩm trong giỏ hàng ({cart.length})
            </h3>
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-500">{item.category}</p>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(item.price)}/ngày
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              <button
                onClick={clearCart}
                className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faTrash} className="inline mr-2" />
                Xóa tất cả
              </button>
              <a
                onClick={() => navigate("/cameras")}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
              >
                Tiếp tục mua sắm
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h4>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí dịch vụ:</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <h4 className="text-lg font-semibold mt-6 mb-3">
              Thông tin khách hàng
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên *"
                className="w-full border px-3 py-2 rounded"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                className="w-full border px-3 py-2 rounded"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
              <textarea
                placeholder="Ghi chú (tuỳ chọn)"
                rows={3}
                className="w-full border px-3 py-2 rounded"
                value={customer.note}
                onChange={(e) =>
                  setCustomer({ ...customer, note: e.target.value })
                }
              />
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 bg-blue-600 w-full text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faCreditCard} className="inline mr-2" />
              Thanh toán
            </button>

            <div className="text-center mt-3 text-gray-500 text-sm">
              <FontAwesomeIcon icon={faShieldAlt} className="inline mr-1" />
              Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowPayment(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Xác nhận thanh toán</h3>
            <p className="text-gray-600 mb-3">
              Cảm ơn {customer.name}! Vui lòng xác nhận để hoàn tất đơn hàng.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p>
                <strong>Tổng cộng:</strong> {formatCurrency(finalTotal)}
              </p>
              <p>
                <strong>Sản phẩm:</strong> {cart.length}
              </p>
            </div>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={() => {
                alert("Thanh toán thành công!");
                localStorage.removeItem("cart");
                setShowPayment(false);
                window.location.href = "/order-tracking";
              }}
            >
              <FontAwesomeIcon icon={faTruck} className="inline mr-2" />
              Xác nhận & Theo dõi đơn hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
