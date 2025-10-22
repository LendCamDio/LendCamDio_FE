import { faRightToBracket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartCard = lazy(() => import("./CartCard"));

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const CartItemsCard = ({
  cart,
  formatCurrency,
}: {
  cart: CartItem[];
  formatCurrency: (n: number) => string;
}) => {
  const navigate = useNavigate();

  const [carts, setCart] = useState<CartItem[]>(cart);

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="cart-items-container flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          Sản phẩm đã chọn ({cart.length})
        </h3>
        <button
          onClick={clearCart}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Xóa tất cả
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {carts.map((item, index) => (
          <CartCard
            index={index}
            item={item}
            formatCurrency={formatCurrency}
            updateQuantity={(index, qty) => updateQuantity(index, qty)}
            removeItem={(index) => removeItem(index)}
          />
        ))}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate("/cameras")}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          Tiếp tục thuê thiết bị{" "}
          <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CartItemsCard;
