/**
 * Cart Page - Product Cart (For Sale Items)
 * Ghi chú: Đây là giỏ hàng cho các sản phẩm BÁN (ForSale)
 * Không phải cho tiền thuê (ForRent)
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/cart/useCart";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/cart/useCart";
import { formatCurrency } from "@/utils/currencyFormatter";
import type { CartItemResponseDto } from "@/services/cart.service";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading, error: cartError } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logs
  console.log("Cart data:", cart);
  console.log("Cart loading:", cartLoading);
  console.log("Cart error:", cartError);

  // Show loading screen only if loading AND no cached data
  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await updateItem.mutateAsync({
        cartItemId,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Không thể cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await removeItem.mutateAsync(cartItemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Không thể xóa sản phẩm");
    }
  };

  const handleCheckout = () => {
    if (!cart?.cartItems || cart.cartItems.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    setIsSubmitting(true);
    navigate("/checkout", {
      state: {
        cartItems: cart.cartItems,
        totalAmount: cart.totalPrice,
      },
    });
  };

  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  // Skip error check - use cached data if available
  // if (cartError && !cart) {
  //   return <div>Error loading cart</div>
  // }

  if (!cart?.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-8">
            Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.cartItems.map((item: CartItemResponseDto) => (
              <div
                key={item.cartItemId}
                className="border rounded-lg p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.equipmentName}</h3>
                  <p className="text-gray-600">
                    Đơn giá: {formatCurrency(item.unitPrice)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity - 1
                        )
                      }
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.cartItemId,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 text-center border rounded"
                      min="1"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity + 1
                        )
                      }
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price and Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                  <div className="text-xl font-bold">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Số lượng:</span>
                <span className="font-semibold">{cart.totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {isSubmitting ? "Đang xử lý..." : "Thanh toán"}
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
