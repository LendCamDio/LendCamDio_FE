import { faCreditCard, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import CartModal from "./CartModal";

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const OrderSummary = ({
  cart,
  formatCurrency,
}: {
  cart: CartItem[];
  formatCurrency: (n: number) => string;
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 50000; // Desposited service fee
  const discount = 0;
  const finalTotal = subtotal + serviceFee - discount;

  const handlePayment = () => {
    if (!customer.name || !customer.phone) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }
    setShowPayment(true);
  };

  return (
    <>
      {/* Payment Modal */}
      {showPayment && (
        <CartModal
          setShowPayment={setShowPayment}
          customer={customer}
          cart={cart}
          formatCurrency={formatCurrency}
          finalTotal={finalTotal}
        />
      )}
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
        <h4 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h4>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí dịch vụ</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Giảm giá</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-blue-600">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Họ và tên *"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Số điện thoại *"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
          />
          <textarea
            placeholder="Ghi chú đơn hàng (tùy chọn)"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
            value={customer.note}
            onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
          />
        </div>

        <button
          onClick={handlePayment}
          className="
                  w-full bg-blue-600 text-white py-3 rounded-lg 
                  btn btn-primary hover:bg-blue-700 transition-colors 
                  flex justify-center items-center gap-2
                "
        >
          <FontAwesomeIcon icon={faCreditCard} />
          Thanh toán ngay
        </button>

        <div className="mt-4 text-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
          Thanh toán an toàn & bảo mật
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
