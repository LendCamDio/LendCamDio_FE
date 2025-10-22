import { lazy, useEffect, useState } from "react";

const EmptyCart = lazy(() => import("@/components/cart/EmptyCart"));
const CartContent = lazy(() => import("@/components/cart/CartContent"));

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const mockCart: CartItem[] = [
  {
    name: "Camera Sony A7 III",
    category: "Mirrorless",
    image: "https://example.com/images/sony-a7-iii.jpg",
    price: 150000,
    quantity: 2,
  },
  {
    name: "Camera Canon EOS R5",
    category: "Mirrorless",
    image: "https://example.com/images/canon-eos-r5.jpg",
    price: 200000,
    quantity: 1,
  },
];

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>(mockCart);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

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
        <EmptyCart />
      ) : (
        // Cart content
        <CartContent cart={cart} />
      )}
    </div>
  );
};

export default Cart;
