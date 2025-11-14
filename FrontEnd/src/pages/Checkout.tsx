/**
 * Checkout Page - Trang thanh toán đơn hàng
 * Luồng: Nhập thông tin giao hàng -> Chọn phương thức thanh toán -> Thanh toán
 */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompleteCheckoutFlow, shouldRedirectToPayOS } from "@/hooks/checkout/useCompleteCheckout";
import { formatCurrency } from "@/utils/currencyFormatter";
import { OrderPaymentMethod } from "@/types/order.type";
import type { CartItemResponseDto } from "@/services/cart.service";

interface CheckoutState {
  cartItems: CartItemResponseDto[];
  totalAmount: number;
}

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>(
    OrderPaymentMethod.PayOS
  );
  const [error, setError] = useState<string | null>(null);

  const checkout = useCompleteCheckoutFlow();

  // Redirect if no cart items
  if (!state || !state.cartItems || state.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không có dữ liệu thanh toán</h2>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.shippingName.trim()) {
      setError("Vui lòng nhập tên người nhận");
      return false;
    }
    if (!formData.shippingPhone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const result = await checkout.mutateAsync({
        shippingAddress: formData.shippingAddress,
        shippingPhone: formData.shippingPhone,
        shippingName: formData.shippingName,
        notes: formData.notes,
        paymentMethod,
      });

      // Redirect to PayOS if needed
      if (shouldRedirectToPayOS(result)) {
        window.location.href = result.payos?.checkoutUrl || "";
      } else {
        // For other payment methods, redirect to orders page
        navigate("/orders", {
          state: {
            message: "Đơn hàng được tạo thành công. Vui lòng thanh toán.",
            orderId: result.order.orderId,
          },
        });
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi xử lý đơn hàng");
    }
  };

  const paymentMethods = [
    {
      value: OrderPaymentMethod.PayOS,
      label: "PayOS",
      description: "Thanh toán qua PayOS (QR, Ngân hàng)",
    },
    {
      value: OrderPaymentMethod.Cash,
      label: "Thanh toán khi nhận hàng",
      description: "COD (Cash on Delivery)",
    },
    {
      value: OrderPaymentMethod.BankTransfer,
      label: "Chuyển khoản ngân hàng",
      description: "Chuyển tiền trước khi giao",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên người nhận *
                </label>
                <input
                  type="text"
                  name="shippingName"
                  value={formData.shippingName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người nhận"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa chỉ giao hàng *
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ đầy đủ"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ghi chú đơn hàng (tuỳ chọn)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label key={method.value} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) =>
                      setPaymentMethod(parseInt(e.target.value) as OrderPaymentMethod)
                    }
                    className="mt-1"
                  />
                  <div className="ml-3">
                    <p className="font-semibold">{method.label}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {state.cartItems.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span>
                    {item.equipmentName} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{formatCurrency(state.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(state.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={checkout.isPending}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {checkout.isPending ? "Đang xử lý..." : "Tiếp tục thanh toán"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-2 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
