import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCreateOrder, useCreateOrderPayment } from '@/hooks/order/useCreateOrder';
import { useUniqueToast } from '@/hooks/notification/useUniqueToast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const showToast = useUniqueToast();
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreateOrderPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user?.id) {
      showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      showToast('Giỏ hàng trống', 'warning');
      return;
    }

    // Simple shipping info collection (you can make this a modal later)
    const shippingAddress = prompt('Nhập địa chỉ giao hàng:', '');
    if (!shippingAddress || shippingAddress.trim() === '') {
      showToast('Vui lòng nhập địa chỉ giao hàng', 'warning');
      return;
    }

    const shippingPhone = prompt('Nhập số điện thoại nhận hàng:', '');
    const shippingName = prompt('Nhập tên người nhận:', '');

    setIsProcessing(true);
    
    try {
      // Create Order with items from local cart (don't need to sync to backend cart)
      showToast('Đang tạo đơn hàng...', 'info');
      const order = await createOrderMutation.mutateAsync({
        shippingAddress: shippingAddress.trim(),
        shippingPhone: shippingPhone || undefined,
        shippingName: shippingName || undefined,
        notes: 'Đơn hàng từ giỏ hàng',
        // Send items directly instead of using backend cart
        orderItems: cart.map(item => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
        })),
      });

      showToast('Đơn hàng đã tạo thành công!', 'success');

      // Create Payment and get PayOS checkout URL
      showToast('Đang tạo liên kết thanh toán...', 'info');
      const payment = await createPaymentMutation.mutateAsync({
        orderId: order.orderId,
        paymentMethod: 2, // PayOS
      });

      // Clear local cart after successful order creation
      clearCart();

      // Step 4: Redirect to PayOS checkout
      showToast('Chuyển đến trang thanh toán...', 'success');
      if (payment && 'checkoutUrl' in payment) {
        window.location.href = (payment as any).checkoutUrl;
      }
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      showToast(
        error.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm thiết bị vào giỏ hàng để mua</p>
          <Button onClick={() => navigate('/products')} className="bg-blue-600 hover:bg-blue-700">
            Xem thiết bị
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🛒 Giỏ hàng</h1>
              <p className="text-gray-600 mt-2">{cart.length} sản phẩm</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">💡 Giỏ hàng dành cho MUA thiết bị</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.equipmentId} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.categoryName}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Số lượng:</span>
                        <div className="flex items-center gap-2 border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.equipmentId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium min-w-[40px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.equipmentId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                            disabled={item.quantity >= item.stockQuantity}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">
                          (Còn {item.stockQuantity} sản phẩm)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.equipmentId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Xóa</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        Đơn giá: <span className="font-medium text-gray-900">{formatCurrency(item.price || 0)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tổng</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(item.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold">{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold text-gray-400">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lượng sản phẩm:</span>
                  <span className="font-semibold">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
              >
                {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>

              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                Tiếp tục mua hàng
              </Button>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-800">
                  ✅ <strong>Thanh toán an toàn:</strong> Sử dụng cổng thanh toán PayOS.
                  Đơn hàng sẽ được tạo và bạn sẽ được chuyển đến trang thanh toán.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
