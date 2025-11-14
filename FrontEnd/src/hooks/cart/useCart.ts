import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService, type CartResponseDto } from "@/services/cart.service";

// Query Keys
export const cartQueryKeys = {
  all: ["cart"],
  list: () => [...cartQueryKeys.all, "list"],
  detail: (id: string) => [...cartQueryKeys.all, "detail", id],
};

/**
 * Hook: Get Cart
 * Lấy giỏ hàng hiện tại của user
 */
export const useCart = () => {
  return useQuery({
    queryKey: cartQueryKeys.list(),
    queryFn: () => cartService.getCart(),
    staleTime: 0, // Always stale
    gcTime: 30 * 60 * 1000, // Keep cache 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on focus (to keep cache)
    refetchOnMount: false, // Don't refetch on mount (to keep cache)
    retry: false, // Don't retry on error (keep cache if available)
  });
};

/**
 * Hook: Get Cart By ID
 */
export const useCartById = (cartId: string, enabled = true) => {
  return useQuery({
    queryKey: cartQueryKeys.detail(cartId),
    queryFn: () => cartService.getCartById(cartId),
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook: Add To Cart
 * Thêm item vào giỏ hàng
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { equipmentId: string; quantity: number }) => {
      return await cartService.addToCart(params.equipmentId, params.quantity);
    },
    onSuccess: (updatedCart) => {
      // Backend returns full updated cart, just use it directly
      if (updatedCart) {
        queryClient.setQueryData(cartQueryKeys.list(), updatedCart);
      }
    },
  });
};

/**
 * Hook: Update Cart Item
 * Cập nhật số lượng item trong giỏ hàng
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { cartItemId: string; quantity: number }) => {
      return await cartService.updateCartItem(params.cartItemId, params.quantity);
    },
    onSuccess: (updatedCart) => {
      // Backend returns full updated cart, just use it directly
      if (updatedCart) {
        queryClient.setQueryData(cartQueryKeys.list(), updatedCart);
      }
    },
  });
};

/**
 * Hook: Remove From Cart
 * Xóa item khỏi giỏ hàng
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      return await cartService.removeFromCart(cartItemId);
    },
    onSuccess: (_, cartItemId) => {
      queryClient.setQueryData(cartQueryKeys.list(), (old: CartResponseDto | null) => {
        if (!old) return old;

        const itemToRemove = old.cartItems.find((item) => item.cartItemId === cartItemId);
        if (!itemToRemove) return old;

        const updatedItems = old.cartItems.filter((item) => item.cartItemId !== cartItemId);

        return {
          ...old,
          cartItems: updatedItems,
          totalItems: old.totalItems - itemToRemove.quantity,
          totalPrice: old.totalPrice - itemToRemove.totalPrice,
        };
      });
    },
  });
};

/**
 * Hook: Clear Cart
 * Xóa toàn bộ giỏ hàng
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await cartService.clearCart();
    },
    onSuccess: () => {
      queryClient.setQueryData(cartQueryKeys.list(), null);
    },
  });
};
