import api from "./api";
import { CART_ENDPOINTS } from "@/constants/endpoints";

export interface CartItem {
  cartItemId: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  quantity: number;
  dailyPrice: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface Cart {
  cartId: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  equipmentId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  startDate?: string;
  endDate?: string;
}

class CartService {
  // Get current user's cart
  async getCart() {
    const response = await api.get<Cart>(CART_ENDPOINTS.GET);
    return response.data;
  }

  // Get cart by ID
  async getCartById(cartId: string) {
    const response = await api.get<Cart>(CART_ENDPOINTS.GET_BY_ID(cartId));
    return response.data;
  }

  // Add item to cart
  async addToCart(item: AddToCartRequest) {
    const response = await api.post<Cart>(CART_ENDPOINTS.ADD_ITEM, item);
    return response.data;
  }

  // Update cart item
  async updateCartItem(cartItemId: string, update: UpdateCartItemRequest) {
    const response = await api.put<Cart>(
      CART_ENDPOINTS.UPDATE_ITEM(cartItemId),
      update
    );
    return response.data;
  }

  // Remove item from cart
  async removeCartItem(cartItemId: string) {
    const response = await api.delete(CART_ENDPOINTS.REMOVE_ITEM(cartItemId));
    return response.data;
  }

  // Clear entire cart
  async clearCart() {
    const response = await api.delete(CART_ENDPOINTS.CLEAR);
    return response.data;
  }

  // Get cart item count
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.items?.length || 0;
    } catch {
      return 0;
    }
  }
}

export const cartService = new CartService();
export default cartService;
