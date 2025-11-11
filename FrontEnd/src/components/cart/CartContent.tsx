import { lazy } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";

const CartItemsCard = lazy(() => import("./CartItemsCard"));
const OrderSummary = lazy(() => import("./OrderSummary"));

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const CartContent = ({ cart }: { cart: CartItem[] }) => {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Sản phẩm</p>
              <p className="text-2xl font-bold text-blue-900">{cart.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Số lượng</p>
              <p className="text-2xl font-bold text-green-900">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">₫</span>
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Tổng tiền</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(
                  cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <CartItemsCard cart={cart} formatCurrency={formatCurrency} />
        </motion.div>
        {/* Order Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <OrderSummary cart={cart} formatCurrency={formatCurrency} />
        </motion.div>
      </div>
    </div>
  );
};

export default CartContent;
