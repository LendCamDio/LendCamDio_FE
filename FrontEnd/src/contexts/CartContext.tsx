import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Equipment } from '@/types/entity.type';

// Cart Item - chỉ dành cho thiết bị BÁN (ForSale)
export interface CartItem extends Equipment {
  quantity: number;
  totalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (equipment: Equipment, quantity?: number) => void;
  removeFromCart: (equipmentId: string) => void;
  updateQuantity: (equipmentId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lendcamdio_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync với localStorage
  useEffect(() => {
    localStorage.setItem('lendcamdio_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (equipment: Equipment, quantity: number = 1) => {
    // Chỉ cho phép thêm thiết bị BÁN vào giỏ hàng
    if (equipment.type !== 0) { // 0 = ForRent, 1 = ForSale
      const price = equipment.price || 0;
      const existingItem = cart.find(item => item.equipmentId === equipment.equipmentId);
      
      if (existingItem) {
        // Cập nhật số lượng
        setCart(cart.map(item =>
          item.equipmentId === equipment.equipmentId
            ? { ...item, quantity: item.quantity + quantity, totalPrice: price * (item.quantity + quantity) }
            : item
        ));
      } else {
        // Thêm item mới
        const newItem: CartItem = {
          ...equipment,
          quantity,
          totalPrice: price * quantity,
        };
        setCart([...cart, newItem]);
      }
    } else {
      alert('Thiết bị cho thuê không thể thêm vào giỏ hàng. Vui lòng đặt lịch thuê.');
    }
  };

  const removeFromCart = (equipmentId: string) => {
    setCart(cart.filter(item => item.equipmentId !== equipmentId));
  };

  const updateQuantity = (equipmentId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(equipmentId);
      return;
    }
    
    setCart(cart.map(item => {
      if (item.equipmentId === equipmentId) {
        const price = item.price || 0;
        const totalPrice = price * quantity;
        return { ...item, quantity, totalPrice };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('lendcamdio_cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
