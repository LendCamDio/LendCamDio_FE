import React, { useState } from 'react';
import { ShoppingCart, Calendar, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/types/entity.type';

interface AddToCartButtonProps {
  equipment: Equipment;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ equipment, className = '' }) => {
  const { addToCart } = useCart();
  const { addBooking } = useBooking();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const isForRent = equipment.type === 0; // 0 = ForRent, 1 = ForSale

  const handleAddToCart = () => {
    addToCart(equipment, quantity);
    alert('Đã thêm vào giỏ hàng!');
    setQuantity(1);
  };

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày thuê');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert('Ngày trả phải sau ngày thuê');
      return;
    }

    addBooking(equipment, startDate, endDate, notes);
    alert('Đã thêm vào lịch đặt thuê!');
    setShowDatePicker(false);
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  if (!equipment.availability) {
    return (
      <Button disabled className={className} variant="outline">
        Hết hàng
      </Button>
    );
  }

  // For equipment FOR SALE
  if (!isForRent) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Số lượng:</label>
          <div className="flex items-center border rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4 py-1 border-x">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(equipment.stockQuantity, quantity + 1))}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </div>
    );
  }

  // For equipment FOR RENT
  if (showDatePicker) {
    return (
      <div className={`space-y-3 p-4 bg-gray-50 rounded-lg ${className}`}>
        <h4 className="font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Chọn thời gian thuê
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">Ngày thuê</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Ngày trả</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600">Ghi chú (tùy chọn)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thêm ghi chú..."
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleBooking}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Xác nhận đặt lịch
          </Button>
          <Button
            onClick={() => setShowDatePicker(false)}
            variant="outline"
            className="flex-1"
          >
            Hủy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowDatePicker(true)}
      className={`${className} bg-green-600 hover:bg-green-700`}
    >
      <Clock className="w-4 h-4 mr-2" />
      Đặt lịch thuê
    </Button>
  );
};
