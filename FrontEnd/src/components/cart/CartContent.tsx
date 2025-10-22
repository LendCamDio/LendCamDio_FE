import { lazy } from "react";

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
    <div className="container grid lg:grid-cols-3 gap-8">
      {/* Cart Items Section */}
      <div className="lg:col-span-2">
        <CartItemsCard cart={cart} formatCurrency={formatCurrency} />
      </div>
      {/* Order Summary Section */}
      <div className="lg:col-span-1">
        <OrderSummary cart={cart} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
};

export default CartContent;
