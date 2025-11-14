import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Giỏ hàng ({getTotalItems()})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="text-lg">Giỏ hàng trống</p>
              <p className="text-sm">Thêm thiết bị để bắt đầu thuê</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.equipmentId} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.categoryName}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {item.quantity} sản phẩm
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.equipmentId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.equipmentId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                            disabled={item.quantity >= item.stockQuantity}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.equipmentId)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t flex justify-between text-sm">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(item.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>Tổng thanh toán:</span>
                <span className="text-blue-600">{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
            <Button 
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Tiến hành thanh toán
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
