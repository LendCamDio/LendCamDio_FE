import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  );
};

export default CartModal;
