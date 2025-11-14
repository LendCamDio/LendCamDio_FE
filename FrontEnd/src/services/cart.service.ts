import api from "./api";
import { CART_ENDPOINTS } from "../constants/endpoints";
import type { ApiResponse } from "@/types/entity.type";

export interface CartItemDto {
  equipmentId: string;
  quantity: number;
  unitPrice?: number;
}

export interface AddToCartRequest {
  equipmentId: string;
  quantity: number;
}

export interface CartItemResponseDto {
  cartItemId: string;
  cartId: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartResponseDto {
  cartId: string;
  cartItems: CartItemResponseDto[]; // Backend uses "cartItems" not "items"
  totalItems: number;
  totalPrice: number; // Frontend uses totalPrice
  subTotal?: number; // Backend uses subTotal
}

class CartService {
  /**
   * Get current user's cart from backend
   */
  async getCart(): Promise<CartResponseDto | null> {
    try {
      const response = await api.get<ApiResponse<any>>(
        CART_ENDPOINTS.GET
      );
      const cart = response.data.data;
      
      // Transform backend response to match our interface
      if (cart) {
        return {
          cartId: cart.cartId,
          cartItems: cart.cartItems || [],
          totalItems: cart.totalItems || 0,
          totalPrice: cart.subTotal || 0, // Map backend's subTotal to frontend's totalPrice
        };
      }
      
      return null;
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      // Don't return null - throw error so React Query can retry and keep cache
      throw error;
    }
  }

  /**
   * Get cart by ID
   */
  async getCartById(cartId: string): Promise<CartResponseDto | null> {
    try {
      const response = await api.get<ApiResponse<CartResponseDto>>(
        CART_ENDPOINTS.GET_BY_ID(cartId)
      );
      return response.data.data || null;
    } catch (error: any) {
      console.error("Error fetching cart by ID:", error);
      throw error;
    }
  }

  /**
   * Add item to cart
   * POST /api/cart/items
   * Backend returns full CartResponseDto
   */
  async addToCart(
    equipmentId: string,
    quantity: number
  ): Promise<CartResponseDto | null> {
    try {
      const response = await api.post<ApiResponse<any>>(
        CART_ENDPOINTS.ADD_ITEM,
        {
          equipmentId,
          quantity,
        }
      );
      const cart = response.data.data;
      
      // Transform backend response
      if (cart) {
        return {
          cartId: cart.cartId,
          cartItems: cart.cartItems || [],
          totalItems: cart.totalItems || 0,
          totalPrice: cart.subTotal || 0,
        };
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error adding item ${equipmentId} to cart:`, error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   * PUT /api/cart/items/{cartItemId}
   * Backend returns full CartResponseDto
   */
  async updateCartItem(
    cartItemId: string,
    quantity: number
  ): Promise<CartResponseDto | null> {
    try {
      const response = await api.put<ApiResponse<any>>(
        CART_ENDPOINTS.UPDATE_ITEM(cartItemId),
        { quantity }
      );
      const cart = response.data.data;
      
      // Transform backend response
      if (cart) {
        return {
          cartId: cart.cartId,
          cartItems: cart.cartItems || [],
          totalItems: cart.totalItems || 0,
          totalPrice: cart.subTotal || 0,
        };
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error updating cart item ${cartItemId}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/items/{cartItemId}
   */
  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(
        CART_ENDPOINTS.REMOVE_ITEM(cartItemId)
      );
      return response.data.success || false;
    } catch (error: any) {
      console.error(`Error removing cart item ${cartItemId}:`, error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   * DELETE /api/cart/clear
   */
  async clearCart(): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<object>>(
        CART_ENDPOINTS.CLEAR
      );
      return response.data.success || false;
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
}

export const cartService = new CartService();
