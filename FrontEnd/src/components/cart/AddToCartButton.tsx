/**
 * Add to Cart Component
 * Component dùng để thêm sản phẩm (ForSale) vào giỏ hàng
 */
import React, { useState } from "react";
import { useAddToCart } from "@/hooks/cart/useCart";
import type { Equipment } from "@/types/entity.type";

interface AddToCartComponentProps {
  equipment: Equipment;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const AddToCartComponent: React.FC<AddToCartComponentProps> = ({
  equipment,
  onSuccess,
  onError,
  className = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const addToCart = useAddToCart();

  // Check if equipment is for sale
  const isForSale = equipment.type === 1; // 1 = ForSale, 0 = ForRent

  const handleAddToCart = async () => {
    if (!isForSale) {
      onError?.("Sản phẩm này không thể mua. Vui lòng chọn đặt thuê.");
      return;
    }

    if (quantity <= 0) {
      onError?.("Số lượng phải lớn hơn 0");
      return;
    }

    setIsLoading(true);
    try {
      await addToCart.mutateAsync({
        equipmentId: equipment.equipmentId,
        quantity,
      });

      setQuantity(1);
      setShowQuantityInput(false);
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || "Lỗi khi thêm vào giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isForSale) {
    return null;
  }

  if (showQuantityInput) {
    return (
      <div className="flex gap-2">
        <div className="flex items-center border rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2 py-1 hover:bg-gray-100"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center border-x"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-2 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={className}
        >
          {isLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
        </button>
        <button
          onClick={() => {
            setShowQuantityInput(false);
            setQuantity(1);
          }}
          className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
        >
          Hủy
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowQuantityInput(true)}
      disabled={isLoading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? "Đang xử lý..." : "Thêm vào giỏ"}
    </button>
  );
};

export default AddToCartComponent;
