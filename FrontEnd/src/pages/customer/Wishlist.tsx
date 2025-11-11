import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import { Heart, Trash2, ShoppingCart, Package } from "lucide-react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  available: boolean;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  const addToCart = (item: WishlistItem) => {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item already in cart
    const existingItem = cart.find(
      (cartItem: any) => cartItem.name === item.name
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Đã thêm vào giỏ hàng");
  };

  const clearWishlist = () => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?"
      )
    ) {
      setWishlist([]);
      localStorage.removeItem("wishlist");
      toast.success("Đã xóa tất cả sản phẩm");
    }
  };

  if (wishlist.length === 0) {
    return (
      <PageWrapper>
        <div className="min-page-height flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-white rounded-lg shadow-md max-w-md"
          >
            <div className="inline-flex p-6 bg-red-50 rounded-full mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Danh sách trống</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm sản phẩm
              vào danh sách!
            </p>
            <button
              onClick={() => navigate("/cameras")}
              className="btn-primary"
            >
              Khám phá sản phẩm
            </button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-page-height bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                  Danh sách yêu thích
                </h1>
                <p className="text-gray-600">
                  Bạn có {wishlist.length} sản phẩm trong danh sách yêu thích
                </p>
              </div>
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
              )}
            </div>
          </motion.div>

          {/* Wishlist Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="relative group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                  <h3
                    className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-blue-600 font-bold text-lg">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm text-gray-500">/ngày</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                    </button>
                    <button
                      onClick={() => navigate(`/products/${item.id}`)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Package className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center gap-4"
          >
            <button
              onClick={() => navigate("/cameras")}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate("/customer/cart")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Xem giỏ hàng
            </button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Wishlist;
