import { faCreditCard, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CartModal from "./CartModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cartService } from "@/services/cartService";
import { orderService, type CreateOrderRequest } from "@/services/orderService";

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
  onCartUpdate,
}: {
  cart: CartItem[];
  formatCurrency: (n: number) => string;
  onCartUpdate?: () => void;
}) => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const serviceFee = 50000; // Service fee
  const discount = 0;
  const finalTotal = subtotal + serviceFee - discount;

  const handlePayment = async () => {
    // Validation
    if (!customer.name || !customer.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order request
      const orderData: CreateOrderRequest = {
        shippingAddress: customer.name, // You should have a proper address field
        note: customer.note,
        paymentMethod: "Cash", // Default payment method
      };

      // Create order
      const order = await orderService.createOrder(orderData);

      toast.success("Đơn hàng đã được tạo thành công!");

      // Clear cart after successful order
      await cartService.clearCart();

      // Navigate to order tracking
      navigate(`/customer/order-tracking`);

      // Call callback if provided
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng!"
      );
    } finally {
      setIsProcessing(false);
    }
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

      <div className="sticky top-4">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Tóm tắt đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Price Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Tạm tính
                </span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Phí dịch vụ
                </span>
                <span className="font-semibold">
                  {formatCurrency(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Giảm giá
                </span>
                <span className="font-semibold">
                  -{formatCurrency(discount)}
                </span>
              </div>

              <Separator className="my-2" />

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
              >
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(finalTotal)}
                </span>
              </motion.div>
            </div>

            <Separator className="my-6" />

            {/* Customer Information */}
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Thông tin khách hàng
              </h4>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Số điện thoại *"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email (không bắt buộc)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  placeholder="Ghi chú đơn hàng (không bắt buộc)"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  value={customer.note}
                  onChange={(e) =>
                    setCustomer({ ...customer, note: e.target.value })
                  }
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing || cart.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
                  Tạo đơn hàng
                </>
              )}
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Thanh toán an toàn & bảo mật 100%
              </span>
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
              <div className="flex flex-col items-center p-2">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-blue-600 mb-1"
                />
                <span>Bảo mật SSL</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <ShieldCheck className="w-4 h-4 text-green-600 mb-1" />
                <span>Uy tín cao</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <Sparkles className="w-4 h-4 text-yellow-600 mb-1" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrderSummary;
